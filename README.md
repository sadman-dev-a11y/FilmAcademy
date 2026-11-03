# FilmAcademy

Learn the Language of Cinema. An original, browser-local Film and Media Studies educational platform for Sadman Labib Chowdhury.

Deployment target: https://sadman-dev-a11y.github.io/FilmAcademy/ (verification is recorded in QA.md).
Repository: https://github.com/sadman-dev-a11y/FilmAcademy

## What works

- Six structured courses, 18 original workbook lessons, 36 in-lesson knowledge checks and 30 explainable final-quiz questions.
- Course search with combined category/level filters, global course/lesson/glossary search and 56 glossary terms.
- Exposure lab with aperture, shutter and ISO, presets, illustrative depth/motion/noise changes, and causal explanations.
- Composition lab with framing, angle, placement and thirds grid; axis lab with consistent, reversed and neutral views.
- Local lesson completion, notes, bookmarks, recent activity, attempt history and honest calculated dashboard statistics.
- Multiple storyboards with editable title, shot size/angle, action, dialogue/sound notes, duration, accessible reorder, drag/drop, deletion, JSON import/export and printing.
- Non-accredited learning records, earned only after all course lessons and at least 80% on a quiz. Print a single earned record.
- Versioned, validated backups, v1-to-v2 migration, storage error recovery notice, confirmation-gated reset, and reduced-motion override.
- Responsive sidebar, mobile navigation, skip link, focus handling, semantic forms, accessible feedback and locally bundled variable fonts.
- Read-only instructor curriculum map, About and Help. No fake accounts or admin buttons.

## Run

Node 24 LTS or a newer supported LTS release is recommended.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

Open the Vite URL under `/FilmAcademy/`. The managed development environment uses its supported browser preview instead of the standalone Playwright runner; that command exits with an explicit unavailable message there. CI executes Playwright on an Ubuntu runner in desktop and phone-sized Chromium projects.

## Routes

| Route                 | Experience                              |
| --------------------- | --------------------------------------- |
| `/`                   | Landing and discovery                   |
| `/courses`            | Searchable, filterable courses          |
| `/courses/:slug`      | Outline, outcomes and progress          |
| `/lessons/:slug`      | Article/workbook, checks and notes      |
| `/courses/:slug/quiz` | Scored course assessment and retry      |
| `/labs`               | Lab gallery                             |
| `/labs/exposure`      | Exposure experiment                     |
| `/labs/composition`   | Framing and camera-angle experiment     |
| `/labs/axis`          | Screen-direction experiment             |
| `/studio/storyboards` | Local multi-board editor                |
| `/my-learning`        | Real local activity dashboard           |
| `/glossary`           | Searchable definitions                  |
| `/achievements`       | Earned and in-progress learning records |
| `/instructor-preview` | Read-only curriculum mapping            |
| `/settings`           | Motion, backups, reset and privacy      |
| `/about`, `/help`     | Project details and orientation         |
| Any unknown path      | Friendly recovery route                 |

URLs use `/#/…` with HashRouter. Repository subpath refreshes remain valid on static hosting.

## Suggested learning paths

- First film: Film Language → Cinematography → Editing → Direction → Sound.
- Classroom: predict a lab result → change one variable → explain the evidence → complete a practical task.
- Academic practice: Research Methods → close-read original footage → create a bounded question and claim ledger.

## Deployment

The account's actual default branch at creation was `CineDesk`. The Pages workflow targets that branch, runs lint/typecheck/unit tests/build and desktop/mobile Playwright, uploads `dist`, then deploys through the `github-pages` environment. Vite base is `/FilmAcademy/`. Pages Source is configured as **GitHub Actions**. No secrets or paid services are required.

Workflow references checked 3 November 2026:

- https://vite.dev/guide/static-deploy
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Honest limits

All data is local to one browser, not a cloud account. Export before changing device, clearing storage or resetting. Private browsing and quotas can affect saving. Learning completion is self-reported and imported records are user-controlled; no identity verification, accreditation or university endorsement is claimed. Labs are illustrations, not calibrated camera simulations. No backend, external AI tutor, collaborative boards, instructor accounts or cohort tracking is included.

See [ARCHITECTURE.md](ARCHITECTURE.md), [CURRICULUM.md](CURRICULUM.md), [ASSETS.md](ASSETS.md), [SECURITY.md](SECURITY.md), and [QA.md](QA.md).

## Next improvements

1. Consent-based usability sessions with film students, followed by documented accessibility fixes.
2. More original production exercises and carefully sourced Bangladeshi cinema material.
3. An optional authenticated storage adapter with row-level authorization and cross-device sync, only after appropriate security tests.
