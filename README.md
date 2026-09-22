# Akmal Farm

Frontend landing page for Akmal Farm with location map, Telegram support, and tri-lingual UI.

## Project overview

- Built with React, TypeScript, Vite and Tailwind-style utility classes.
- Main app file: `src/App.tsx`
- Global styles: `src/index.css`
- Local map / Google Maps fallback is implemented in `src/App.tsx`
- Localization keys are stored in `src/App.tsx` for `ru`, `uz`, and `en`

## Quick start

1. Install dependencies:
   `npm install`
2. Start development server:
   `npm run dev`
3. Open in browser:
   `http://localhost:3000`

## Build for production

Run:

```bash
npm run build
```

Output is generated into the `dist/` folder.

You can preview the production build locally with:

```bash
npm run preview
```

## Deploy and domain binding

This app is a static frontend and can be hosted on any static site provider:

- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- AWS S3 / CloudFront
- Any static web server

### Domain binding

1. Deploy the contents of `dist/` to your hosting provider.
2. In the hosting dashboard, add your custom domain and point DNS to the provider's records.
3. If the app is served from the root path of the domain, no special Vite `base` configuration is required.

> If you need to host under a subpath (for example `example.com/shop`), update `base` in `vite.config.ts` accordingly.

## Notes for the next developer

- There is no backend required for the current UI.
- The app is fully client-side and runs as a static website.
- Existing buttons link directly to Telegram and Instagram.
- If you want to remove build output from repo before sending, you can exclude `dist/` and regenerate it with `npm run build`.

## Optional cleanup

This repo currently includes `dotenv` and `express` in `package.json`, but they are not used by the current frontend app.

If desired, the next developer can remove these dependencies for a leaner install.
