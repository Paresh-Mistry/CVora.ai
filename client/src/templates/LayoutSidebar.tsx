import * as React from "react";

import { Badge } from "../components/ui/badge";
import type {
  LayoutProps,
  ResolvedContactItem,
  ContactItem,
} from "../services/resume.services";
import { Github, Linkedin, Mail, Phone, Trophy, Award, ArrowUpRight } from "lucide-react";
import { LanguageItem } from "../context/FormTypes";

function SideLabel({
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
      style={{
        fontFamily: font,
        fontSize: "8.5px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "2px",
        color: accent,
        marginBottom: "8px",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
        paddingBottom: "4px",
      }}
    >
      {children}
    </h2>
  );
}

function MainTitle({
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
      style={{
        fontFamily: font,
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "2px",
        color: accent,
        borderBottom: `1.5px solid ${accent}22`,
        paddingBottom: "4px",
        marginBottom: "10px",
        marginTop: "16px",
      }}
    >
      {children}
    </h2>
  );
}

/** Splits a bullets field into a clean array, regardless of source shape. */
function normalizeBullets(bullets: string[] | string | undefined): string[] {
  if (Array.isArray(bullets)) return bullets;
  if (typeof bullets === "string") {
    return bullets
      .split(/\n|•|◦|▪/)
      .map((b) => b.trim())
      .filter(Boolean);
  }
  return [];
}

function languageLabel(l: LanguageItem): string {
  return typeof l === "string" ? l : l.language ?? "";
}

function languageProficiency(l: LanguageItem): string | undefined {
  return typeof l === "string" ? undefined : l.proficiency;
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export default function LayoutSidebar({ d, tk }: LayoutProps) {
  const f = tk?.font ?? '';
  const ac = tk?.accent ?? '';
  const sideWidth = tk?.sideWidth || "190px";
  const sideBg = tk?.sidebarBg || ac;
  const sideText = tk?.sidebarText || "#fff";
  const sideAccent = tk?.sidebarAccent || "rgba(255,255,255,0.5)";

  const skills = d?.skill || [];
  const experience = d.experience || [];
  const education = d.education || [];
  const languages = d.languages || [];
  const certificates = d.certifications || [];
  const achievements = d.achievements || [];

  // ── Skills ──────────────────────────────────────────────────────────────
  const renderSideSkills = () => {
    if (skills.length === 0) return null;

    if (tk?.skillStyle === "bar") {
      return (
        <ul className="m-0 list-none p-0">
          {skills.map((s, i) => (
            <li key={i} style={{ marginBottom: "6px" }}>
              <div
                style={{
                  fontFamily: f,
                  fontSize: "10px",
                  color: sideText,
                  marginBottom: "3px",
                  opacity: 0.85,
                }}
              >
                {s}
              </div>
              <div
                aria-hidden="true"
                style={{ height: "2px", background: "rgba(255,255,255,0.15)", borderRadius: "2px" }}
              >
                <div
                  style={{
                    height: "2px",
                    borderRadius: "2px",
                    background: sideText,
                    width: `${62 + (i * 11) % 38}%`,
                    opacity: 0.7,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
        {skills.map((s, i) => (
          <li key={i}>
            <Badge
              variant="secondary"
              className="border-0 font-normal"
              style={{
                fontFamily: f,
                fontSize: "9px",
                background: "rgba(255,255,255,0.15)",
                color: sideText,
                borderRadius: "3px",
                padding: "2px 6px",
              }}
            >
              {s}
            </Badge>
          </li>
        ))}
      </ul>
    );
  };

  // ── Avatar / Photo ────────────────────────────────────────────────────────
  const renderAvatar = () => {
    // Check if a dedicated photo URL exists, otherwise check fallback string or token config
    const photoUrl = d.education  || (typeof tk?.avatar === 'string' && tk.avatar.startsWith('http') ? tk.avatar : null);

    if (!photoUrl && !tk?.avatar) return null;

    const initials = d.name
      ? d.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
      : "";

    const isSquare = tk?.avatar === "square";

    return (
      <div
        style={{
          width: isSquare ? "200px" : "120px",
          height: isSquare ? "200px" : "120px",
          borderRadius: isSquare ? "6px" : "50%",
          background: "rgba(255,255,255,0.15)",
          border: "2px solid rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: f,
          fontSize: isSquare ? "18px" : "20px",
          fontWeight: 700,
          color: sideText,
          margin: "0 auto 12px",
          overflow: "hidden",
        }}
      >
        {photoUrl ? (
          <img
            src={"https://paresh-mistry.github.io/assets/Profileimg-Dk0oU7yT.jpg"}
            alt={d.name || "Profile photo"}
            className="w-[100%] h-[100%] object-cover"
          />
        ) : (
          initials
        )}
      </div>
    );
  };

  // ── Contact ──────────────────────────────────────────────────────────────
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
    <div
      className="flex w-full overflow-hidden border border-black/5 shadow-lg"
      style={{ minHeight: "297mm", fontFamily: f, fontSize: "12px", background: "#fff" }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col gap-[18px]"
        style={{
          width: sideWidth,
          minWidth: sideWidth,
          background: sideBg,
          padding: "28px 16px",
        }}
        aria-label="Profile and contact details"
      >
        {renderAvatar() || "No Image"}
 
        <div style={{ textAlign: tk?.avatar || d.photo ? "center" : "left" }}>
          <h1
            style={{
              fontFamily: tk?.displayFont || f,
              fontSize: "15px",
              fontWeight: 700,
              color: sideText,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {d.name}
          </h1>
          {d.domain && (
            <p style={{ fontFamily: f, fontSize: "10px", color: sideAccent, marginTop: "4px", marginBottom: 0 }}>
              {d.domain}
            </p>
          )}
        </div>

        {contactItems.length > 0 && (
          <section aria-labelledby="sidebar-contact">
            <SideLabel font={f ?? ''} accent={sideAccent}>
              <span id="sidebar-contact">Contact</span>
            </SideLabel>
            <address className="not-italic">
              <ul className="m-0 list-none p-0">
                {contactItems.map((c, i) => {
                  const Icon = c.icon
                  return (
                    <li
                      key={i}
                      className="flex gap-[5px] break-all"
                      style={{ fontFamily: f, fontSize: "9.5px", color: sideText, opacity: 0.75, marginBottom: "5px" }}
                    >
                      <span aria-hidden="true" style={{ opacity: 0.5 }}>
                        <Icon size={10} />
                      </span>
                      <span className="sr-only">{c.prefix}:</span>
                      <span>{c.value}</span>
                    </li>
                  )
                })}
              </ul>
            </address>
          </section>
        )}

        {skills.length > 0 && (
          <section aria-labelledby="sidebar-skills">
            <SideLabel font={f} accent={sideAccent}>
              <span id="sidebar-skills">Skills</span>
            </SideLabel>
            {renderSideSkills()}
          </section>
        )}

        {languages.length > 0 && (
          <section aria-labelledby="sidebar-languages">
            <SideLabel font={f} accent={sideAccent}>
              <span id="sidebar-languages">Languages</span>
            </SideLabel>
            <ul className="m-0 list-none space-y-1.5 p-0">
              {languages.map((l, i) => {
                const proficiency = languageProficiency(l);
                return (
                  <li
                    key={i}
                    className="flex justify-between text-[11px]"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    <span>{languageLabel(l)}</span>
                    {proficiency && (
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>{proficiency}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1" style={{ padding: "28px 26px" }}>
        {d.summary && (
          <section aria-labelledby="main-about">
            <MainTitle font={f} accent={ac}>
              <span id="main-about">About</span>
            </MainTitle>
            <p style={{ fontFamily: f, fontSize: "11px", color: "#444", lineHeight: 1.7, margin: 0 }}>
              {d.summary}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <section aria-labelledby="main-experience">
            <MainTitle font={f} accent={ac}>
              <span id="main-experience">Experience</span>
            </MainTitle>
            {experience.map((exp, i) => {
              const bullets = normalizeBullets(exp.description);
              return (
                <article
                  key={exp.role ?? i}
                  style={{
                    marginBottom: "14px",
                    paddingLeft: "10px",
                    borderLeft: `2.5px solid ${i === 0 ? ac : `${ac}40`}`,
                  }}
                >
                  <div className="flex justify-between gap-2">
                    <h3 style={{ fontFamily: f, fontWeight: 700, fontSize: "12px", margin: 0 }}>
                      {exp.role}
                    </h3>
                    {exp.duration && (
                      <span
                        className="whitespace-nowrap"
                        style={{
                          fontFamily: f,
                          fontSize: "10px",
                          color: "#aaa",
                          background: `${ac}10`,
                          padding: "1px 7px",
                          borderRadius: "10px",
                        }}
                      >
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  {exp.company && (
                    <p
                      style={{
                        fontFamily: f,
                        fontSize: "10.5px",
                        color: ac,
                        fontWeight: 600,
                        margin: "0 0 4px",
                      }}
                    >
                      {exp.company}
                    </p>
                  )}
                  {bullets.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: "14px" }}>
                      {bullets.map((b, j) => (
                        <li key={j} style={{ fontFamily: f, fontSize: "10.5px", color: "#444", marginBottom: "2px" }}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </section>
        )}

        {education.length > 0 && (
          <section aria-labelledby="main-education">
            <MainTitle font={f} accent={ac}>
              <span id="main-education">Education</span>
            </MainTitle>
            {education.map((e, i) => (
              <div key={e.degree ?? i} style={{ marginBottom: "10px" }}>
                <h3 style={{ fontFamily: f, fontWeight: 700, fontSize: "12px", margin: 0 }}>
                  {e.degree}
                </h3>
                <p style={{ fontFamily: f, fontSize: "10.5px", color: ac, margin: "1px 0 0" }}>
                  {[e.institute, e.year].filter(Boolean).join(" · ")}
                </p>
                {e.grade && (
                  <p style={{ fontFamily: f, fontSize: "10px", color: "#888", margin: "1px 0 0" }}>
                    Grade: {e.grade}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <section aria-labelledby="main-achievements">
            <MainTitle font={f} accent={ac}>
              <span id="main-achievements">Achievements</span>
            </MainTitle>
            <ul className="m-0 list-none p-0 space-y-2">
              {achievements.map((achievement, i) => {
                const title = typeof achievement === "string" ? achievement : achievement.title;
                const desc = typeof achievement === "string" ? null : achievement.description;
                return (
                  <li key={i} className="flex items-start gap-2" style={{ paddingLeft: "4px" }}>
                    <span aria-hidden="true" style={{ color: ac, marginTop: "2px", opacity: 0.85 }}>
                      <Trophy size={11} />
                    </span>
                    <div>
                      <h3 style={{ fontFamily: f, fontWeight: 600, fontSize: "11px", margin: 0, color: "#222" }}>
                        {title}
                      </h3>
                      {desc && (
                        <p style={{ fontFamily: f, fontSize: "10.5px", color: "#555", margin: "1px 0 0", lineHeight: 1.5 }}>
                          {desc}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <section aria-labelledby="main-certificates">
            <MainTitle font={f} accent={ac}>
              <span id="main-certificates">Certificates</span>
            </MainTitle>
            <div className="grid grid-cols-1 gap-2">
              {certificates.map((cert, i) => {
                const title = typeof cert === "string" ? cert : cert.title;
                const issuer = typeof cert === "string" ? null : cert.issuer;
                const date = typeof cert === "string" ? null : cert.date;
                const url = typeof cert === "string" ? undefined : cert.url
                return (
                  <div>
                    <div className="flex items-center justify-between">

                      <div key={i} className="flex items-start gap-2" style={{ paddingLeft: "4px" }}>
                        <span aria-hidden="true" style={{ color: ac, marginTop: "2px", opacity: 0.85 }}>
                          <Award size={11} />
                        </span>
                        <h3 style={{ fontFamily: f, fontWeight: 600, fontSize: "11px", margin: 0, color: "#222" }}>
                          {title}
                        </h3>
                      </div>
                      <a href={url} className="text-[10px] flex gap-1 items-center">Certificate <ArrowUpRight size={10}/></a>
                    </div>
                    <div>
                      {
                        (issuer || date) && (
                          <p style={{ fontFamily: f, fontSize: "10px", color: ac, margin: "1px 0 0", opacity: 0.9 }}>
                            {[issuer, date].filter(Boolean).join(" · ")}
                          </p>
                        )
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div >
  );
}