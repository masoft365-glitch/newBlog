```markdown
# Pulse — Static Blog Rebuild (HTML/CSS/JS)

This is a static, deployable blog template built with plain HTML, CSS and JavaScript.
It focuses on trends and content categories: Dev, AI, Tech, Education, Finance,
Google/YouTube trends, Social (Instagram/Facebook/X), and Reddit trends.

Files:
- index.html — main entry
- styles.css — theme and layout
- script.js — client-side SPA logic (loads posts.json)
- posts.json — posts data (edit or replace)
- vercel.json — rewrite for client-side routing

How to run locally:
1. Serve the folder with any static server. Example with Node:
   npx serve .    OR   npx http-server -c-1
2. Open http://localhost:5000 (port depends on your server)

How to deploy to Vercel:
1. Push these files to a repository on GitHub.
2. Create a new project on https://vercel.com and import the repo.
3. Vercel will detect it's a static site; the rewrite in vercel.json ensures client-side routes work.
4. Optionally set the framework to "Other" and build command none — static.

Content workflow:
- Edit posts.json to add or update posts. Each post should contain:
  id, title, date, author, readTime, excerpt, category (one of dev/ai/tech/edu/finance/google/social/reddit), tags, html or content.
- You can also extend script.js to fetch posts from an API or Markdown converter.

Monetization & growth tips:
- Add a fast-loading ad provider (e.g., contextual or header bidding) or sponsored posts.
- Integrate an affiliate program for tools & courses in Dev/AI/Finance posts.
- Use an email capture (Mailchimp/ConvertKit) for newsletters summarizing trending posts.
- SEO: generate sitemap.xml and Open Graph tags for each post; server-side prerender if you need better indexing.

Feature ideas / next steps:
- Add Markdown support (a build step to convert .md to posts.json).
- Add RSS feed generation.
- Integrate analytics (Plausible, Google Analytics, or a privacy-friendly provider).
- Add a lightweight admin interface to publish posts (if you want no Git editing).
- Add serverless functions to fetch trending data from APIs (Google Trends, YouTube API, Reddit).

If you want, I can:
- Create a branch in this repository and push these files, opening a PR.
- Convert your existing React pages into the new static format automatically.
- Add Markdown-to-JSON build script and a small GitHub Action to rebuild posts.json on new markdown commits.
```