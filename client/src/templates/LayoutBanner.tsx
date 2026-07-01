import * as React from "react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

import { Separator } from "../components/ui/separator";
import type {
  ContactItem,
  LayoutProps,
  ResolvedContactItem,
} from "../services/resume.services";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";

const DEFAULT_FONT = "Inter, ui-sans-serif, sans-serif";
const DEFAULT_ACCENT = "#2563eb";

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

function getInitials(name?: string): string {
  if (!name) return "";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

/** Resolves the `divider` token into a hairline rule after a section heading. */
function DividerLine({ divider, color }: { divider: string | undefined; color: string }) {
  if (divider === "none") return null;
  const style: React.CSSProperties =
    divider === "thick"
      ? { height: "2px", background: color }
      : divider === "dashed"
      ? { height: 0, borderTop: `1px dashed ${color}` }
      : { height: "1px", background: color }; // line / underline (default)
  return <span aria-hidden="true" className="flex-1" style={style} />;
}

function SectionHeading({
  children,
  font,
  accent,
  divider,
  sectionSpacing,
}: {
  children: React.ReactNode;
  font: string;
  accent: string;
  divider?: string;
  sectionSpacing: string;
}) {
  return (
    <h2
      className="mb-2 flex items-center gap-2"
      style={{
        fontFamily: font,
        fontSize: "9px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "2.5px",
        color: accent,
        marginTop: sectionSpacing,
      }}
    >
      <span>{children}</span>
      <DividerLine divider={divider} color={`${accent}25`} />
    </h2>
  );
}

function isExternal(prefix: string): boolean {
  return prefix.startsWith("http");
}

export default function LayoutBanner({ d, tk = {} }: LayoutProps) {
  const f = tk.font || DEFAULT_FONT;
  const ac = tk.accent || DEFAULT_ACCENT;
  const bg = tk.bannerBg || ac;

  // Spacing / shape tokens
  const mainPadding ="24px 26px";
  const sectionSpacing = tk.sectionSpacing || "18px";
  const paragraphSpacing = tk.paragraphSpacing || "8px";
  const radius = tk.borderRadius || "6px";
  const sideWidth = tk.sidebarWidth || "190px";

  // Toggle tokens (default "on" — matches a full-featured resume)
  const showIcons = tk.showIcons ?? true;
  const showProgress = tk.showProgress ?? true;
  const showBadges = tk.showBadges ?? true;
  const useTimeline = tk.timeline ?? false;
  const showAvatar = Boolean(tk.avatar);

  // Right column reads as a distinct panel only if a sidebar color is configured —
  // otherwise it stays the original neutral, minimal look.
  const asideBg = tk.sidebarBg || "transparent";
  const asideText = tk.sidebarBg ? tk.sidebarText || "#fff" : "#555";
  const asideAccent = tk.sidebarBg ? tk.sidebarAccent || "rgba(255,255,255,0.85)" : ac;
  const asideMuted = tk.sidebarBg ? "rgba(255,255,255,0.55)" : "#999";

  const skills = (d.skill || []).filter(Boolean);
  const photoUrl = (d as any)?.photo || (d as any)?.avatarUrl || null;

  // ── Skills (all 5 skillStyle variants) ────────────────────────────────────
  const renderSkills = () => {
    if (skills.length === 0) return null;

    switch (tk.skillStyle) {
      case "pill":
      case "tag":
        return (
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {skills.map((s, i) =>
              showBadges ? (
                <li key={i}>
                  <Badge
                    variant="secondary"
                    className="border-0 font-medium"
                    style={{
                      fontFamily: f,
                      fontSize: "9px",
                      background: `${asideAccent}18`,
                      color: asideAccent,
                      borderRadius: tk.skillStyle === "pill" ? "999px" : radius,
                      padding: "3px 8px",
                    }}
                  >
                    {s}
                  </Badge>
                </li>
              ) : (
                <li
                  key={i}
                  style={{
                    fontFamily: f,
                    fontSize: "9px",
                    color: asideAccent,
                    border: `1px solid ${asideAccent}40`,
                    borderRadius: tk.skillStyle === "pill" ? "999px" : radius,
                    padding: "3px 8px",
                  }}
                >
                  {s}
                </li>
              )
            )}
          </ul>
        );

      case "dot":
        return (
          <ul className="m-0 list-none p-0">
            {skills.map((s, i) => (
              <li
                key={i}
                style={{ fontFamily: f, fontSize: "10px", color: asideText, marginBottom: paragraphSpacing }}
              >
                {showIcons && (
                  <span aria-hidden="true" style={{ color: asideAccent, marginRight: "5px" }}>
                    ◆
                  </span>
                )}
                {s}
              </li>
            ))}
          </ul>
        );

      case "grid":
        return (
          <ul className="m-0 grid grid-cols-2 list-none gap-1.5 p-0">
            {skills.map((s, i) => (
              <li
                key={i}
                className="truncate text-center"
                style={{
                  fontFamily: f,
                  fontSize: "9px",
                  color: showBadges ? asideAccent : asideText,
                  background: showBadges ? `${asideAccent}18` : "transparent",
                  border: showBadges ? "none" : `1px solid ${asideAccent}40`,
                  borderRadius: radius,
                  padding: "4px 6px",
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        );

      case "bar":
      default:
        return (
          <ul className="m-0 list-none p-0">
            {skills.map((s, i) => (
              <li key={i} style={{ marginBottom: paragraphSpacing }}>
                <div style={{ fontFamily: f, fontSize: "10px", color: asideText, marginBottom: "3px" }}>
                  {s}
                </div>
                {showProgress && (
                  <div
                    aria-hidden="true"
                    style={{
                      height: "3px",
                      background: tk.sidebarBg ? "rgba(255,255,255,0.2)" : "#eee",
                      borderRadius: radius,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "3px",
                        borderRadius: radius,
                        background: asideAccent,
                        width: `${60 + (i * 13) % 40}%`,
                      }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        );
    }
  };

  // ── Timeline marker (shared by experience / education / projects) ────────
  const TimelineDot = ({ active }: { active: boolean }) =>
    useTimeline ? (
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-5.5px",
          top: "3px",
          width: "9px",
          height: "9px",
          borderRadius: "50%",
          background: active ? ac : "#fff",
          border: `2px solid ${ac}`,
        }}
      />
    ) : null;

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
            marginBottom: paragraphSpacing,
            paddingLeft: "12px",
            borderLeft: `2px solid ${ac}50`,
          }}
        >
          <TimelineDot active={idx === 0} />
          <div className="flex items-start justify-between gap-2">
            <h3 style={{ fontFamily: f, fontWeight: 700, fontSize: "11.5px", color: "#1a1a1a", margin: 0 }}>
              {exp.role}
            </h3>
            {exp.duration && (
              <span className="whitespace-nowrap" style={{ fontFamily: f, fontSize: "9px", color: "#777" }}>
                {exp.duration}
              </span>
            )}
          </div>

          {exp.company && (
            <p style={{ fontFamily: f, fontSize: "10px", color: ac, fontWeight: 600, margin: "1px 0 4px" }}>
              {exp.company}
            </p>
          )}

          {bullets.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "14px", lineHeight: 1.45 }}>
              {bullets.map((bullet, i) => (
                <li key={i} style={{ fontFamily: f, fontSize: "9.8px", color: "#444", marginBottom: "2px" }}>
                  {bullet}
                </li>
              ))}
            </ul>
          ) : rawBulletsIsString ? (
            <p style={{ fontFamily: f, fontSize: "9.8px", color: "#444", margin: 0, lineHeight: 1.45 }}>
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
        className="relative"
        style={{ marginBottom: paragraphSpacing, paddingLeft: "12px", borderLeft: `2px solid ${ac}20` }}
      >
        <TimelineDot active={idx === 0} />
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
        <SectionHeading font={f} accent={ac} divider={tk.divider} sectionSpacing={sectionSpacing}>
          <span id="section-projects">Projects</span>
        </SectionHeading>
        {projects.map((proj, idx) => (
          <article
            key={idx}
            className="relative"
            style={{ marginBottom: paragraphSpacing, paddingLeft: "12px", borderLeft: `2px solid ${ac}20` }}
          >
            <TimelineDot active={idx === 0} />
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
              <p style={{ fontFamily: f, fontSize: "9.5px", color: ac, fontWeight: 500, margin: "2px 0 3px" }}>
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
        <SectionHeading font={f} accent={ac} divider={tk.divider} sectionSpacing={sectionSpacing}>
          <span id="section-achievements">Achievements</span>
        </SectionHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: paragraphSpacing }}>
          {achievements.map((ach, idx) => (
            <div key={idx}>
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
        </div>
      </section>
    );

  // ── Languages ─────────────────────────────────────────────────────────────
  const languages = (d.languages || []).filter((l) => l.language);
  const renderLanguages = () =>
    languages.length > 0 && (
      <section aria-labelledby="section-languages">
        <SectionHeading font={f} accent={asideAccent} divider={tk.divider} sectionSpacing={sectionSpacing}>
          <span id="section-languages">Languages</span>
        </SectionHeading>
        <ul className="m-0 list-none p-0" style={{ display: "flex", flexDirection: "column", gap: paragraphSpacing }}>
          {languages.map((l, i) => (
            <li
              key={i}
              className="flex items-center justify-between"
              style={{ fontFamily: f, fontSize: "10px", color: asideText }}
            >
              <span>{l.language}</span>
              {l.proficiency &&
                (showBadges ? (
                  <Badge
                    variant="secondary"
                    className="border-0 font-medium"
                    style={{
                      fontFamily: f,
                      fontSize: "8.5px",
                      background: `${asideAccent}18`,
                      color: asideAccent,
                      borderRadius: radius,
                      padding: "2px 6px",
                    }}
                  >
                    {l.proficiency}
                  </Badge>
                ) : (
                  <span style={{ fontFamily: f, fontSize: "8.5px", color: asideMuted }}>{l.proficiency}</span>
                ))}
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
        <SectionHeading font={f} accent={asideAccent} divider={tk.divider} sectionSpacing={sectionSpacing}>
          <span id="section-certifications">Certifications</span>
        </SectionHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: paragraphSpacing }}>
          {certs.map((cert, i) => (
            <div
              key={i}
              style={
                showBadges
                  ? { background: `${asideAccent}0f`, borderRadius: radius, padding: "6px 8px" }
                  : undefined
              }
            >
              <div style={{ fontFamily: f, fontSize: "10px", fontWeight: 600, color: asideText, lineHeight: 1.4 }}>
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: asideText }}
                    className="no-underline"
                  >
                    {cert.title}
                  </a>
                ) : (
                  cert.title
                )}
              </div>
              {cert.issuer && (
                <div style={{ fontFamily: f, fontSize: "9px", color: asideAccent, fontWeight: 500 }}>
                  {cert.issuer}
                </div>
              )}
              {cert.date && (
                <div style={{ fontFamily: f, fontSize: "8.5px", color: asideMuted }}>{cert.date}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    );

  // ── Contact list ──────────────────────────────────────────────────────────
  const contactItems: ResolvedContactItem[] = (
    [
      { icon: Mail, value: d.email, href: d.email ? `mailto:${d.email}` : undefined },
      { icon: Phone, value: d.phone, href: d.phone ? `tel:${d.phone}` : undefined },
      {
        icon: Linkedin,
        value: d.linkedin,
        href: d.linkedin ? (d.linkedin.startsWith("http") ? d.linkedin : `https://${d.linkedin}`) : undefined,
      },
      {
        icon: Github,
        value: d.github,
        href: d.github ? (d.github.startsWith("http") ? d.github : `https://github.com/${d.github}`) : undefined,
      },
    ] as ContactItem[]
  ).filter((c): c is ResolvedContactItem => Boolean(c.value));

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full overflow-hidden border border-black/5 shadow-lg">
      {/* ── Banner ────────────────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-4"
        style={{ background: bg, padding: mainPadding }}
      >
        {showAvatar && (
          <div
            style={{
              width: "80px",
              height: "80px",
              flexShrink: 0,
              borderRadius: tk.avatarShape === "square" ? radius : "50%",
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: f,
              fontSize: "18px",
              fontWeight: 700,
              color: "#fff",
              overflow: "hidden",
            }}
          >
            {photoUrl ? (
              <img src={photoUrl} alt={d.name || "Profile photo"} className="h-full w-full object-cover" />
            ) : (
              getInitials(d.name)
            )}
          </div>
        )}

        <div>
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
            <p className="mb-3 mt-1.5 text-[12px]" style={{ color: "rgba(255,255,255,0.78)", fontFamily: f }}>
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
                    {showIcons && <Icon size={10} aria-hidden="true" />}
                    <a
                      href={c.href}
                      {...(isExternal(c.href) ? { target: "_blank", rel: "noreferrer" } : {})}
                      style={{ color: "inherit", textDecoration: "none" }}
                      className="hover:underline"
                    >
                      {c.value}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </header>

      {tk.divider !== "none" && <Separator className="opacity-50" style={{ background: `${ac}20` }} />}

      {/* ── Two-column body ─────────────────────────────────────────────────── */}
      <div className="grid" style={{ gridTemplateColumns: `1fr ${sideWidth}` }}>
        {/* Left — main content (reads first in DOM: primary qualifying info) */}
        <main style={{ padding: mainPadding, borderRight: `1px solid ${ac}15` }}>
          {d.summary && (
            <div
              className={cn("rounded-md")}
              style={{
                marginBottom: sectionSpacing,
                background: tk.accentLight || `${ac}08`,
                borderLeft: `3px solid ${ac}`,
                borderRadius: radius,
                padding: "12px 16px",
              }}
            >
              <p className="m-0 text-[11px] leading-relaxed" style={{ color: "#555", fontFamily: f }}>
                {d.summary}
              </p>
            </div>
          )}

          {d.experience && d.experience.length > 0 && (
            <section aria-labelledby="section-experience">
              <SectionHeading font={f} accent={ac} divider={tk.divider} sectionSpacing="0px">
                <span id="section-experience">Experience</span>
              </SectionHeading>
              {renderExperience()}
            </section>
          )}

          {d.education && d.education.length > 0 && (
            <section aria-labelledby="section-education">
              <SectionHeading font={f} accent={ac} divider={tk.divider} sectionSpacing={sectionSpacing}>
                <span id="section-education">Education</span>
              </SectionHeading>
              {renderEducation()}
            </section>
          )}

          {renderProjects()}
          {renderAchievements()}
        </main>

        {/* Right — sidebar (skills / languages / certifications / contact) */}
        <aside
          style={{ padding: mainPadding, background: asideBg }}
          aria-label="Skills and contact details"
        >
          {skills.length > 0 && (
            <section aria-labelledby="section-skills">
              <SectionHeading font={f} accent={asideAccent} divider={tk.divider} sectionSpacing="0px">
                <span id="section-skills">Skills</span>
              </SectionHeading>
              {renderSkills()}
            </section>
          )}

          {renderLanguages()}
          {renderCertifications()}

          {contactItems.length > 0 && (
            <section aria-labelledby="section-contact">
              <SectionHeading font={f} accent={asideAccent} divider={tk.divider} sectionSpacing={sectionSpacing}>
                <span id="section-contact">Contact</span>
              </SectionHeading>
              <address className="not-italic">
                <ul className="m-0 list-none p-0" style={{ display: "flex", flexDirection: "column", gap: paragraphSpacing }}>
                  {contactItems.map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <li
                        key={i}
                        className="flex gap-1.5 break-all text-[9.5px]"
                        style={{ fontFamily: f, color: asideMuted }}
                      >
                        {showIcons && <Icon size={10} aria-hidden="true" className="mt-[1px] shrink-0" />}
                        <a
                          href={c.href}
                          {...(isExternal(c.href) ? { target: "_blank", rel: "noreferrer" } : {})}
                          title={c.href}
                          style={{ color: "inherit" }}
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
