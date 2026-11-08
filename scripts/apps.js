// App registry. Each app gets its own HTML page loaded via iframe.
// Keeping each app isolated keeps the Transfer-app bundle step tractable:
// every app is one self-contained HTML file.

export const APPS = [
  {
    id: "settings",
    name: "Settings",
    icon: "assets/icons/settings.svg",
    url: "apps/settings.html",
    dock: true,
    defaultSize: { w: 820, h: 560 },
  },
  {
    id: "notes",
    name: "Notes",
    icon: "assets/icons/notes.svg",
    url: "apps/notes.html",
    dock: true,
    defaultSize: { w: 760, h: 520 },
  },
  {
    id: "calculator",
    name: "Calculator",
    icon: "assets/icons/calculator.svg",
    url: "apps/calculator.html",
    dock: true,
    defaultSize: { w: 280, h: 420 },
  },
  {
    id: "files",
    name: "Files",
    icon: "assets/icons/files.svg",
    url: "apps/files.html",
    dock: true,
    defaultSize: { w: 820, h: 540 },
  },
  {
    id: "browser",
    name: "Browser",
    icon: "assets/icons/browser.svg",
    url: "apps/browser.html",
    dock: true,
    defaultSize: { w: 980, h: 620 },
  },
  {
    id: "transfer",
    name: "Transfer",
    icon: "assets/icons/transfer.svg",
    url: "apps/transfer.html",
    dock: true,
    defaultSize: { w: 540, h: 480 },
  },
  {
    id: "about",
    name: "About This Prism",
    icon: "assets/icons/about.svg",
    url: "apps/about.html",
    dock: false,
    defaultSize: { w: 460, h: 540 },
  },
];

export function appById(id) {
  return APPS.find((a) => a.id === id);
}
