import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Check,
  FlaskConical,
} from "lucide-react";
import { courses } from "../data/curriculum";
import { useLearning } from "../hooks/useLearning";
import { CourseCard } from "../components/UI";
import { Scene } from "../components/Visuals";
export function Home() {
  const { state } = useLearning();
  const recent = state.recent[0];
  return (
    <>
      <div className="home-intro">
        <p className="eyebrow">
          <span className="live-dot" />
          THE FILMMAKER’S LEARNING WORKSPACE
        </p>
        <span className="edition">VOL. 01 / FOUNDATION</span>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-kicker">Look closer. Think deeper. Make films.</p>
          <h1>
            Learn the
            <br />
            language
            <br />
            of <em>cinema.</em>
          </h1>
          <p>
            From your first frame to your next story.
            <br />
            Explore the craft through practical lessons and hands-on
            experiments.
          </p>
          <div className="hero-actions">
            <Link
              className="button primary"
              to={recent ? `/lessons/${recent}` : "/courses"}
            >
              {recent ? "Continue learning" : "Find your first course"}
              <ArrowRight size={18} />
            </Link>
            <Link className="text-link" to="/labs">
              <Play size={14} />
              Step into the labs
            </Link>
          </div>
          <div className="hero-facts">
            <span>
              <Check size={14} />
              Free to explore
            </span>
            <span>
              <Check size={14} />
              Learn at your pace
            </span>
            <span>
              <Check size={14} />
              No account needed
            </span>
          </div>
        </div>
        <div className="hero-image">
          <div className="film-top">
            <span>
              <span className="record-dot" /> A STUDY IN SEEING
            </span>
            <span>FRAME / 001</span>
          </div>
          <Scene position={36} size="Wide" />
          <div className="hero-image-caption">
            <div>
              <span className="eyebrow">EVERY FRAME IS A DECISION</span>
              <p>What will you choose to show?</p>
            </div>
            <Link to="/labs/composition" aria-label="Open composition lab">
              <ArrowUpRight size={26} />
            </Link>
          </div>
          <div className="image-detail">
            COMPOSITION STUDY · ORIGINAL ILLUSTRATION
          </div>
        </div>
      </section>
      <div className="learning-strip">
        <div>
          <strong>06</strong>
          <span>Focused courses</span>
        </div>
        <div>
          <strong>18</strong>
          <span>Original lessons</span>
        </div>
        <div>
          <strong>03</strong>
          <span>Interactive labs</span>
        </div>
        <div className="strip-note">
          <span>THEORY INTO PRACTICE</span>
          <p>
            Understand it. Experiment with it.
            <br />
            Use it in your next film.
          </p>
        </div>
      </div>
      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">CHOOSE YOUR STARTING POINT</p>
            <h2>The foundations of filmmaking</h2>
          </div>
          <Link to="/courses" className="text-link">
            View all courses
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="course-grid">
          {courses.slice(0, 3).map((c, i) => (
            <CourseCard key={c.id} course={c} index={i} />
          ))}
        </div>
      </section>
      <section className="lab-banner">
        <div className="lab-banner-art">
          <FlaskConical size={70} />
          <span>f/2.8</span>
          <span>1/50</span>
          <span>ISO 400</span>
        </div>
        <div>
          <p className="eyebrow">DON’T JUST READ ABOUT IT</p>
          <h2>
            Change a setting.
            <br />
            See a different story.
          </h2>
          <p>
            Experiment with exposure, composition and screen direction in three
            interactive labs.
          </p>
          <Link to="/labs" className="button">
            Explore the laboratories
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <div className="two-col bottom-note">
        <div>
          <p className="eyebrow">PLAN SOMETHING OF YOUR OWN</p>
          <h2>Your next scene starts with a shot.</h2>
          <p>
            Turn an idea into a sequence in the storyboard studio. Build,
            reorder, annotate and print a practical shot plan.
          </p>
          <Link to="/studio/storyboards" className="text-link">
            Open storyboard studio
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="local-note">
          <span className="local-dot" />
          BROWSER-LOCAL LEARNING
          <p>
            Progress, notes and storyboards save on this device. Export a backup
            in Settings to take your work with you.
          </p>
          <Link to="/settings">Manage your learning data →</Link>
        </div>
      </div>
    </>
  );
}
export function About() {
  return (
    <>
      <p className="eyebrow">ABOUT THE PROJECT</p>
      <h1>
        Film education,
        <br />
        made practical.
      </h1>
      <p className="lede">
        FilmAcademy is a learning project for Film and Media Studies students,
        beginner filmmakers and instructors who need a visual way to explain the
        craft.
      </p>
      <div className="two-col">
        <section className="panel">
          <h2>Why it exists</h2>
          <p>
            A definition alone rarely explains how a camera or edit changes a
            scene. The platform links original lessons with controlled visual
            experiments, short formative questions and practical tasks.
          </p>
          <p>
            Project owner: Sadman Labib Chowdhury. Built with React, TypeScript
            and Vite, using original vector scenes and browser-local records.
          </p>
          <h2>What it measures</h2>
          <p>
            Lesson completion is self-reported. Quiz scores are computed from
            actual answers. Neither establishes professional competence or
            accredited academic credit.
          </p>
        </section>
        <section className="panel">
          <h2>Design & architecture</h2>
          <p>
            Typed curriculum objects keep content separate from interface code.
            A versioned learning store validates imports and preserves progress
            across refreshes. Hash-based routes support static hosting.
          </p>
          <p>
            Mobile navigation, keyboard focus, reduced motion and readable
            explanations accompany the visual experiments. Accessible design is
            a continuing practice; no formal compliance certification is
            claimed.
          </p>
          <Link className="text-link" to="/instructor-preview">
            Explore the teaching design →
          </Link>
        </section>
      </div>
    </>
  );
}
export function Help() {
  return (
    <>
      <p className="eyebrow">A QUICK ORIENTATION</p>
      <h1>Make yourself at home.</h1>
      <div className="faq">
        {[
          [
            "Where should I begin?",
            "Start with Film Language, then Cinematography and Editing. Open a course to see its outcomes and lesson sequence. Each lesson includes a practical task.",
          ],
          [
            "How do I earn a learning record?",
            "Mark every lesson in a course complete and score at least 80% on one of its quizzes. The record is a non-accredited summary of local activity.",
          ],
          [
            "Where is my progress saved?",
            "Only in the current browser’s local storage. Use Settings → Export learning data to create a manual backup. Clearing browser data may remove it.",
          ],
          [
            "Can I use this in class?",
            "Yes. The instructor preview maps objectives, exercises and example assessments. Students use their own local records; there is no shared instructor dashboard.",
          ],
          [
            "Are the labs camera-accurate?",
            "They are educational illustrations, not calibrated optics or sensor simulations. Use them to predict relationships, then test with your actual equipment.",
          ],
          [
            "How do storyboards work?",
            "Create a board, add shots and describe the action. Reorder with arrows or drag cards. Export JSON for an editable backup, or Print for a handout. Imported boards are added as new projects.",
          ],
        ].map(([q, a]) => (
          <details className="panel" key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
