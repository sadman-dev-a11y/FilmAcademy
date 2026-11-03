# Security and privacy

No credentials are required for the static app. Do not commit `.env` files, service-role keys or access tokens. All imported data is untrusted and must pass schema, size and semantic validation before replacing local state. Text is escaped through React. Do not add unsafe HTML rendering for notes or storyboard content.

Local storage is not an encrypted vault. Do not enter confidential participant information, passwords or sensitive production data, especially on a shared device. Clearing browser storage removes progress. Export is the only included backup mechanism. Users control imported progress, so learning records are not authenticated credentials.

The workflow separates read-only build permissions from Pages/OIDC deploy permissions. Pull requests run checks but do not deploy. Review dependency updates and action version changes before merging. For a future backend, require authenticated ownership checks and database row-level authorization; never put a privileged key into Vite source.

Report a suspected code vulnerability privately through the repository owner's GitHub contact options. Avoid posting personal learning data or secrets in public issues.

The development-only minimatch transitive dependency is overridden to the patched 11.x release family for GHSA-g3hv-75wg-m249. Lint, typecheck, tests and production build were rechecked with the override; the subsequent npm audit reported zero vulnerabilities.
