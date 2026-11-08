// Desktop shell: era loading, wallpaper, menubar/clock/menus, dock, window manager

import { ERAS, eraById } from "./eras.js";
import { APPS, appById } from "./apps.js";
import { State, SetupState } from "./state.js";

/* ---------- Boot into era ---------- */

const qs = new URLSearchParams(location.search);
const eraId = qs.get("era") || State.get("last-era") || ERAS[ERAS.length - 1].id;
const era = eraById(eraId);
State.set("last-era", era.id);

document.body.dataset.era = era.id;
const eraSheet = document.getElementById("era-stylesheet");
eraSheet.href = era.stylesheet;

// Gate desktop behind setup assistant (first run).
if (!SetupState.isComplete()) {
  location.replace(`setup/assistant.html?era=${encodeURIComponent(era.id)}`);
}

/* ---------- Wallpaper ---------- */

const WALLPAPER_PATH = (id) => `assets/wallpapers/${id}.svg`;
function applyWallpaper(id) {
  const target = id || State.eraGet(era.id, "wallpaper", era.defaultWallpaper);
  State.eraSet(era.id, "wallpaper", target);
  document.getElementById("wallpaper").style.backgroundImage =
    `url("${WALLPAPER_PATH(target)}")`;
}
applyWallpaper();

/* ---------- Clock ---------- */

function pad(n) { return String(n).padStart(2, "0"); }
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function updateClock() {
  const d = new Date();
  const h12 = ((d.getHours() + 11) % 12) + 1;
  const am  = d.getHours() < 12 ? "AM" : "PM";
  document.getElementById("menubar-date").textContent =
    `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  document.getElementById("menubar-clock").textContent =
    `${h12}:${pad(d.getMinutes())} ${am}`;
}
updateClock();
setInterval(updateClock, 1000 * 15);

/* ---------- Dropdown menus ---------- */

const menus = {
  prism: document.getElementById("prism-menu"),
  control: document.getElementById("control-center"),
};

document.querySelectorAll("[data-menu]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const key = btn.dataset.menu;
    const node = menus[key];
    if (!node) return;
    // close others
    Object.values(menus).forEach((n) => (n.hidden = true));
    node.hidden = !node.hidden;
    // position under the button
    const r = btn.getBoundingClientRect();
    if (key === "control") {
      node.style.right = `${Math.max(10, window.innerWidth - r.right)}px`;
      node.style.left = "auto";
    } else {
      node.style.left = `${Math.max(6, r.left)}px`;
      node.style.right = "auto";
    }
  });
});
document.addEventListener("click", () => {
  Object.values(menus).forEach((n) => (n.hidden = true));
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") Object.values(menus).forEach((n) => (n.hidden = true));
});

/* ---------- Prism menu commands ---------- */

menus.prism.querySelectorAll("[data-cmd]").forEach((li) => {
  li.addEventListener("click", () => {
    const cmd = li.dataset.cmd;
    menus.prism.hidden = true;
    switch (cmd) {
      case "about":      openApp("about"); break;
      case "settings":   openApp("settings"); break;
      case "era-picker": location.href = "index.html"; break;
      case "reset-setup":
        SetupState.reset();
        location.reload();
        break;
      case "shutdown":
        if (confirm("Shut down Prism OS?")) {
          document.body.style.transition = "opacity .5s";
          document.body.style.opacity = 0;
          setTimeout(() => (location.href = "index.html"), 500);
        }
        break;
    }
  });
});

/* ---------- Dock ---------- */

const dockEl = document.getElementById("dock");
for (const app of APPS.filter((a) => a.dock)) {
  const btn = document.createElement("button");
  btn.className = "dock__item";
  btn.dataset.appId = app.id;
  btn.innerHTML = `
    <img src="${app.icon}" alt="${app.name}" />
    <span class="dock__tooltip">${app.name}</span>
  `;
  btn.addEventListener("click", () => openApp(app.id));
  dockEl.appendChild(btn);
}

/* ---------- Window manager ---------- */

const desktopEl = document.getElementById("desktop");
const winTpl = document.getElementById("window-template");
let topZ = 100;
const openWindows = new Map(); // appId -> { el, iframe }

function openApp(appId) {
  const app = appById(appId);
  if (!app) return;

  const existing = openWindows.get(appId);
  if (existing) {
    focusWindow(existing.el);
    existing.el.classList.remove("is-minimized");
    return;
  }

  const node = winTpl.content.firstElementChild.cloneNode(true);
  node.dataset.appId = appId;
  node.querySelector(".window__title").textContent = app.name;

  const iframe = node.querySelector("iframe");
  iframe.src = `${app.url}?era=${era.id}`;
  iframe.title = app.name;

  const w = app.defaultSize?.w ?? 720;
  const h = app.defaultSize?.h ?? 480;
  const maxW = Math.max(300, window.innerWidth  - 40);
  const maxH = Math.max(220, window.innerHeight - 60 - var_dock());
  const W = Math.min(w, maxW);
  const H = Math.min(h, maxH);
  node.style.width  = `${W}px`;
  node.style.height = `${H}px`;
  // cascade
  const offset = openWindows.size * 24;
  node.style.left = `${Math.max(20, (window.innerWidth  - W) / 2 + offset)}px`;
  node.style.top  = `${Math.max(var_menubar() + 16, (window.innerHeight - H) / 2 - var_dock() / 2 + offset)}px`;

  wireWindow(node, iframe, appId);
  desktopEl.appendChild(node);
  focusWindow(node);
  // mark dock running
  dockEl.querySelector(`[data-app-id="${appId}"]`)?.classList.add("is-running");

  openWindows.set(appId, { el: node, iframe });
}

function focusWindow(el) {
  topZ += 1;
  el.style.zIndex = topZ;
  for (const w of openWindows.values()) w.el.classList.remove("is-focused");
  el.classList.add("is-focused");
  const appId = el.dataset.appId;
  const app = appById(appId);
  document.getElementById("active-app-name").textContent = app?.name || "Prism";
}

function closeWindow(appId) {
  const rec = openWindows.get(appId);
  if (!rec) return;
  rec.el.classList.add("is-closing");
  setTimeout(() => {
    rec.el.remove();
    openWindows.delete(appId);
    dockEl.querySelector(`[data-app-id="${appId}"]`)?.classList.remove("is-running");
    if (openWindows.size === 0) {
      document.getElementById("active-app-name").textContent = "Prism";
    }
  }, 180);
}

function minimizeWindow(appId) {
  const rec = openWindows.get(appId);
  if (!rec) return;
  rec.el.classList.add("is-minimized");
}

function zoomWindow(appId) {
  const rec = openWindows.get(appId);
  if (!rec) return;
  const el = rec.el;
  if (el.dataset.zoomed === "1") {
    el.style.left = el.dataset.prevLeft;
    el.style.top = el.dataset.prevTop;
    el.style.width = el.dataset.prevWidth;
    el.style.height = el.dataset.prevHeight;
    el.dataset.zoomed = "";
  } else {
    el.dataset.prevLeft = el.style.left;
    el.dataset.prevTop = el.style.top;
    el.dataset.prevWidth = el.style.width;
    el.dataset.prevHeight = el.style.height;
    el.style.left = "16px";
    el.style.top = `${var_menubar() + 8}px`;
    el.style.width = `${window.innerWidth - 32}px`;
    el.style.height = `${window.innerHeight - var_menubar() - var_dock() - 24}px`;
    el.dataset.zoomed = "1";
  }
}

function wireWindow(el, iframe, appId) {
  el.addEventListener("mousedown", () => focusWindow(el), true);

  el.querySelector('[data-win="close"]').addEventListener("click", (e) => { e.stopPropagation(); closeWindow(appId); });
  el.querySelector('[data-win="min"]').addEventListener("click",   (e) => { e.stopPropagation(); minimizeWindow(appId); });
  el.querySelector('[data-win="zoom"]').addEventListener("click",  (e) => { e.stopPropagation(); zoomWindow(appId); });

  // Drag from chrome
  const chrome = el.querySelector(".window__chrome");
  let dragStart = null;
  chrome.addEventListener("mousedown", (e) => {
    if (e.target.closest(".window__traffic")) return;
    dragStart = {
      x: e.clientX, y: e.clientY,
      left: parseFloat(el.style.left), top: parseFloat(el.style.top),
    };
    document.body.style.cursor = "grabbing";
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (!dragStart) return;
    const nx = dragStart.left + (e.clientX - dragStart.x);
    const ny = Math.max(var_menubar(), dragStart.top + (e.clientY - dragStart.y));
    el.style.left = `${nx}px`;
    el.style.top = `${ny}px`;
  });
  document.addEventListener("mouseup", () => {
    if (dragStart) { dragStart = null; document.body.style.cursor = ""; }
  });

  // Resize from corner
  const grip = el.querySelector('[data-win="resize"]');
  let rs = null;
  grip.addEventListener("mousedown", (e) => {
    rs = { x: e.clientX, y: e.clientY, w: el.offsetWidth, h: el.offsetHeight };
    e.stopPropagation();
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (!rs) return;
    el.style.width  = `${Math.max(260, rs.w + (e.clientX - rs.x))}px`;
    el.style.height = `${Math.max(180, rs.h + (e.clientY - rs.y))}px`;
  });
  document.addEventListener("mouseup", () => { rs = null; });
}

/* ---------- CSS var readers (returns px numbers) ---------- */

function var_menubar() {
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--menubar-h")) || 26;
}
function var_dock() {
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--dock-h")) || 72;
}

/* ---------- postMessage protocol from apps ---------- */

window.addEventListener("message", (e) => {
  const d = e.data || {};
  if (!d || typeof d !== "object" || !d.type) return;
  switch (d.type) {
    case "prism:open-app":    openApp(d.appId); break;
    case "prism:close":       closeWindow(d.appId); break;
    case "prism:wallpaper":   applyWallpaper(d.wallpaperId); break;
    case "prism:choose-era":  location.href = "index.html"; break;
    case "prism:reload-shell": location.reload(); break;
  }
});

/* ---------- Expose a tiny API for debugging ---------- */
window.PrismOS = { openApp, applyWallpaper, era };
