import { useRef, useState } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import { download, KEY, type LearningState } from "../lib/store";
import { PageHeading } from "../components/UI";
export function Settings() {
  const { state, warning, update, importData, reset } = useLearning();
  const [message, setMessage] = useState("");
  const file = useRef<HTMLInputElement>(null);
  return (
    <>
      <PageHeading
        eyebrow="MAKE THE WORKSPACE YOURS"
        title="Settings & your data"
        description="Your learning belongs to you. Keep a backup before changing browser or device."
      />
      <div className="settings-grid">
        <section className="panel">
          <h2>Motion preference</h2>
          <label className="field">
            Animations
            <select
              aria-label="Animations"
              value={state.motion}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  motion: e.target.value as LearningState["motion"],
                }))
              }
            >
              <option value="system">Follow device preference</option>
              <option value="reduce">Reduce motion</option>
              <option value="full">Standard motion</option>
            </select>
          </label>
          <p className="caption">
            Reduced motion removes decorative movement and transitions
            immediately. Device preferences are respected by default.
          </p>
        </section>
        <section className="panel">
          <h2>Backup & restore</h2>
          <p>
            Export lessons, quiz attempts, bookmarks, notes, motion preference
            and all storyboards in one versioned file. Import replaces the
            current learning data after validation and confirmation.
          </p>
          <div className="actions">
            <button onClick={() => download("FilmAcademy-backup.json", state)}>
              <Download size={16} />
              Export learning data
            </button>
            <button onClick={() => file.current?.click()}>
              <Upload size={16} />
              Import learning data
            </button>
          </div>
          <input
            ref={file}
            hidden
            type="file"
            accept=".json,application/json"
            aria-label="Import learning data file"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                if (f.size > 2_000_000) throw new Error();
                const raw = await f.text();
                const { parseState } = await import("../lib/store");
                parseState(raw);
                if (
                  window.confirm(
                    "Replace current learning data with this validated backup? Export your current data first if needed.",
                  )
                ) {
                  importData(raw);
                  setMessage("Backup restored successfully.");
                }
              } catch {
                setMessage(
                  "Import rejected. Use a valid FilmAcademy backup (up to 2 MB). Your existing data was preserved.",
                );
              }
              e.target.value = "";
            }}
          />
          {warning && (
            <button
              onClick={() => {
                const raw = localStorage.getItem(KEY);
                if (raw) download("FilmAcademy-recovery.json", { raw });
              }}
            >
              Export unreadable data for recovery
            </button>
          )}
          <p role="status">{message}</p>
        </section>
        <section className="panel">
          <h2>Privacy, simply</h2>
          <p>
            No sign-in, cloud account or paid backend is used. Progress, notes
            and storyboards stay in this browser’s local storage. Clearing
            browser data can erase them. Private browsing and storage
            restrictions may prevent durable saving.
          </p>
          <p>
            Export/import is a manual backup, not automatic cross-device sync.
            Avoid sensitive notes on a shared device. The app has no analytics
            or third-party tracking scripts. GitHub Pages may keep its own
            hosting access logs.
          </p>
        </section>
        <section className="panel">
          <h2>Start over</h2>
          <p>
            Reset clears progress, quiz history, notes, bookmarks, storyboards
            and settings from this browser. Export first to keep a restorable
            copy.
          </p>
          <button
            className="danger"
            onClick={() => {
              if (
                window.confirm(
                  "Reset all FilmAcademy learning data on this browser? Export first; this cannot be undone without a backup.",
                )
              ) {
                reset();
                setMessage("Learning data reset.");
              }
            }}
          >
            <RotateCcw size={16} />
            Reset all learning data
          </button>
        </section>
      </div>
      <p className="caption">
        FilmAcademy v1.0 · Original educational platform for Sadman Labib
        Chowdhury. Learning records are non-accredited, browser-local summaries.
        No university approval or certification is claimed.
      </p>
    </>
  );
}
