// Era catalog. Each era is an original aesthetic, not tied to any real OS release.

export const ERAS = [
  {
    id: "primeval",
    name: "Primeval",
    year: "the phosphor age",
    description: "A green CRT at 2 a.m. Scanlines included. BASIC optional.",
    stylesheet: "styles/eras/primeval.css",
    defaultWallpaper: "phosphor-grid",
    previewBg: "radial-gradient(circle at 50% 50%, #0d1f0d, #030a03)"
  },
  {
    id: "dawn",
    name: "Dawn",
    year: "the early days",
    description: "A monochrome, pixel-sharp era. Chunky windows, thin shadows, one-bit joy.",
    stylesheet: "styles/eras/dawn.css",
    defaultWallpaper: "dither-pond",
    previewBg: "repeating-linear-gradient(45deg, #1b1b1b 0 2px, #e7e5df 2px 4px)"
  },
  {
    id: "noon",
    name: "Noon",
    year: "the beveled era",
    description: "Platinum grey, sculpted bezels, chunky controls, racing stripes.",
    stylesheet: "styles/eras/noon.css",
    defaultWallpaper: "ridge-midday",
    previewBg: "linear-gradient(180deg, #d9dbe0, #a9adb5)"
  },
  {
    id: "dusk",
    name: "Dusk",
    year: "the glossy years",
    description: "Wet-look pinstripes, candy buttons, chrome that drips.",
    stylesheet: "styles/eras/dusk.css",
    defaultWallpaper: "ocean-sunset",
    previewBg: "linear-gradient(180deg, #8ba8ff 0%, #4972d9 60%, #2a4aa8 100%)"
  },
  {
    id: "horizon",
    name: "Horizon",
    year: "warm minimal",
    description: "Cream and terracotta. An airy, sunlit desktop with nothing in the way.",
    stylesheet: "styles/eras/horizon.css",
    defaultWallpaper: "sunrise-wash",
    previewBg: "linear-gradient(180deg, #fff2d6 0%, #ffd48a 40%, #d9634a 100%)"
  },
  {
    id: "twilight",
    name: "Twilight",
    year: "pink-hour glass",
    description: "Warm violet glass, the magic-hour cousin of the dark eras.",
    stylesheet: "styles/eras/twilight.css",
    defaultWallpaper: "ribbons",
    previewBg: "linear-gradient(135deg, #ff7bca 0%, #8f6aff 60%, #2a104a 100%)"
  },
  {
    id: "nightfall",
    name: "Nightfall",
    year: "the frosted present",
    description: "Liquid glass, deep bokeh, translucent everything.",
    stylesheet: "styles/eras/nightfall.css",
    defaultWallpaper: "aurora-glass",
    previewBg: "radial-gradient(circle at 30% 30%, #c6a3ff, #4b2a9d 70%, #140420)"
  }
];

export function eraById(id) {
  return ERAS.find((e) => e.id === id) || ERAS[ERAS.length - 1];
}
