// Boot sequence: mascot splash + chime + era picker
import { ERAS } from "./eras.js";
import { playBootChime } from "./chime.js";

const bootStage = document.getElementById("boot-stage");
const pickerStage = document.getElementById("picker-stage");
const eraGrid = pickerStage.querySelector(".era-grid");
const cardTpl = document.getElementById("era-card-template");

const BOOT_MS = 2600;

async function boot() {
  // Chime after a user gesture would be ideal, but most browsers allow
  // short played-once chimes on page load after a user visits once.
  // We try, and swallow the autoplay rejection silently.
  try { await playBootChime(); } catch { /* autoplay blocked */ }

  // Render era cards in the background so they're ready when we swap
  renderEraCards();

  setTimeout(toPicker, BOOT_MS);
}

function toPicker() {
  bootStage.classList.add("leaving");
  setTimeout(() => {
    bootStage.hidden = true;
    pickerStage.hidden = false;
    document.body.classList.remove("phase-boot");
    document.body.classList.add("phase-picker");
    // focus first card for keyboard users
    eraGrid.querySelector("button")?.focus();
  }, 580);
}

function renderEraCards() {
  for (const era of ERAS) {
    const node = cardTpl.content.firstElementChild.cloneNode(true);
    node.querySelector(".era-card__name").textContent = era.name;
    node.querySelector(".era-card__year").textContent = era.year;
    node.querySelector(".era-card__desc").textContent = era.description;

    const art = node.querySelector(".era-card__art");
    art.style.background = era.previewBg;

    node.addEventListener("click", () => {
      // Soft chime for selection
      playBootChime(0.4).catch(() => {});
      location.href = `desktop.html?era=${encodeURIComponent(era.id)}`;
    });
    eraGrid.appendChild(node);
  }
}

boot();
