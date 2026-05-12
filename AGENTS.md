# AGENTS.md

## Commands
- `npm run dev` - Start development server
- `npm run build` - Production build (single HTML file output)
- `npm run preview` - Preview production build

Note: No lint, typecheck, or test scripts configured.

## Project Structure
- `@` alias maps to `src/` (configured in vite.config.ts and tsconfig.json)
- Entry points: `src/main.tsx`, `src/App.tsx` (customer site), `src/AdminDashboard.tsx` (admin)
- Admin login at `src/components/AdminLogin.tsx`
- Default admin: `alphamobitech767@gmail.com` / `jimmy@99`

## Build Output
- Uses `vite-plugin-singlefile` - build produces a single `dist/index.html` with embedded JS/CSS

## Environment Variables
- Copy `.env.example` to `.env` before running
- Admin credentials, EmailJS, and M-Pesa config go in `.env`