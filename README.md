# Nasi website

Marketing site for **Nasi: Recipe Saver** (iPhone). React 18 + Vite, framer-motion for motion, Three.js (react-three-fiber) for the 3D ingredients and the nasi bowl, Lenis for smooth scrolling.

## Deploy to Netlify
1. `npm install`
2. `npm run build`
3. Drag the `dist/` folder onto Netlify (or connect the Git repo, recommended so blog posts deploy automatically) (Sites → Add new site → Deploy manually).
`netlify.toml` already sets the publish folder and long-term caching for `/assets/*`.

## Blog (Nasi Kitchen Journal)
- Posts live in `content/blog/*.md` (Markdown + front matter). `npm run build` turns them into `/blog/`, `/blog/{slug}/`, `sitemap.xml`, `robots.txt` and `/blog/rss.xml`.
- Privacy policy: `content/privacy.md` → `/privacy/`.
- Site URL, App Store link and contact email: `site.config.json`.
- The 6-month SEO plan and the daily writer brief are in `content-engine/`.
- For the daily automation, connect this repo to Netlify (build command `npm run build`, publish `dist`) so every pushed post deploys itself.

## Where things live
- `src/sections/Hero.jsx`: nav, hero (reels flying into the app), sources marquee
- `src/sections/Story.jsx`: pinned scroll story: reel → share sheet → Nasi watches/listens/reads → recipe
- `src/sections/Features.jsx`: import methods, interactive recipe, cookbook search, plan + Tote (drag and drop), cook mode
- `src/sections/End.jsx`: pricing, FAQ, final call to action, footer
- `src/screens.jsx`: app screens rebuilt from the real app UI at 390×844 points
- `src/data.js`: recipes, the noodle reel's heard/seen/read lines, cookbooks, plan, grocery data, FAQ
- `src/three/`: procedural 3D ingredients and the nasi bowl
