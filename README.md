# Macbook-World — Prism OS

A browser-based retro-computing desktop simulator. Boot a chime, pick an era, land in a themed working desktop. Everything in this project is original art and original code — a parody love-letter to four decades of personal computing, not a replica of any real OS.

## What's inside

- **Boot sequence** with an original chime and mascot splash
- **Era picker** — pick which decade's aesthetic to boot into
  - **Dawn** — early pixel era (b&w, 1-bit vibe)
  - **Noon** — beveled platinum (grey, chunky)
  - **Dusk** — glossy glass (saturated, wet)
  - **Nightfall** — frosted modern (translucent, blurred)
- **Shell** — menu bar, dock, draggable windows, control center
- **Apps** — Settings, Notes, Calculator, Files, Browser, Transfer, About
- **Setup Assistant** — first-run welcome + parody license
- **Transfer** — exports the current era as a single standalone HTML file you can open offline anywhere

## Running locally

Any static file server works. The quickest:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Legal

This project is an original work of parody fiction. Nothing in it is produced by, endorsed by, or affiliated with any computer company. All imagery, icons, wallpapers, fonts (system stack), sound, and text are either original to this project or used from the operating system's built-in font stack. If you think something in here infringes your rights, open an issue.

## License

MIT — see [LICENSE](LICENSE).
