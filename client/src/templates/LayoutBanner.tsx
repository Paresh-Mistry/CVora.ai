import * as React from "react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

import { Separator } from "../components/ui/separator";
import { DefaultData } from "../data.json";
import type {
  ContactItem,
  LayoutProps,
  ResolvedContactItem,
  ResumeData,
} from "../services/resume.services";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";

function hasItems<T>(arr: T[] | undefined, key: keyof T | null): boolean {
  if (!Array.isArray(arr)) return false;
  return arr.some((item) =>
    typeof item === "string"
      ? item.trim().length > 0
      : key !== null && typeof (item as any)?.[key] === "string"
      ? ((item as any)[key] as string).trim().length > 0
      : false
  );
}

/** Merges incoming resume data with sane fallbacks from DefaultData. */
function withDefaults(d: ResumeData | undefined | null): ResumeData {
  if (!d || !d.name?.trim()) return DefaultData as ResumeData;

  return {
    ...(DefaultData as ResumeData),
    ...d,
    summary: d.summary?.trim() || (DefaultData as ResumeData).summary,
    skill: hasItems(d.skill, null) ? d.skill : (DefaultData as ResumeData).skill,
    experience: hasItems(d.experience, "role")
      ? d.experience
      : (DefaultData as ResumeData).experience,
    education: hasItems(d.education, "degree")
      ? d.education
      : (DefaultData as ResumeData).education,
    projects: hasItems(d.projects, "project_title")
      ? d.projects
      : (DefaultData as ResumeData).projects,
    achievements: hasItems(d.achievements, "title")
      ? d.achievements
      : (DefaultData as ResumeData).achievements,
    languages: hasItems(d.languages, "language")
      ? d.languages
      : (DefaultData as ResumeData).languages,
    certifications: hasItems(d.certifications, "title")
      ? d.certifications
      : (DefaultData as ResumeData).certifications,
  };
}

/** Splits a bullets field into a clean array, regardless of source shape. */
function normalizeBullets(bullets:["experience"]): string[] {
  if (Array.isArray(bullets)) return bullets;
  if (typeof bullets === "string") {
    return bullets
      .split(/\n|•|◦|▪/)
      .map((b) => b.trim())
      .filter(Boolean);
  }
  return [];
}

function SectionHeading({
  children,
  font,
  accent,
}: {
  children: React.ReactNode;
  font: string;
  accent: string;
}) {
  return (
    <h2
      className="mb-2 mt-[18px] flex items-center gap-2"
      style={{
        fontFamily: font,
        fontSize: "9px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "2.5px",
        color: accent,
      }}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="h-px flex-1"
        style={{ background: `${accent}25` }}
      />
    </h2>
  );
}


export default function LayoutBanner({ d: rawD, tk = {} }: LayoutProps) {
  const d = withDefaults(rawD);
  const f = tk.font || "Inter, ui-sans-serif, sans-serif";
  const ac = tk.accent || "#2563eb";
  const bg = tk.bannerBg || ac;
  const skills = (d.skill || []).filter(Boolean);

  const renderSkills = () => {
    if (tk.skillStyle === "pill") {
      return (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {skills.map((s, i) => (
            <li key={i}>
              <Badge
                variant="secondary"
                className="border-0 font-medium"
                style={{
                  fontFamily: f,
                  fontSize: "9px",
                  background: `${ac}18`,
                  color: ac,
                  borderRadius: "4px",
                  padding: "3px 8px",
                }}
              >
                {s}
              </Badge>
            </li>
          ))}
        </ul>
      );
    }

    if (tk.skillStyle === "dot") {
      return (
        <ul className="m-0 list-none p-0">
          {skills.map((s, i) => (
            <li
              key={i}
              style={{ fontFamily: f, fontSize: "10px", color: "#555", marginBottom: "4px" }}
            >
              <span aria-hidden="true" style={{ color: ac, marginRight: "5px" }}>
                ◆
              </span>
              {s}
            </li>
          ))}
        </ul>
      );
    }

    // default — progress bars (original style, refined hairline + radius)
    return (
      <ul className="m-0 list-none p-0">
        {skills.map((s, i) => (
          <li key={i} style={{ marginBottom: "7px" }}>
            <div style={{ fontFamily: f, fontSize: "10px", color: "#444", marginBottom: "3px" }}>
              {s}
            </div>
            <div
              aria-hidden="true"
              style={{ height: "3px", background: "#eee", borderRadius: "2px", overflow: "hidden" }}
            >
              <div
                style={{
                  height: "3px",
                  borderRadius: "2px",
                  background: ac,
                  width: `${60 + (i * 13) % 40}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    );
  };

  // ── Experience ──────────────────────────────────────────────────────────
  const renderExperience = () =>
    (d.experience || []).map((exp, idx) => {
      const bullets = normalizeBullets(exp.description);
      const rawBulletsIsString = typeof exp.description === "string";

      return (
        <article
          key={idx}
          className="relative"
          style={{
            marginBottom: "14px",
            paddingLeft: "12px",
            borderLeft: `2px solid ${ac}20`,
          }}
        >
          {/* Title + Date */}
          <div className="flex items-start justify-between gap-2">
            <h3
              style={{
                fontFamily: f,
                fontWeight: 700,
                fontSize: "11.5px",
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              {exp.role}
            </h3>

            {exp.duration && (
              <span
                className="whitespace-nowrap"
                style={{ fontFamily: f, fontSize: "9px", color: "#777" }}
              >
                {exp.duration}
              </span>
            )}
          </div>

          {/* Company */}
          {exp.company && (
            <p
              style={{
                fontFamily: f,
                fontSize: "10px",
                color: ac,
                fontWeight: 600,
                margin: "1px 0 4px",
              }}
            >
              {exp.company}
            </p>
          )}

          {/* Bullet points */}
          {bullets.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "14px", lineHeight: 1.45 }}>
              {bullets.map((bullet, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: f,
                    fontSize: "9.8px",
                    color: "#444",
                    marginBottom: "2px",
                  }}
                >
                  {bullet}
                </li>
              ))}
            </ul>
          ) : rawBulletsIsString ? (
            <p
              style={{
                fontFamily: f,
                fontSize: "9.8px",
                color: "#444",
                margin: 0,
                lineHeight: 1.45,
              }}
            >
              {exp.description as string}
            </p>
          ) : null}
        </article>
      );
    });

  // ── Education ───────────────────────────────────────────────────────────
  const renderEducation = () =>
    (d.education || []).map((edu, idx) => (
      <div
        key={idx}
        style={{
          marginBottom: "12px",
          paddingLeft: "12px",
          borderLeft: `2px solid ${ac}20`,
        }}
      >
        <h3 style={{ fontFamily: f, fontWeight: 700, fontSize: "12px", color: "#1a1a1a", margin: 0 }}>
          {edu.degree || "—"}
        </h3>
        <p style={{ fontFamily: f, fontSize: "10.5px", color: "#666", margin: "1px 0 0" }}>
          {[edu.institute, edu.year].filter(Boolean).join(" · ")}
        </p>
        {edu.grade && (
          <p style={{ fontFamily: f, fontSize: "10px", color: "#888", margin: "1px 0 0" }}>
            Grade: {edu.grade}
          </p>
        )}
      </div>
    ));

  // ── Projects ─────────────────────────────────────────────────────────────
  const projects = (d.projects || []).filter((p) => p.project_title);
  const renderProjects = () =>
    projects.length > 0 && (
      <section aria-labelledby="section-projects">
        <SectionHeading font={f} accent={ac}>
          <span id="section-projects">Projects</span>
        </SectionHeading>
        {projects.map((proj, idx) => (
          <article
            key={idx}
            style={{
              marginBottom: "12px",
              paddingLeft: "12px",
              borderLeft: `2px solid ${ac}20`,
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 style={{ fontFamily: f, fontWeight: 700, fontSize: "11.5px", color: "#1a1a1a", margin: 0 }}>
                {proj.project_title}
              </h3>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap no-underline"
                  style={{ fontFamily: f, fontSize: "9px", color: ac }}
                >
                  ↗ link
                </a>
              )}
            </div>
            {proj.tech_stack && (
              <p
                style={{
                  fontFamily: f,
                  fontSize: "9.5px",
                  color: ac,
                  fontWeight: 500,
                  margin: "2px 0 3px",
                }}
              >
                Tech stack: {proj.tech_stack}
              </p>
            )}
            {proj.description && (
              <p style={{ fontFamily: f, fontSize: "10.5px", color: "#555", margin: 0, lineHeight: 1.55 }}>
                {proj.description}
              </p>
            )}
          </article>
        ))}
      </section>
    );

  // ── Achievements ─────────────────────────────────────────────────────────
  const achievements = (d.achievements || []).filter((a) => a.title);
  const renderAchievements = () =>
    achievements.length > 0 && (
      <section aria-labelledby="section-achievements">
        <SectionHeading font={f} accent={ac}>
          <span id="section-achievements">Achievements</span>
        </SectionHeading>
        {achievements.map((ach, idx) => (
          <div key={idx} style={{ marginBottom: "9px" }}>
            <h3 style={{ fontFamily: f, fontWeight: 600, fontSize: "11px", color: "#1a1a1a", margin: 0 }}>
              {ach.title}
            </h3>
            {ach.description && (
              <p style={{ fontFamily: f, fontSize: "10px", color: "#555", margin: "2px 0 0", lineHeight: 1.5 }}>
                {ach.description}
              </p>
            )}
          </div>
        ))}
      </section>
    );

  // ── Languages ─────────────────────────────────────────────────────────────
  const languages = (d.languages || []).filter((l) => l.language);
  const renderLanguages = () =>
    languages.length > 0 && (
      <section aria-labelledby="section-languages">
        <SectionHeading font={f} accent={ac}>
          <span id="section-languages">Languages</span>
        </SectionHeading>
        <ul className="m-0 list-none p-0">
          {languages.map((l, i) => (
            <li
              key={i}
              className="flex items-center justify-between"
              style={{ fontFamily: f, fontSize: "10px", color: "#555", marginBottom: "6px" }}
            >
              <span>{l.language}</span>
              {l.proficiency && (
                <Badge
                  variant="secondary"
                  className="border-0 font-medium"
                  style={{
                    fontFamily: f,
                    fontSize: "8.5px",
                    background: `${ac}12`,
                    color: ac,
                    borderRadius: "4px",
                    padding: "2px 6px",
                  }}
                >
                  {l.proficiency}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </section>
    );

  // ── Certifications ───────────────────────────────────────────────────────
  const certs = (d.certifications || []).filter((c) => c.title);
  const renderCertifications = () =>
    certs.length > 0 && (
      <section aria-labelledby="section-certifications">
        <SectionHeading font={f} accent={ac}>
          <span id="section-certifications">Certifications</span>
        </SectionHeading>
        {certs.map((cert, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <div style={{ fontFamily: f, fontSize: "10px", fontWeight: 600, color: "#333", lineHeight: 1.4 }}>
              {cert.url ? (
                <a href={cert.url} target="_blank" rel="noreferrer" className="text-[#333] no-underline">
                  {cert.title}
                </a>
              ) : (
                cert.title
              )}
            </div>
            {cert.issuer && (
              <div style={{ fontFamily: f, fontSize: "9px", color: ac, fontWeight: 500 }}>
                {cert.issuer}
              </div>
            )}
            {cert.date && (
              <div style={{ fontFamily: f, fontSize: "8.5px", color: "#aaa" }}>{cert.date}</div>
            )}
          </div>
        ))}
      </section>
    );

  // ── Contact list ──────────────────────────────────────────────────────────
  const contactItems: ResolvedContactItem[] = (
    [
      { prefix: "mailto:", icon: Mail, value: d.email },
      { prefix: "tel:", icon: Phone, value: d.phone },
      { prefix: "https://", icon: Linkedin, value: d.linkedin },
      { prefix: "https://github.com/", icon: Github, value: d.github },
    ] as ContactItem[]
  ).filter((c): c is ResolvedContactItem => Boolean(c.value));

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    // Tailwind: chrome, shadow, border-radius, overflow
    <div className="w-full overflow-hidden border border-black/5 shadow-lg">
      {/* ── Banner ────────────────────────────────────────────────────────── */}
      <header className="px-9 pb-5 pt-7" style={{ background: bg }}>
        <h1
          className="font-extrabold leading-none text-white"
          style={{
            fontFamily: tk.displayFont || f,
            fontSize: tk.nameSize || "30px",
            letterSpacing: "-0.5px",
          }}
        >
          {d.name}
        </h1>
        {d.domain && (
          <p
            className="mb-3 mt-1.5 text-[12px]"
            style={{ color: "rgba(255,255,255,0.78)", fontFamily: f }}
          >
            {d.domain}
          </p>
        )}
        {contactItems.length > 0 && (
          <ul className="m-0 flex flex-wrap gap-x-5 gap-y-1.5 list-none p-0">
            {contactItems.map((c, i) => {
              const Icon = c.icon;
              return (
                <li
                  key={i}
                  className="flex items-center gap-1.5 text-[10px]"
                  style={{ color: "rgba(255,255,255,0.65)", fontFamily: f }}
                >
                  <Icon size={10} aria-hidden="true" />
                  <span>{c.value}</span>
                </li>
              );
            })}
          </ul>
        )}
      </header>

      <Separator className="opacity-50" style={{ background: `${ac}20` }} />

      {/* ── Two-column body ─────────────────────────────────────────────────── */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 190px" }}>
        {/* Left — main content (reads first in DOM: primary qualifying info) */}
        <main className="px-9 py-6" style={{ borderRight: `1px solid ${ac}15` }}>
          {/* Summary */}
          {d.summary && (
            <div
              className={cn("mb-5 rounded-md px-4 py-3")}
              style={{ background: `${ac}08`, borderLeft: `3px solid ${ac}` }}
            >
              <p className="m-0 text-[11px] leading-relaxed" style={{ color: "#555", fontFamily: f }}>
                {d.summary}
              </p>
            </div>
          )}

          {d.experience && d.experience.length > 0 && (
            <section aria-labelledby="section-experience">
              <SectionHeading font={f} accent={ac}>
                <span id="section-experience">Experience</span>
              </SectionHeading>
              {renderExperience()}
            </section>
          )}

          {d.education && d.education.length > 0 && (
            <section aria-labelledby="section-education">
              <SectionHeading font={f} accent={ac}>
                <span id="section-education">Education</span>
              </SectionHeading>
              {renderEducation()}
            </section>
          )}

          {renderProjects()}
          {renderAchievements()}
        </main>

        {/* Right — sidebar (skills / languages / certifications / contact) */}
        <aside className="px-5 py-6" aria-label="Skills and contact details">
          {skills.length > 0 && (
            <section aria-labelledby="section-skills">
              <SectionHeading font={f} accent={ac}>
                <span id="section-skills">Skills</span>
              </SectionHeading>
              {renderSkills()}
            </section>
          )}

          {renderLanguages()}
          {renderCertifications()}

          {contactItems.length > 0 && (
            <section aria-labelledby="section-contact">
              <SectionHeading font={f} accent={ac}>
                <span id="section-contact">Contact</span>
              </SectionHeading>
              <address className="not-italic">
                <ul className="m-0 list-none p-0">
                  {contactItems.map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <li
                        key={i}
                        className="mb-1.5 flex gap-1.5 break-all text-[9.5px] text-gray-500"
                        style={{ fontFamily: f }}
                      >
                        <Icon size={10} aria-hidden="true" className="mt-[1px] shrink-0" />
                        <a
                          href={`${c.prefix}${c.value}`}
                          target="_blank"
                          rel="noreferrer"
                          title={`${c.prefix}${c.value}`}
                          className="hover:underline"
                        >
                          {c.value}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </address>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}