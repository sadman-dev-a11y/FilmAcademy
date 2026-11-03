import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  BookOpen,
  Clapperboard,
  House,
  FlaskConical,
  LayoutDashboard,
  BookA,
  GraduationCap,
  Presentation,
  Settings as SettingsIcon,
  Menu,
  Search,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  Info,
} from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useLearning } from "../hooks/useLearning";
import { courses, lessons } from "../data/curriculum";
import { glossary } from "../data/glossary";
import { Home, About, Help } from "../features/Home";
const learning = () => import("../features/Learning");
const Courses = lazy(() => learning().then((m) => ({ default: m.Courses })));
const CourseDetail = lazy(() =>
  learning().then((m) => ({ default: m.CourseDetail })),
);
const LessonReader = lazy(() =>
  learning().then((m) => ({ default: m.LessonReader })),
);
const Quiz = lazy(() => learning().then((m) => ({ default: m.Quiz })));
const Dashboard = lazy(() =>
  learning().then((m) => ({ default: m.Dashboard })),
);
const Glossary = lazy(() => learning().then((m) => ({ default: m.Glossary })));
const Achievements = lazy(() =>
  learning().then((m) => ({ default: m.Achievements })),
);
const Instructor = lazy(() =>
  learning().then((m) => ({ default: m.Instructor })),
);
const NotFound = lazy(() => learning().then((m) => ({ default: m.NotFound })));
const labs = () => import("../features/Labs");
const Labs = lazy(() => labs().then((m) => ({ default: m.Labs })));
const Exposure = lazy(() => labs().then((m) => ({ default: m.Exposure })));
const Composition = lazy(() =>
  labs().then((m) => ({ default: m.Composition })),
);
const Axis = lazy(() => labs().then((m) => ({ default: m.Axis })));
const Studio = lazy(() =>
  import("../features/Studio").then((m) => ({ default: m.Studio })),
);
const Settings = lazy(() =>
  import("../features/Settings").then((m) => ({ default: m.Settings })),
);
const nav = [
  ["/", "Overview", House],
  ["/courses", "Explore courses", BookOpen],
  ["/labs", "Interactive labs", FlaskConical],
  ["/studio/storyboards", "Storyboard studio", Clapperboard],
  ["/my-learning", "My learning", LayoutDashboard],
  ["/glossary", "Glossary", BookA],
  ["/achievements", "Learning records", GraduationCap],
  ["/instructor-preview", "Instructor preview", Presentation],
] as const;
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="fatal">
        <h1>The workspace needs a fresh start.</h1>
        <p>Your saved learning data has not been reset.</p>
        <button onClick={() => window.location.reload()}>
          Reload FilmAcademy
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const q = query.trim().toLowerCase();
  const matches = [
    ...courses
      .filter((c) =>
        `${c.title} ${c.summary} ${c.category}`.toLowerCase().includes(q),
      )
      .map((c) => ({
        title: c.title,
        type: "Course",
        path: `/courses/${c.id}`,
      })),
    ...lessons
      .filter((l) =>
        `${l.title} ${l.terms.join(" ")}`.toLowerCase().includes(q),
      )
      .map((l) => ({
        title: l.title,
        type: "Lesson",
        path: `/lessons/${l.id}`,
      })),
    ...glossary
      .filter((g) => `${g.term} ${g.definition}`.toLowerCase().includes(q))
      .map((g) => ({
        title: g.term,
        type: "Glossary",
        path: `/glossary?q=${encodeURIComponent(g.term)}`,
      })),
  ].slice(0, 8);
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        field.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);
  return (
    <div
      className="global-search"
      ref={root}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/courses?q=${encodeURIComponent(query)}`);
          setOpen(false);
        }}
      >
        <Search size={18} />
        <label className="sr-only" htmlFor="global-search">
          Search courses, lessons and glossary
        </label>
        <input
          id="global-search"
          ref={field}
          type="search"
          placeholder="Search the academy…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        <kbd>⌘ / Ctrl K</kbd>
      </form>
      {open && q && (
        <div className="search-results">
          <p className="eyebrow">SEARCH RESULTS</p>
          {matches.length ? (
            matches.map((m) => (
              <Link
                key={m.path}
                to={m.path}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span>{m.title}</span>
                <small>{m.type}</small>
              </Link>
            ))
          ) : (
            <p>No results. Try “light” or “continuity”.</p>
          )}
        </div>
      )}
    </div>
  );
}
function Workspace() {
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width:760px)").matches,
  );
  const sidebar = useRef<HTMLElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(max-width:760px)");
    const change = () => setMobile(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!menu || !mobile) return;
    const controls = () =>
      Array.from(
        sidebar.current?.querySelectorAll<HTMLElement>("a,button") || [],
      ).filter((el) => el.offsetParent !== null);
    controls()[0]?.focus();
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuToggle.current?.focus();
      }
      if (e.key === "Tab") {
        const list = controls();
        const first = list[0],
          last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [menu, mobile]);
  const [collapsed, setCollapsed] = useState(false);
  const { state, warning } = useLearning();
  const deviceReduce = useReducedMotion();
  const reduce =
    state.motion === "reduce" || (state.motion === "system" && deviceReduce);
  const location = useLocation();
  const main = useRef<HTMLElement>(null);
  const previous = useRef(location.pathname);
  useEffect(() => {
    document.documentElement.dataset.motion = reduce ? "reduce" : "full";
  }, [reduce]);
  useEffect(() => {
    setMenu(false);
    if (previous.current !== location.pathname) {
      main.current?.focus();
      window.scrollTo({ top: 0 });
      previous.current = location.pathname;
    }
    const title =
      location.pathname
        .split("/")
        .filter(Boolean)
        .pop()
        ?.replaceAll("-", " ") || "Learn the Language of Cinema";
    document.title = `${title.charAt(0).toUpperCase() + title.slice(1)} · FilmAcademy`;
  }, [location.pathname]);
  return (
    <MotionConfig reducedMotion={reduce ? "always" : "never"}>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <div
        className={`workspace ${collapsed ? "sidebar-collapsed" : ""} ${menu ? "menu-open" : ""}`}
      >
        <aside
          ref={sidebar}
          className="sidebar"
          aria-label="Main navigation"
          inert={mobile && !menu}
          aria-hidden={mobile && !menu ? true : undefined}
          role={mobile && menu ? "dialog" : undefined}
          aria-modal={mobile && menu ? true : undefined}
        >
          <button
            className="drawer-close"
            onClick={() => {
              setMenu(false);
              menuToggle.current?.focus();
            }}
          >
            Close navigation
          </button>
          <Link to="/" className="brand" aria-label="FilmAcademy home">
            <span className="brand-mark">
              <Clapperboard size={23} />
            </span>
            <span>
              Film<span className="brand-light">Academy</span>
              <small>LEARN. EXPERIMENT. CREATE.</small>
            </span>
          </Link>
          <div className="sidebar-section">YOUR WORKSPACE</div>
          <nav>
            {nav.map(([path, label, Icon], i) => (
              <NavLink
                end={path === "/"}
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setMenu(false)}
              >
                <Icon size={19} />
                <span>{label}</span>
                {i === 2 && <small>03</small>}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="sidebar-note">
              <span className="local-dot" /> YOUR OWN PACE
              <p>
                Small lessons.
                <br />A bigger way of seeing.
              </p>
              <Link to="/about">
                About the academy
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <NavLink className="nav-link" to="/settings">
              <SettingsIcon size={18} />
              <span>Settings & data</span>
            </NavLink>
            <NavLink className="nav-link" to="/help">
              <HelpCircle size={18} />
              <span>Help & orientation</span>
            </NavLink>
            <button
              className="collapse-button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen size={18} />
              ) : (
                <PanelLeftClose size={18} />
              )}
              <span>Collapse workspace</span>
            </button>
          </div>
        </aside>
        {menu && (
          <button
            className="menu-scrim"
            onClick={() => {
              setMenu(false);
              menuToggle.current?.focus();
            }}
            aria-label="Close navigation"
          />
        )}
        <div className="workspace-main">
          <header className="topbar">
            <button
              ref={menuToggle}
              className="menu-toggle"
              aria-expanded={menu}
              aria-label={menu ? "Close navigation" : "Open navigation"}
              onClick={() => setMenu(!menu)}
            >
              <Menu size={23} />
            </button>
            <Link to="/" className="mobile-brand">
              FilmAcademy
            </Link>
            <GlobalSearch />
            <div className="topbar-right">
              <span className="local-dot" />
              <span>Local workspace</span>
              <Link
                className="avatar"
                to="/my-learning"
                aria-label="Open my learning"
              >
                FA
              </Link>
            </div>
          </header>
          <main id="main" tabIndex={-1} ref={main}>
            {warning && (
              <div role="alert" className="notice warning">
                {warning}
                <Link to="/settings"> Open Settings</Link>
              </div>
            )}
            <motion.div
              className="route-content"
              key={location.pathname}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
            >
              <Suspense
                fallback={
                  <p role="status" className="notice">
                    Opening your workspace…
                  </p>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:slug" element={<CourseDetail />} />
                  <Route path="/courses/:slug/quiz" element={<Quiz />} />
                  <Route path="/lessons/:slug" element={<LessonReader />} />
                  <Route path="/labs" element={<Labs />} />
                  <Route path="/labs/exposure" element={<Exposure />} />
                  <Route path="/labs/composition" element={<Composition />} />
                  <Route path="/labs/axis" element={<Axis />} />
                  <Route path="/studio/storyboards" element={<Studio />} />
                  <Route path="/my-learning" element={<Dashboard />} />
                  <Route path="/glossary" element={<Glossary />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/instructor-preview" element={<Instructor />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </motion.div>
            <footer className="app-footer">
              <span>
                FILMACADEMY{" "}
                <span className="muted">/ An ongoing study in cinema.</span>
              </span>
              <Link to="/about">
                <Info size={14} />A project by Sadman Labib Chowdhury
              </Link>
            </footer>
          </main>
        </div>
        <nav className="bottom-nav" aria-label="Mobile quick navigation">
          {nav
            .filter((_, i) => [0, 1, 2, 4].includes(i))
            .map(([path, label, Icon]) => (
              <NavLink key={path} end={path === "/"} to={path}>
                <Icon size={20} />
                <span>
                  {label === "Overview"
                    ? "Home"
                    : label === "Explore courses"
                      ? "Courses"
                      : label === "Interactive labs"
                        ? "Labs"
                        : "My learning"}
                </span>
              </NavLink>
            ))}
        </nav>
      </div>
    </MotionConfig>
  );
}
export default function App() {
  return (
    <ErrorBoundary>
      <Workspace />
    </ErrorBoundary>
  );
}
