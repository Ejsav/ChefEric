# Photography guide

The 19 photographs that replace the placeholders on the website. Each one comes with a screenshot of exactly where it goes, its file name, and a shooting brief.

- `index.html`: the guide. Open it in any browser, on a phone or a computer. It uses the screenshots in `img/`.
- `Ray-Gennaro-Photography-Guide.pdf`: the printable version (27 pages, one photograph per page).
- `source/`: the scripts that produced it.
  - `shoot.mjs` captures the marked screenshots from a running build.
  - `data.py` holds the briefs.
  - `build.py` writes the HTML.
  - `render.mjs` makes the PDF.

To regenerate after the site changes:

1. Run `npm run build && npx next start -p 3100` in the repo root.
2. Run `node shoot.mjs`.
3. Convert the screenshots into `site/img/`.
4. Run `python3 build.py && node render.mjs`.

The shared version of the guide is published at https://claude.ai/artifact/B7gqBbTQQFL8BVH52v8sAn. It is private until shared from its Share menu.
