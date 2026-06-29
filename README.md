# Gul Hameed — Portfolio

A premium, dark, terminal-inspired one-page portfolio for **Gul Hameed (@gdroz3r)** —
Senior Security Engineer · Web2 & Web3 Auditor.

No build step. No frameworks. No trackers. Just fast, hand-written HTML/CSS/JS.

## ✦ Features

- **Terminal-boot preloader** and an **interactive command-line** in the contact section
  (try `help`, `whoami`, `skills`, `work`, `contact`, `sudo`).
- **Code-rain canvas**, animated aurora + grid background (battery-aware, pauses off-tab).
- **Custom cursor**, magnetic buttons, 3D tilt cards, scroll reveals, animated counters.
- Typed role cycling, scroll-progress bar, auto-hiding nav, active-section highlighting.
- Fully **responsive** + honors `prefers-reduced-motion` for accessibility.
- Sections: Hero · Stats · About · Ecosystems · Skills · Audit work · Tools · Writing · Contact.

## ✦ Project structure

```
gulsite/
├── index.html        # markup + content
├── css/styles.css    # design system + all styling
├── js/main.js        # all interactions (vanilla, dependency-free)
└── README.md
```

## ✦ Run locally

Just open `index.html` in a browser, or serve it (recommended, so fonts/canvas behave):

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Then visit http://localhost:8080

## ✦ Deploy

### GitHub Pages (fits your GitHub-centric profile)
1. Create a repo, e.g. `gdroz3r/portfolio` (or use `gdroz3r.github.io` for a root URL).
2. Push these files to the `main` branch.
3. Settings → Pages → Source: `Deploy from a branch` → `main` / `root`.
4. Live at `https://gdroz3r.github.io/portfolio/` (or `https://gdroz3r.github.io/`).

### Vercel / Netlify
Drag-and-drop the folder, or connect the repo. No build command, output dir = `.`.

## ✦ Customize

- **Content**: edit `index.html` (audits, links, writing — all plain markup).
- **Colors / fonts**: tweak the CSS variables at the top of `css/styles.css` (`:root`).
- **Terminal commands**: add entries to the `commands` object in `js/main.js`.

## ✦ Editorial note

Audit descriptions were written from your public GitHub profile. A few protocol
one-liners (e.g. what each audit covered) are reasonable summaries — please review and
correct any specifics before sharing publicly. Also swap the writing-section links and
add real article URLs / live audit-report links where you have them.
