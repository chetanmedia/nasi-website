# Nasi Kitchen Journal: daily writer brief

Each day the scheduled task writes **one post** from `content-engine/nasi-content-plan.json` (the 181-day Ubersuggest plan) and commits it to the repo. Netlify runs `npm run build`, and the journal, sitemap and RSS update themselves.

## Pick today's post
1. Take the first row with `"status": "planned"`, in date order. If launch slipped, ignore the plan dates and just go in order. Seasonal rows (`pinned: true`) belong 3–4 weeks before their holiday. If that window has passed, skip the row and leave it for next year.
2. After publishing, set that row's `status` to `"published"`.

## File to create
`content/blog/{slug}.md`. The `slug` comes from the plan. Never change a published slug.

```md
---
title: <plan title>
description: <140–155 characters with the primary keyword and a benefit>
date: <YYYY-MM-DD, today>
cluster: <APP | SAVE | PLAN | REF | IDEAS | SEAS | FAM>
cover: <one of: noodles lemak marry salmon paneer shak burrata cookies mango tofu reel1 reel2>
keywords: [<primary>, <secondaries…>]
faq:
  - q: <question from secondary keywords / People Also Ask>
    a: <2–3 sentence answer>
---

<body in Markdown: ## for sections, ### for sub-sections, tables with | pipes |>
```

Posts dated in the future stay hidden until their day, so posts can be queued ahead.

## Writing rules
- Answer the search query in the first 2–3 sentences.
- Use `##` headings phrased as real questions. The table of contents builds from them.
- REF posts must include a quick-reference table. APP posts must include a comparison table.
- Link every slug in the row's `internal_links` as `../{slug}/`, plus 1–2 other relevant posts. Link the home page as `../../`.
- Mention Nasi naturally once, using the row's `nasi_feature`, in a closing section. The page adds its own App Store call-out, so there is no need to repeat one.
- Include 3–5 FAQ items in the front matter. They render on the page and as FAQ schema automatically.
- Length: about 2,200 words for pillar posts, 1,800 for APP, 900 for REF and 1,400 for everything else.
- Voice: warm and practical, short sentences, US spelling and units, with metric in brackets for REF posts. No hype words.

## Facts about Nasi (do not contradict)
- **Imports:** TikTok, Instagram Reels and Facebook videos, photo or screenshot scan, PDF (one recipe per PDF), pasted text, or written by hand. Recipe websites are **not** supported. Do not claim them.
- **Features:** meal plan, shopping list (Tote), hands-free cook mode with timers, servings scaling, cookbooks, search.
- **Pricing:** free with 3 imports a week. Nasi Pro is $29.99 a year with a 3-day free trial ($2.50 a month). Do not quote a monthly price.
- **App Store:** https://apps.apple.com/us/app/nasi-recipe-saver/id6809348987
- **Competitor posts:** check the competitor's current pricing and features on its own site before writing. Never invent numbers.

## Daily run checklist
1. Pick the row and run a quick SERP check on the primary keyword.
2. Write `content/blog/{slug}.md`, then run `npm run build` locally to catch errors.
3. Set the row's `status` to `"published"` in the plan JSON.
4. Commit both files and push. Netlify deploys.

## Topics that touch unsupported sources
- Nasi cannot import YouTube, Pinterest or recipe website/blog links. For posts about Pinterest pins or long recipe blogs, the honest Nasi route is: screenshot the recipe and scan it, or copy the recipe text and paste it into Nasi. Never say Nasi opens or reads the link.
