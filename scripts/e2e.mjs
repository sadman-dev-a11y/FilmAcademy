import { spawnSync } from "node:child_process";
if (process.env.SITES_MANAGED_LINUX_CONTAINER === "1") {
  console.error(
    "Playwright CLI browser execution is unavailable in this managed runtime. Use the supported browser preview for local QA; GitHub Actions runs the Playwright suite on its runner.",
  );
  process.exit(2);
}
const r = spawnSync("npx", ["playwright", "test", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: false,
});
process.exit(r.status ?? 1);
