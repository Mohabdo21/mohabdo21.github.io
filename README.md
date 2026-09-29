# mohabdo21.github.io

Source for [mohabdo21.github.io](https://mohabdo21.github.io), the portfolio site hosted
free on GitHub Pages.

Plain static files, no build step and no dependencies.

## Layout

- `index.html` - the whole site
- `style.css` - light and dark themes via `data-theme` on `<html>`
- `script.js` - theme toggle
- `favicon.svg` - icon
- `.nojekyll` - disables the Jekyll build so files are served verbatim

## Deploys

Publishing source is `main` / `/(root)`, so every push to `main` republishes the site.
GitHub runs the build with a workflow even in this mode; changes can take a few minutes
to go live.

Edit the project list in `index.html` when publishing something new. The repository must
stay public, because GitHub Pages on GitHub Free does not serve private repositories.
