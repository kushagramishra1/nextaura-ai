# Nexora AI

Nexora AI is a TanStack Start application for team knowledge work. It combines a workspace dashboard, searchable knowledge bases, an AI assistant, API key management, usage reporting, and member settings behind the app shell.

## Development

Requirements: Node.js 22 or later and npm.

```sh
npm install
npm run dev
```

The development server listens on `http://localhost:8080`.

## Verification

Run the checks that match the part of the project you changed:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Database migrations run as part of `npm run build`. Configure the environment required by the deployment platform before running database-backed flows locally; do not commit `.env` files or secrets.

## Project layout

- `src/routes/`: TanStack Start routes and server endpoints
- `src/components/`: shared application and UI components
- `src/lib/`: authentication, database, connector, and domain helpers
- `migrations/`: database migration files
- `scripts/`: build, migration, preview, and verification tooling
- `public/`: static assets and platform-provided install assets
- `screenshots/`: local browser QA output, ignored by Git

## Contribution notes

Keep generated build output, screenshots, and credentials out of commits. Prefer focused commits that describe one change, and run the narrowest relevant verification command before opening a pull request.
