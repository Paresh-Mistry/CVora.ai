import * as React from "react";
import { Github, Linkedin, Mail, Phone, Trophy, Award, ArrowUpRight } from "lucide-react";

import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import type {
  ContactItem,
  LayoutProps,
  ResolvedContactItem,
} from "../services/resume.services";
import { cn } from "../lib/utils";

const DEFAULT_FONT = "Inter, ui-sans-serif, sans-serif";
const DEFAULT_ACCENT = "#2563eb";


function normalizeBullets(bullets: string[] | string | undefined): string[] {
  if (Array.isArray(bullets)) return bullets;
  if (typeof bullets === "string") {
    return bullets.split(/\n|•|◦|▪/).map((b) => b.trim()).filter(Boolean);
  }
  return [];
}

function getInitials(name?: string): string {
  if (!name) return "";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function isExternal(prefix: string): boolean {
  return prefix.startsWith("http");
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
        fontSize: "10px",
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

export default function LayoutStack({ d, tk = {} }: LayoutProps) {
  const f = tk.font || DEFAULT_FONT;
  const ac = tk.accent || DEFAULT_ACCENT;
  const pagePadding = "28px 32px";
  const sectionSpacing = tk.sectionSpacing || "20px";
  const paragraphSpacing = tk.paragraphSpacing || "8px";
  const radius = tk.borderRadius || "6px";
  const showIcons = tk.showIcons ?? true;
  const showProgress = tk.showProgress ?? true;
  const showBadges = tk.showBadges ?? true;
  const useTimeline = tk.timeline ?? false;
  const showAvatar = Boolean(tk.avatar);
  const hasBand = Boolean(tk.bannerBg);
  const headerBg = tk.bannerBg || "transparent";
  const headerText = hasBand ? tk.sidebarText || "#fff" : "#1a1a1a";
  const headerMuted = hasBand ? "rgba(255,255,255,0.78)" : "#666";
  const headerAccent = hasBand ? tk.sidebarAccent || "rgba(255,255,255,0.9)" : ac;

  const alignment: "left" | "centered" | "split" =
    tk.headerStyle === "centered" ? "centered" : tk.headerStyle === "split" ? "split" : "left";

  const skills = (d.skill || []).filter(Boolean);
  const photoUrl = (d as any)?.photo || (d as any)?.avatarUrl || null;

  // ── Avatar ─────────────────────────────────────────────────────────────
  const renderAvatar = () => {
    if (!showAvatar) return null;
    const isSquare = tk.avatarShape === "square";
    return (
      <div
        style={{
          width: "76px",
          height: "76px",
          flexShrink: 0,
          borderRadius: isSquare ? radius : "50%",
          background: hasBand ? "rgba(255,255,255,0.15)" : `${ac}12`,
          border: hasBand ? "2px solid rgba(255,255,255,0.35)" : `2px solid ${ac}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: f,
          fontSize: "18px",
          fontWeight: 700,
          color: hasBand ? "#fff" : ac,
          overflow: "hidden",
        }}
      >
        {photoUrl ? (
          <img src={photoUrl} alt={d.name || "Profile photo"} className="h-full w-full object-cover" />
        ) : (
          getInitials(d.name)
        )}
      </div>
    );
  };

  // ── Contact ────────────────────────────────────────────────────────────
  const contactItems: ResolvedContactItem[] = (
    [
      { icon: Mail, value: d.email, href: d.email ? `mailto:${d.email}` : undefined },
      { icon: Phone, value: d.phone, href: d.phone ? `tel:${d.phone}` : undefined },
      { icon: Linkedin, value: d.linkedin, href: d.linkedin ? (d.linkedin.startsWith("http") ? d.linkedin : `https://${d.linkedin}`) : undefined },
      { icon: Github, value: d.github, href: d.github ? (d.github.startsWith("http") ? d.github : `https://github.com/${d.github}`) : undefined },
    ] as ContactItem[]
  ).filter((c): c is ResolvedContactItem => Boolean(c.value));

  const renderContactList = (justify: "start" | "center" | "end" = "start") => (
    <ul
      className={cn(
        "m-0 flex flex-wrap list-none gap-x-5 gap-y-1.5 p-0",
        justify === "center" && "justify-center",
        justify === "end" && "justify-end"
      )}
    >
      {contactItems.map((c, i) => {
        const Icon = c.icon;
        return (
          <li
            key={i}
            className="flex items-center gap-1.5 text-[10px]"
            style={{ color: headerMuted, fontFamily: f }}
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
  );

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
                      fontSize: "9.5px",
                      background: `${ac}15`,
                      color: ac,
                      borderRadius: tk.skillStyle === "pill" ? "999px" : radius,
                      padding: "3px 9px",
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
                    fontSize: "9.5px",
                    color: ac,
                    border: `1px solid ${ac}40`,
                    borderRadius: tk.skillStyle === "pill" ? "999px" : radius,
                    padding: "3px 9px",
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
          <ul className="m-0 grid grid-cols-2 list-none gap-x-4 gap-y-1 p-0">
            {skills.map((s, i) => (
              <li key={i} style={{ fontFamily: f, fontSize: "10.5px", color: "#444" }}>
                {showIcons && (
                  <span aria-hidden="true" style={{ color: ac, marginRight: "5px" }}>
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
          <ul className="m-0 grid grid-cols-3 list-none gap-1.5 p-0">
            {skills.map((s, i) => (
              <li
                key={i}
                className="truncate text-center"
                style={{
                  fontFamily: f,
                  fontSize: "9.5px",
                  color: showBadges ? ac : "#444",
                  background: showBadges ? `${ac}15` : "transparent",
                  border: showBadges ? "none" : `1px solid ${ac}40`,
                  borderRadius: radius,
                  padding: "5px 6px",
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
          <ul className="m-0 grid grid-cols-2 list-none gap-x-6 gap-y-2 p-0">
            {skills.map((s, i) => (
              <li key={i}>
                <div style={{ fontFamily: f, fontSize: "10px", color: "#444", marginBottom: "3px" }}>{s}</div>
                {showProgress && (
                  <div
                    aria-hidden="true"
                    style={{ height: "3px", background: "#eee", borderRadius: radius, overflow: "hidden" }}
                  >
                    <div
                      style={{
                        height: "3px",
                        borderRadius: radius,
                        background: ac,
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

  // ── Timeline marker ───────────────────────────────────────────────────────
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
          style={{ marginBottom: paragraphSpacing, paddingLeft: "14px", borderLeft: `2px solid ${ac}20` }}
        >
          <TimelineDot active={idx === 0} />
          <div className="flex items-start justify-between gap-2">
            <h3 style={{ fontFamily: f, fontWeight: 700, fontSize: "12px", color: "#1a1a1a", margin: 0 }}>
              {exp.role}
            </h3>
            {exp.duration && (
              <span className="whitespace-nowrap" style={{ fontFamily: f, fontSize: "9.5px", color: "#888" }}>
                {exp.duration}
              </span>
            )}
          </div>
          {exp.company && (
            <p style={{ fontFamily: f, fontSize: "10.5px", color: ac, fontWeight: 600, margin: "1px 0 4px" }}>
              {exp.company}
            </p>
          )}
          {bullets.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "14px", lineHeight: 1.5 }}>
              {bullets.map((bullet, i) => (
                <li key={i} style={{ fontFamily: f, fontSize: "10px", color: "#444", marginBottom: "2px" }}>
                  {bullet}
                </li>
              ))}
            </ul>
          ) : rawBulletsIsString ? (
            <p style={{ fontFamily: f, fontSize: "10px", color: "#444", margin: 0, lineHeight: 1.5 }}>
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
        style={{ marginBottom: paragraphSpacing, paddingLeft: "14px", borderLeft: `2px solid ${ac}20` }}
      >
        <TimelineDot active={idx === 0} />
        <h3 style={{ fontFamily: f, fontWeight: 700, fontSize: "12px", color: "#1a1a1a", margin: 0 }}>
          {edu.degree || "—"}
        </h3>
        <p style={{ fontFamily: f, fontSize: "10.5px", color: "#666", margin: "1px 0 0" }}>
          {[edu.institute, edu.year].filter(Boolean).join(" · ")}
        </p>
        {edu.grade && (
          <p style={{ fontFamily: f, fontSize: "10px", color: "#888", margin: "1px 0 0" }}>Grade: {edu.grade}</p>
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
            style={{ marginBottom: paragraphSpacing, paddingLeft: "14px", borderLeft: `2px solid ${ac}20` }}
          >
            <TimelineDot active={idx === 0} />
            <div className="flex items-center justify-between gap-2">
              <h3 style={{ fontFamily: f, fontWeight: 700, fontSize: "12px", color: "#1a1a1a", margin: 0 }}>
                {proj.project_title}
              </h3>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap no-underline flex items-center gap-1"
                  style={{ fontFamily: f, fontSize: "9.5px", color: ac }}
                >
                  Link <ArrowUpRight size={10} />
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
        <div className="grid grid-cols-2 gap-x-6" style={{ rowGap: paragraphSpacing }}>
          {achievements.map((ach, idx) => (
            <div key={idx} className="flex items-start gap-2">
              {showIcons && (
                <span aria-hidden="true" style={{ color: ac, marginTop: "2px", flexShrink: 0 }}>
                  <Trophy size={11} />
                </span>
              )}
              <div>
                <h3 style={{ fontFamily: f, fontWeight: 600, fontSize: "11px", color: "#1a1a1a", margin: 0 }}>
                  {ach.title}
                </h3>
                {ach.description && (
                  <p style={{ fontFamily: f, fontSize: "10px", color: "#555", margin: "2px 0 0", lineHeight: 1.5 }}>
                    {ach.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );

  // ── Certifications ───────────────────────────────────────────────────────
  const certs = (d.certifications || []).filter((c) => c.title);
  const renderCertifications = () =>
    certs.length > 0 && (
      <section aria-labelledby="section-certifications">
        <SectionHeading font={f} accent={ac} divider={tk.divider} sectionSpacing={sectionSpacing}>
          <span id="section-certifications">Certifications</span>
        </SectionHeading>
        <div className="grid grid-cols-2 gap-2">
          {certs.map((cert, i) => (
            <div
              key={i}
              style={showBadges ? { background: `${ac}08`, borderRadius: radius, padding: "8px 10px" } : undefined}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {showIcons && (
                    <span aria-hidden="true" style={{ color: ac, flexShrink: 0 }}>
                      <Award size={11} />
                    </span>
                  )}
                  <span style={{ fontFamily: f, fontSize: "10.5px", fontWeight: 600, color: "#1a1a1a" }}>
                    {cert.title}
                  </span>
                </div>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[9.5px]"
                    style={{ color: ac }}
                  >
                    View <ArrowUpRight size={9} />
                  </a>
                )}
              </div>
              {(cert.issuer || cert.date) && (
                <p style={{ fontFamily: f, fontSize: "9.5px", color: "#888", margin: "3px 0 0" }}>
                  {[cert.issuer, cert.date].filter(Boolean).join(" · ")}
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
        <SectionHeading font={f} accent={ac} divider={tk.divider} sectionSpacing={sectionSpacing}>
          <span id="section-languages">Languages</span>
        </SectionHeading>
        <ul className="m-0 flex flex-wrap list-none gap-x-6 gap-y-1.5 p-0">
          {languages.map((l, i) => (
            <li key={i} className="flex items-center gap-2 text-[10.5px]" style={{ fontFamily: f, color: "#444" }}>
              <span>{l.language}</span>
              {l.proficiency &&
                (showBadges ? (
                  <Badge
                    variant="secondary"
                    className="border-0 font-medium"
                    style={{
                      fontFamily: f,
                      fontSize: "8.5px",
                      background: `${ac}12`,
                      color: ac,
                      borderRadius: radius,
                      padding: "2px 6px",
                    }}
                  >
                    {l.proficiency}
                  </Badge>
                ) : (
                  <span style={{ fontSize: "9px", color: "#999" }}>({l.proficiency})</span>
                ))}
            </li>
          ))}
        </ul>
      </section>
    );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full overflow-hidden border border-black/5 shadow-lg" style={{ background: "#fff" }}>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header style={{ background: headerBg, padding: pagePadding }}>
        <div
          className={cn(
            "flex gap-4",
            alignment === "centered" && "flex-col items-center text-center",
            alignment === "split" && "items-center justify-between",
            alignment === "left" && "items-center"
          )}
        >
          <div className={cn("flex items-center gap-4", alignment === "split" && "flex-1")}>
            {renderAvatar()}
            <div>
              <h1
                className="font-extrabold leading-none"
                style={{
                  fontFamily: tk.displayFont || f,
                  fontSize: tk.nameSize || "26px",
                  color: headerText,
                  letterSpacing: "-0.5px",
                }}
              >
                {d.name}
              </h1>
              {d.domain && (
                <p className="mb-2 mt-1.5 text-[12px]" style={{ color: headerAccent, fontFamily: f }}>
                  {d.domain}
                </p>
              )}
              {alignment !== "split" && contactItems.length > 0 && (
                <div className="mt-2">{renderContactList(alignment === "centered" ? "center" : "start")}</div>
              )}
            </div>
          </div>
          {alignment === "split" && contactItems.length > 0 && renderContactList("end")}
        </div>
      </header>

      {tk.divider !== "none" && <Separator className="opacity-50" style={{ background: `${ac}20` }} />}

      {/* ── Body (single column) ─────────────────────────────────────────── */}
      <div style={{ padding: pagePadding }}>
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

        {skills.length > 0 && (
          <section aria-labelledby="section-skills">
            <SectionHeading font={f} accent={ac} divider={tk.divider} sectionSpacing={sectionSpacing}>
              <span id="section-skills">Skills</span>
            </SectionHeading>
            {renderSkills()}
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
        {renderCertifications()}
        {renderAchievements()}
        {renderLanguages()}
      </div>
    </div>
  );
}
