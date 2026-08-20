# Plan: Import GitHub Repo + Build Portfolio Website

## Current state

- The Lovable project is a fresh TanStack Start template with a placeholder `src/routes/index.tsx`.
- Lovable does **not** support directly importing an existing GitHub repository. The supported path is to connect the GitHub connector and then manually copy/adapt the code into the project.
- The target repo `https://github.com/Ra-Sunchild/sunchild-e1dd3ed0` is not publicly accessible (GitHub API returns `404`), so we will need to connect it via the Lovable GitHub connector to read its contents.

## What we will build

1. Connect the Lovable GitHub connector so the project can read the private repo.
2. Fetch the repository tree and `README` to understand its structure and content.
3. Migrate the repo's assets and code into the Lovable project, adapting it to TanStack Start + Tailwind v4 conventions.
4. Replace the placeholder `src/routes/index.tsx` with a portfolio home page based on the imported content.
5. Add any secondary routes the portfolio needs (e.g., about, projects, contact).
6. Add unique SEO `head()` metadata for each route.

## Technical approach

- Use the GitHub connector / gateway to read private repo contents without exposing tokens in the browser.
- Copy the repo's code into `src/` and `public/` as needed; rename files to fit TanStack Start conventions.
- Keep all styling through the project's Tailwind v4 semantic tokens (`src/styles.css`) and avoid hardcoded colors.
- Use `createServerFn` if we need server-side GitHub data at runtime; otherwise, treat the imported repo as static content.

## Out of scope / assumptions

- We will not try to set up two-way sync back to the original repo, because Lovable does not support that for existing repos.
- We will preserve the original visual direction from the repo when it is available; if the repo is empty or just a stub, we will build a clean minimal portfolio.
- We will connect the GitHub connector only after you approve the plan, since it requires your authorization.

## Deliverables

- A running portfolio website at `/`.
- All imported repo content adapted to the Lovable project structure.
- SEO metadata on each route.
- A short summary of any connector or migration issues encountered.
