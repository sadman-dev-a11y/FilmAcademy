# Architecture

React 19 + strict TypeScript + Vite 8. React Router HashRouter handles static-host navigation; route feature bundles are loaded on demand. Tailwind v4 is integrated through Vite, with explicit CSS design tokens and responsive component styles. Lucide supplies consistent icons. Motion handles a short route reveal; system or explicit reduced-motion preferences disable it.

## Boundaries

- `src/app`: shell, routing, navigation, global search, error boundary and motion configuration.
- `src/components`: reusable editorial UI and original SVG scene/diagram primitives.
- `src/features`: course learning flows, labs, storyboards, settings and public information.
- `src/data`: typed courses, lessons, questions and glossary; no UI-dependent content parsing.
- `src/lib/store.ts`: LearningStore boundary, schema validation, grading, completion derivation, board operations and downloads.
- `src/hooks/useLearning.tsx`: context with stable updates and in-memory fallback when storage is denied.
- `src/tests`: isolated unit/component flows; `e2e`: real browser acceptance paths.

## State and trust

Schema v2 includes completed lesson IDs, bookmark IDs, notes keyed by lesson ID, recent lessons, scored attempts, multiple boards and motion preference. A v1-shaped backup is migrated by merging safe defaults and validating as v2. Zod verifies shapes, enums, bounds, timestamps and sizes. Additional checks reject unknown lessons, impossible quiz answers/scores and duplicate board/shot IDs. Imports cap at 2 MB (learning backup) or 1 MB (board), 50 boards and 200 shots per board. Raw user content is rendered as React text, never injected HTML.

All state writes go through one provider boundary. Updates stamp `updatedAt` and save synchronously, exposing a warning if the browser denies storage. Unreadable stored content is left untouched on initial read and can be exported for recovery before new work replaces it. No remote accounts, telemetry or API calls exist in the app. Multi-tab real-time synchronization is not provided; avoid editing the same data in several tabs simultaneously.

## Derived learning analytics

Lesson percent is completed course lesson count divided by total course lessons. Completion requires 100% lessons and a historical quiz attempt >=80%. Retry history remains, capped at 1,000 attempts. Estimated completed minutes sum lesson estimates, not measured study time. Recently viewed items represent actual lesson visits. No fabricated class statistics exist.

## Publication

The source lives in the authorized GitHub repository. `CineDesk` is its verified default branch. CI quality gates precede a separate Pages deploy job. Only the deploy job has Pages write and OIDC permissions; build uses contents read. Project assets are bundled under the Vite base; HashRouter avoids server-side route fallback requirements.

## Future adapter

A remote LearningStore can replace the browser provider while preserving typed curriculum IDs. It would require real authentication, explicit conflict handling, user-owned records, least-privilege grants and tested database row-level authorization. No mock connection is shipped and no client secret is needed.
