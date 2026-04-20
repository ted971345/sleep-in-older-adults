# Sleep in Older Adults: Case Reasoning Lab

An educational React + TypeScript + Vite app for practicing case-based clinical reasoning around sleep in older adults.

This project scaffolds the learning app, establishes the folder structure, defines core domain types, and builds a responsive layout shell. It now includes a local, data-driven interactive case player for staged reasoning practice.

## Tech Stack

- React
- TypeScript
- Vite
- CSS design tokens
- Hash-based routing for static hosting compatibility

## Project Structure

```text
src/
  app/                 App composition and app-level routing
  assets/              Static or generated app assets
  components/          Shared UI components
    illustrations/     Lightweight SVG illustration components
    layout/            Header, navigation, shell, and footer
  data/                Placeholder case and reference data
  pages/               Top-level route pages
  styles/              Design tokens and global CSS
  types/               Core TypeScript domain models
  utils/               Framework-agnostic utilities
```

## Local Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Static Hosting

The app is static-first and uses hash-based navigation, so routes work on static hosts without rewrite rules.

Vite is configured with:

```ts
base: "./"
```

This emits relative asset paths, which keeps the same production build compatible with GitHub Pages project URLs, Netlify, and Vercel.

Build output is generated in:

```text
dist/
```

## GitHub Pages Deployment

This repository includes a GitHub Actions workflow at:

```text
.github/workflows/deploy.yml
```

To deploy with GitHub Pages:

1. Push the project to a GitHub repository.
2. Make sure the default branch is named `main`, or edit the workflow branch name.
3. In GitHub, open `Settings` -> `Pages`.
4. Set `Source` to `GitHub Actions`.
5. Push to `main`, or run the workflow manually from the `Actions` tab.

The workflow runs:

```bash
npm ci
npm run build
```

Then it publishes `dist/` using GitHub's official Pages artifact deployment action.

The app also includes:

```text
public/.nojekyll
```

Vite copies this into `dist/` so GitHub Pages does not process the site with Jekyll.

## Netlify Deployment

Use these settings:

```text
Build command: npm run build
Publish directory: dist
```

No redirect file is required because the app uses hash routes such as:

```text
#/cases
#/case-player?id=case-possible-osa
```

## Vercel Deployment

Use the Vite defaults:

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
Install command: npm ci
```

No rewrite configuration is required for the current hash-based routing setup.

## Troubleshooting Static Hosting

If the page loads but CSS or JavaScript is missing:

- Confirm `vite.config.ts` includes `base: "./"`.
- Rebuild with `npm run build`.
- Confirm the host is publishing the `dist/` folder, not the project root.

If direct links or refreshes show a 404:

- Use hash URLs, for example `https://example.com/#/cases`.
- Avoid sharing path-only URLs such as `https://example.com/cases`.
- This app intentionally avoids browser-history routing so static hosts do not need rewrite rules.

If GitHub Pages shows an older version:

- Check the `Actions` tab for a failed workflow.
- Confirm Pages source is set to `GitHub Actions`.
- Clear the browser cache or open the site in a private window.

If Netlify or Vercel builds fail:

- Confirm Node is using a current LTS version.
- Run `npm ci` locally to verify `package-lock.json` is usable.
- Run `npm run build` locally and fix TypeScript errors before redeploying.

## Current Scope

Implemented:

- Vite + React + TypeScript scaffold
- Responsive layout shell
- Home page
- Case Library page
- Case Player page
- Reflection page
- Core TypeScript types for cases, questions, scoring, and references
- Maintainable design token structure
- Placeholder SVG illustrations
- Data-driven interactive case player
- Step-by-step reasoning progression
- Conditional information reveal
- Classification, red flag, prioritization, recommendations, and feedback steps

Not implemented yet:

- Persisted learner responses
- Complete clinical content library
- Automated tests
