# ANX4 OS

A Linux-inspired experimental desktop simulated entirely in the browser, by ANIXE444.
Browser-based simulation: no real operating system or Linux kernel is installed or run.

## Structure
- `index.html` – entry page (loads the files below with relative paths)
- `css/style.css` – all styles
- `js/app.js` – window manager, terminal, file manager, browser, settings, apps
- `assets/` – favicon and placeholder wolf mark
- `.nojekyll`, `404.html` – GitHub Pages support

## Publish on GitHub Pages
1. Create a repository and upload the contents of this folder (so `index.html` is at the repository root).
2. Go to Settings → Pages. Under "Build and deployment" choose "Deploy from a branch", branch `main`, folder `/ (root)`, then Save.
3. After a minute the site is live at `https://<username>.github.io/<repository>/`.

## Notes
- No server, build step or API key is needed. All paths are relative, so it works under a `/<repository>/` sub-path.
- Data (files, settings, bookmarks) lives in the visitor's browser `localStorage`. Passwords are never stored.
- The Web Browser app cannot fetch or embed search results from a static site; it opens the chosen search engine in a new tab. Real in-window results would need a backend or search API proxy that keeps the key secret.
- The wolf logo is an original placeholder. To use the official ANIXE444 image, add it as `assets/anixe444.png` and replace the `logo()` function in `js/app.js` with an `<img src="assets/anixe444.png">`.
