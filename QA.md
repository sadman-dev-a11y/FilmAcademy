# Quality assurance

## Local checks

- `npm run typecheck`: passed.
- `npm run lint`: passed after setting Node globals for the CLI entrypoint.
- `npm run test`: 35 tests passed across two suites.
- `npm run build`: passed after correcting Fontsource stylesheet entrypoints.
- `npm run test:e2e`: executed; local CLI returned explicit unavailable status (exit 2) for this managed runtime. The suite is configured in GitHub Actions on desktop and phone-sized Chromium.
- Supported cloud-browser preview: homepage visual design and landing → explorer → course → lesson navigation checked. Further verification and CI outcomes will be recorded after publication.

## Test coverage

Curriculum integrity, grading, all-lessons-plus-quiz completion gating, retained retries, persistence round trips, v1 migration, corrupt/oversized/unknown data, score validation, inaccessible storage, storyboard validation/reordering, combined filters, lesson workbook, restore after remount, three lab controls, studio CRUD and reset/import behavior.

Playwright covers the complete learning path, note/bookmark/refresh persistence, filters, global glossary search, quizzes/retries, laboratory effects, storyboard JSON round-trip and deletion, malformed backups, reduced motion, keyboard skip-link, route rendering, repository base path and 320px layout checks. Automated checks are not a formal WCAG conformance audit.

CI iteration 1: 8 browser checks passed, 6 failed on exact dropdown labels. Explicit accessible select labels corrected these failures. CI iteration 2: 14 passed, one desktop-only drawer test correctly skipped; two tests needed an unambiguous heading locator and a resize check found the animated desktop margin could temporarily overflow at 320px. The locator and margin transition were corrected before rerunning. Dependency audit after the development transitive override: 0 known vulnerabilities.

## Successful release gate and public deployment

Implementation commit: `1fd4a117e40a1971ae1f0e47528500acaa432a4c`.
Workflow: https://github.com/sadman-dev-a11y/FilmAcademy/actions/runs/41617798423 — **success**.

| Check                                        | Result                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| ESLint                                       | Passed                                                                               |
| Strict TypeScript                            | Passed                                                                               |
| Vitest + Testing Library                     | 35 passed                                                                            |
| Vite production build                        | Passed                                                                               |
| Playwright desktop/mobile                    | 17 passed; one desktop instance of the mobile-only drawer test intentionally skipped |
| npm audit after patched development override | 0 known vulnerabilities                                                              |
| GitHub Pages deployment                      | Succeeded                                                                            |

Verified public URL: https://sadman-dev-a11y.github.io/FilmAcademy/ . The live homepage, landing → explorer → course → lesson flow and a direct lesson refresh were checked in the browser after publication. The CI suite verifies all declared routes, base paths, browser persistence, controls, keyboard/reduced motion, storyboard round trips and 320px layout against the exact built source.

A separate `Verify published FilmAcademy` workflow executes the same acceptance suite against the real published URL (no local web server). Its artifacts retain desktop/mobile screenshots and the browser report.
