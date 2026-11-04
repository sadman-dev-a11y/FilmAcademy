# Contributing to FilmAcademy

FilmAcademy is a browser-local Film and Media Studies learning platform. Useful contributions improve the learning experience, reliability, accessibility, or clarity of its original teaching content.

## Before starting

Search existing issues and pull requests. For a large feature, propose the learner's task and intended outcome in an issue before implementing it. A focused bug fix can go directly to a pull request with reproduction steps.

Good starting areas include keyboard access in the storyboard studio, local backup/import recovery, clearer lab explanations, and curriculum corrections supported by reliable sources. Do not invent usage statistics, accreditation, or university endorsements.

## Local setup

Use Node 24 LTS and the committed npm lockfile.

```sh
npm ci
npm run dev
```

Open the printed local URL under `/FilmAcademy/`. No account, paid backend, or secrets are required. Progress lives in your browser; export a backup before testing resets or import/migration behavior.

## Checks

Run the checks relevant to your change and record their actual outcomes:

```sh
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

The standalone browser runner may be unavailable in managed environments; record that limitation. GitHub Actions runs the browser checks on Ubuntu. Do not describe an unexecuted test as passed.

For interface changes, check keyboard operation, visible focus, labels and announcements, narrow screens, 200% zoom, and reduced motion. For persistence changes, check malformed imports, migration compatibility, storage errors, and export/import round trips. Use fictional records.

## Where to work

- `src/features/`: learning, labs, and storyboard interfaces.
- `src/lib/store.ts`: persistence and storyboard utilities.
- `src/tests/`: unit and component regression coverage.
- `e2e/` and `scripts/e2e.mjs`: browser checks.
- `CURRICULUM.md`, `QA.md`, and `ARCHITECTURE.md`: content, validation, and design context.

Confirm the current implementation before editing. Keep Vite's repository subpath and HashRouter behavior intact. Do not change deployment workflows for an unrelated feature.

## Pull requests

Fork the repository, branch from the current default branch, and keep one coherent purpose per PR. The default branch is currently `CineDesk`, despite the project's FilmAcademy name. Include a concrete problem, the resulting behavior, and validation results. Link an existing issue when applicable; include a regression test for a functional bug where practical.

Teaching content must be original or used with permission. Provide sources for factual corrections and retain asset attribution. Code is distributed under the repository's MIT license; third-party materials retain their own licenses. See `ASSETS.md` and `SECURITY.md`. Follow the security guidance for private vulnerability reports rather than posting sensitive details publicly.
