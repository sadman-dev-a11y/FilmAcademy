import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Frame,
  Scissors,
  AudioLines,
  ScanSearch,
} from "lucide-react";
import type { Course } from "../data/types";
import { useLearning } from "../hooks/useLearning";
import { percent } from "../lib/store";
export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const C =
    (
      {
        camera: Camera,
        clapper: Clapperboard,
        frame: Frame,
        scissors: Scissors,
        audio: AudioLines,
        research: ScanSearch,
      } as Record<string, typeof Camera>
    )[name] || Frame;
  return <C size={size} aria-hidden="true" />;
}
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow || "THE FILMACADEMY WORKSPACE"}</p>
        <h1>{title}</h1>
        {description && <p className="lede">{description}</p>}
      </div>
      {children}
    </header>
  );
}
export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
export function CourseCard({
  course,
  index = 0,
}: {
  course: Course;
  index?: number;
}) {
  const { state } = useLearning();
  const p = percent(course, state);
  return (
    <Link
      className="course-card"
      to={`/courses/${course.id}`}
      style={{ "--accent": course.color } as React.CSSProperties}
    >
      <div className={`course-art art-${course.icon}`}>
        <div className="art-lines" />
        <Icon name={course.icon} size={48} />
        <span className="course-number">0{index + 1}</span>
        <span className="course-tag">{course.category}</span>
      </div>
      <div className="course-copy">
        <div className="meta">
          <span>{course.level}</span>
          <span>
            {course.lessons.length} lessons ·{" "}
            {course.lessons.reduce((s, l) => s + l.minutes, 0)} min
          </span>
        </div>
        <h3>{course.shortTitle}</h3>
        <p>{course.summary}</p>
        {p > 0 ? (
          <Progress value={p} label="Lesson progress" />
        ) : (
          <div className="card-link">
            Explore course <ArrowUpRight size={17} />
          </div>
        )}
      </div>
    </Link>
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="empty">
      <Frame size={32} />
      <h2>{title}</h2>
      {children}
    </div>
  );
}
