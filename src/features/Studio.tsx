import { useRef, useState, type ChangeEvent } from "react";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  Upload,
  Printer,
  Clapperboard,
} from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import {
  download,
  moveShot,
  newBoard,
  newShot,
  parseBoard,
  type Board,
  type Shot,
} from "../lib/store";
import { Empty, PageHeading } from "../components/UI";
import { Scene } from "../components/Visuals";
export function Studio() {
  const { state, update } = useLearning();
  const [selected, setSelected] = useState(state.boards[0]?.id || "");
  const [message, setMessage] = useState("");
  const [drag, setDrag] = useState<number | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const board = state.boards.find((b) => b.id === selected);
  function save(b: Board) {
    update((s) => ({
      ...s,
      boards: s.boards.some((x) => x.id === b.id)
        ? s.boards.map((x) =>
            x.id === b.id ? { ...b, updatedAt: new Date().toISOString() } : x,
          )
        : [...s.boards, b],
    }));
  }
  function addBoard(sample = false) {
    if (state.boards.length >= 50) {
      setMessage(
        "Maximum 50 boards. Export and remove one before adding another.",
      );
      return;
    }
    const b = newBoard();
    if (sample) {
      b.title = "The forgotten key";
      b.shots = [
        {
          ...newShot(),
          title: "The empty corridor",
          action: "A student reaches a locked door.",
          duration: 5,
        },
        {
          ...newShot(),
          title: "The missing key",
          size: "Close",
          action: "A hand searches an empty pocket.",
          note: "A distant door closes.",
          duration: 3,
        },
        {
          ...newShot(),
          title: "The decision",
          size: "Medium",
          action: "The student turns and walks back.",
          duration: 4,
        },
      ];
    }
    save(b);
    setSelected(b.id);
  }
  function editShot(id: string, patch: Partial<Shot>) {
    if (board)
      save({
        ...board,
        shots: board.shots.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      });
  }
  function reorder(i: number, d: number) {
    if (board) save({ ...board, shots: moveShot(board.shots, i, d) });
  }
  async function importFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      if (f.size > 1_000_000)
        throw new Error("Maximum storyboard size is 1 MB.");
      if (state.boards.length >= 50) throw new Error("Maximum 50 boards.");
      const b = parseBoard(await f.text());
      save(b);
      setSelected(b.id);
      setMessage("Storyboard imported as a new board.");
    } catch {
      setMessage(
        "Could not import: use a valid FilmAcademy storyboard JSON file, up to 1 MB, with unique shot IDs.",
      );
    }
    e.target.value = "";
  }
  return (
    <>
      <PageHeading
        eyebrow="PREPRODUCTION / STORYBOARD STUDIO"
        title="Give your next scene a shape."
        description="Plan the framing, action and timing. Your boards save automatically on this browser."
      >
        <button className="primary" onClick={() => addBoard()}>
          <Plus size={18} />
          New board
        </button>
      </PageHeading>
      <div className="studio-toolbar">
        <label className="field">
          Project
          <select
            aria-label="Project"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Choose a storyboard</option>
            {state.boards.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </label>
        <div className="actions">
          <button onClick={() => addBoard(true)}>Load sample board</button>
          <button onClick={() => file.current?.click()}>
            <Upload size={16} />
            Import JSON
          </button>
          <input
            hidden
            type="file"
            accept=".json,application/json"
            ref={file}
            onChange={importFile}
            aria-label="Import storyboard file"
          />
        </div>
      </div>
      {message && (
        <p role="status" className="notice">
          {message}
        </p>
      )}
      {!board ? (
        <Empty title="Every film starts with a first shot.">
          <p>
            Create a board, or load an original three-shot sample. Use action
            notes, not drawing skill, to communicate your idea.
          </p>
          <button className="primary" onClick={() => addBoard()}>
            <Plus size={18} />
            Create storyboard
          </button>
        </Empty>
      ) : (
        <>
          <div className="board-heading">
            <label className="field">
              Storyboard title
              <input
                value={board.title}
                maxLength={200}
                onChange={(e) => save({ ...board, title: e.target.value })}
              />
            </label>
            <span className="muted">
              {board.shots.length} shots ·{" "}
              {board.shots.reduce((n, s) => n + s.duration, 0)} s planned
            </span>
            <div className="actions">
              <button
                onClick={() =>
                  download(
                    `${board.title.replace(/[^a-z0-9]/gi, "-") || "storyboard"}.json`,
                    { schemaVersion: 1, board },
                  )
                }
              >
                <Download size={16} />
                Export JSON
              </button>
              <button
                onClick={() => {
                  document.body.dataset.printBoard = "true";
                  window.print();
                  delete document.body.dataset.printBoard;
                }}
              >
                <Printer size={16} />
                Print
              </button>
              <button
                className="danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this storyboard and its shots? Export it first if you need a backup.",
                    )
                  ) {
                    update((s) => ({
                      ...s,
                      boards: s.boards.filter((b) => b.id !== board.id),
                    }));
                    setSelected("");
                  }
                }}
              >
                <Trash2 size={16} />
                Delete board
              </button>
            </div>
          </div>
          <div className="shot-grid">
            {board.shots.map((s, i) => (
              <article
                className="shot-card panel"
                key={s.id}
                draggable
                onDragStart={(e) => {
                  if (
                    (e.target as HTMLElement).closest(
                      "input,textarea,select,button",
                    )
                  ) {
                    e.preventDefault();
                    return;
                  }
                  setDrag(i);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (drag !== null) reorder(drag, i - drag);
                  setDrag(null);
                }}
              >
                <div className="shot-top">
                  <span className="eyebrow">
                    SHOT {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="actions">
                    <button
                      aria-label={`Move shot ${i + 1} up`}
                      disabled={i === 0}
                      onClick={() => reorder(i, -1)}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      aria-label={`Move shot ${i + 1} down`}
                      disabled={i === board.shots.length - 1}
                      onClick={() => reorder(i, 1)}
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      aria-label={`Delete shot ${i + 1}`}
                      onClick={() => {
                        if (window.confirm("Delete this shot?"))
                          save({
                            ...board,
                            shots: board.shots.filter((x) => x.id !== s.id),
                          });
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <Scene size={s.size} angle={s.angle} />
                <label className="field">
                  Shot title
                  <input
                    value={s.title}
                    maxLength={200}
                    onChange={(e) => editShot(s.id, { title: e.target.value })}
                  />
                </label>
                <div className="shot-settings">
                  <label className="field">
                    Shot size
                    <select
                      value={s.size}
                      onChange={(e) =>
                        editShot(s.id, { size: e.target.value as Shot["size"] })
                      }
                    >
                      {["Wide", "Medium", "Close"].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Angle
                    <select
                      value={s.angle}
                      onChange={(e) =>
                        editShot(s.id, {
                          angle: e.target.value as Shot["angle"],
                        })
                      }
                    >
                      {["High", "Eye level", "Low"].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Seconds
                    <input
                      type="number"
                      min="0"
                      max="3600"
                      value={s.duration}
                      onChange={(e) =>
                        editShot(s.id, {
                          duration: Math.max(
                            0,
                            Math.min(3600, +e.target.value),
                          ),
                        })
                      }
                    />
                  </label>
                </div>
                <label className="field">
                  Action
                  <textarea
                    rows={3}
                    maxLength={10000}
                    value={s.action}
                    placeholder="What happens in this shot?"
                    onChange={(e) => editShot(s.id, { action: e.target.value })}
                  />
                </label>
                <label className="field">
                  Dialogue / sound / notes
                  <textarea
                    rows={2}
                    maxLength={10000}
                    value={s.note}
                    onChange={(e) => editShot(s.id, { note: e.target.value })}
                  />
                </label>
                <p className="caption">
                  Illustrative framing thumbnail · action is defined by your
                  notes.
                </p>
              </article>
            ))}
          </div>
          <button
            className="add-shot"
            disabled={board.shots.length >= 200}
            onClick={() =>
              save({ ...board, shots: [...board.shots, newShot()] })
            }
          >
            <Plus size={20} />
            Add shot
          </button>
          <p className="caption">
            Reorder with arrow buttons or drag cards. JSON exports are editable
            backups; print creates a production handout.
          </p>
          <section className="print-board">
            <Clapperboard />
            <h1>{board.title}</h1>
            <p>
              {board.shots.length} shots /{" "}
              {board.shots.reduce((n, s) => n + s.duration, 0)} seconds planned
            </p>
            {board.shots.map((s, i) => (
              <div key={s.id}>
                <h2>
                  {i + 1}. {s.title}
                </h2>
                <Scene size={s.size} angle={s.angle} />
                <p>
                  {s.size} · {s.angle} · {s.duration} s
                </p>
                <p>Action: {s.action}</p>
                <p>Dialogue / sound / notes: {s.note}</p>
              </div>
            ))}
          </section>
        </>
      )}
    </>
  );
}
