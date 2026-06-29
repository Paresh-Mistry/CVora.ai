import * as React from "react";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

import { cn } from "../lib/utils";

interface DesignTokens {
  displayFont?: string;
  bodyFont?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  headerStyle?: "default" | "centered" | "split";
  headerAlignment?: "left" | "center" | "right";
  headerBackground?: string;
  headerTextColor?: string;
  sectionTitleStyle?: "uppercase" | "none";
  sectionTitleColor?: string;
  sectionTitleSize?: string;
  sectionDivider?: "none" | "underline" | "leftbar" | "band";
  nameSize?: string;
  titleSize?: string;
  bodySize?: string;
  nameWeight?: number;
  headingWeight?: number;
  bodyWeight?: number;
  lineHeight?: number;
  pagePadding?: string;
  sectionGap?: string;
  itemGap?: string;
  skillStyle?: "pill" | "tag" | "bar";
  skillColor?: string;
  skillBackground?: string;
  showIcons?: boolean;
  cardStyle?: "flat" | "elevated" | "bordered";
  cardRadius?: string;
  atsMode?: boolean;
}

interface Props {
  d: any;
  tk: DesignTokens;
}

function normalizeBullets(bullets: unknown): string[] {
  if (Array.isArray(bullets)) return bullets;
  if (typeof bullets === "string") {
    return bullets
      .split(/\n|•|◦|▪/)
      .map((b) => b.trim())
      .filter(Boolean);
  }
  return [];
}

function hasContent(arr: any[] | undefined, key?: string): boolean {
  if (!Array.isArray(arr)) return false;
  if (!key) return arr.filter(Boolean).length > 0;
  return arr.some((item) => typeof item?.[key] === "string" && item[key].trim().length > 0);
}

export default function LayoutStack({ d = {}, tk = {} }: Props) {
  // ── Resolve tokens with fallbacks ────────────────────────────────────────
  const ats = tk.atsMode ?? false;

  const bodyFont = tk.bodyFont || "Inter, ui-sans-serif, sans-serif";
  const displayFont = tk.displayFont || bodyFont;

  const accent = ats ? "#111827" : tk.primaryColor || "#2563eb";
  const secondary = ats ? "#374151" : tk.secondaryColor || "#1e293b";
  const textColor = ats ? "#111827" : tk.textColor || "#111827";
  const mutedColor = ats ? "#4b5563" : tk.mutedTextColor || "#6b7280";
  const borderColor = ats ? "#d1d5db" : tk.borderColor || "#e5e7eb";
  const pageBg = tk.backgroundColor || "#ffffff";

  const headerBg = ats ? "transparent" : tk.headerBackground;
  const headerTextColor = headerBg ? tk.headerTextColor || "#ffffff" : accent;
  const headerAlignment = tk.headerAlignment || "left";

  const sectionTitleColor = ats ? textColor : tk.sectionTitleColor || accent;
  const sectionTitleSize = tk.sectionTitleSize || "11px";
  const sectionTitleUppercase = (tk.sectionTitleStyle || "uppercase") === "uppercase";
  const divider = ats ? "underline" : tk.sectionDivider || "underline";

  const nameSize = tk.nameSize || "34px";
  const titleSize = tk.titleSize || "13px";
  const bodySize = tk.bodySize || "13px";

  const nameWeight = tk.nameWeight ?? 800;
  const headingWeight = tk.headingWeight ?? 700;
  const bodyWeight = tk.bodyWeight ?? 400;
  const lineHeight = tk.lineHeight ?? 1.6;

  const pagePadding = tk.pagePadding || "32px 36px";
  const sectionGap = tk.sectionGap || "px";
  const itemGap = tk.itemGap || "10px";

  const showIcons = tk.showIcons ?? true;

  const skillColor = ats ? textColor : tk.skillColor || accent;
  const skillTrackColor = tk.skillBackground || "#eef0f3";

  const cardStyle = tk.cardStyle || "elevated";
  const cardRadius = tk.cardRadius || "10px";

  const bodyTextStyle: React.CSSProperties = {
    fontFamily: bodyFont,
    fontSize: bodySize,
    fontWeight: bodyWeight,
    lineHeight,
    paddingInline:"8px",
    color: mutedColor,
  };

  // ── Section title (handles all divider variants + empty-state hiding) ───
  const SectionTitle = ({ children }: { children: React.ReactNode }) => {
    const titleTextStyle: React.CSSProperties = {
      fontFamily: bodyFont,
      fontSize: sectionTitleSize,
      fontWeight: headingWeight,
      textTransform: sectionTitleUppercase ? "uppercase" : "none",
      letterSpacing: sectionTitleUppercase ? "1.8px" : "0",
      color: sectionTitleColor,
    };

    if (divider === "band") {
      return (
        <div
          className="mb-2 inline-block rounded px-3 py-1 text-white"
          style={{ ...titleTextStyle, color: "#fff", backgroundColor: accent, borderRadius: "6px" }}
        >
          {children}
        </div>
      );
    }

    if (divider === "leftbar") {
      return (
        <h2 className="mb-2 border-l-[3px] pl-2.5" style={{ ...titleTextStyle, borderColor: accent }}>
          {children}
        </h2>
      );
    }

    if (divider === "none") {
      return <h2 className="mb-2" style={titleTextStyle}>{children}</h2>;
    }

    // underline (default)
    return (
      <h2 className="mb-2 flex items-center gap-2.5" style={titleTextStyle}>
        <span className="whitespace-nowrap">{children}</span>
        <span aria-hidden="true" className="h-px flex-1" style={{ background: `${accent}30` }} />
      </h2>
    );
  };

  const Section = ({
    title,
    show,
    children,
  }: {
    title: string;
    show: boolean;
    children: React.ReactNode;
  }) => {
    if (!show) return null;
    return (
      <section style={{ marginBottom: sectionGap }}>
        <SectionTitle>{title}</SectionTitle>
        {children}
      </section>
    );
  };

  // ── Header ────────────────────────────────────────────────────────────────
  const contactLine = [d.email, d.phone, d.linkedin, d.github].filter(Boolean);

  const contactIcon = (idx: number) => {
    if (!showIcons) return null;
    const icons = [Mail, Phone, Linkedin, Github];
    const Icon = icons[idx] || Mail;
    return <Icon size={11} aria-hidden="true" className="shrink-0" />;
  };

  const renderHeader = () => {
    // const headerWrapStyle: React.CSSProperties = headerBg
    //   ? { background: headerBg, color: headerTextColor, padding: pagePadding, margin: `-${pagePadding} -${pagePadding} ${sectionGap} -${pagePadding}` }
    //   : { borderBottom: `2px solid ${accent}`, paddingBottom: "10px", marginBottom: sectionGap };

    const nameStyle: React.CSSProperties = {
      fontFamily: displayFont,
      fontWeight: nameWeight,
      fontSize: nameSize,
      color: headerBg ? headerTextColor : accent,
      letterSpacing: "-0.5px",
      lineHeight: 1,
    };

    const domainStyle: React.CSSProperties = {
      fontFamily: bodyFont,
      fontSize: bodySize,
      color: headerBg ? `${headerTextColor}cc` : mutedColor,
      marginTop: "6px",
    };

    const metaStyle: React.CSSProperties = {
      fontFamily: bodyFont,
      fontSize: "11.5px",
      color: headerBg ? `${headerTextColor}b3` : mutedColor,
    };

    if (tk.headerStyle === "centered") {
      return (
        <div className="text-center">
          <h1 style={nameStyle}>{d.name}</h1>
          {d.domain && <p style={domainStyle}>{d.domain}</p>}
          {contactLine.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {contactLine.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5" style={metaStyle}>
                  {contactIcon(i)}
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (tk.headerStyle === "split") {
      return (
        <div className="flex items-end justify-between">
          <div>
            <h1 style={nameStyle}>{d.name}</h1>
            {d.domain && <p style={domainStyle}>{d.domain}</p>}
          </div>
          {contactLine.length > 0 && (
            <div className="text-right">
              {contactLine.map((item, i) => (
                <div key={i} className="flex items-center justify-end gap-1.5" style={{ ...metaStyle, marginBottom: "2px" }}>
                  {item}
                  {contactIcon(i)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // default — respects headerAlignment
    const justify =
      headerAlignment === "center" ? "center" : headerAlignment === "right" ? "flex-end" : "flex-start";
    const textAlign = headerAlignment as React.CSSProperties["textAlign"];

    return (
      <div style={{ textAlign }}>
        <h1 style={nameStyle}>{d.name}</h1>
        {d.domain && <span style={domainStyle}>{d.domain}</span>}
        <div className="mt-2 flex flex-wrap items-center gap-3" style={{ justifyContent: justify }}>
          {contactLine.length > 0 && (
            <span className="flex flex-wrap items-center gap-3" style={metaStyle}>
              {contactLine.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {contactIcon(i)}
                  {item}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
    );
  };

  // ── Skills ────────────────────────────────────────────────────────────────
  const skills: string[] = (d.skill || d.skills || []).filter(Boolean);

  const renderSkills = () => {
    if (tk.skillStyle === "tag") {
      return (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="rounded border px-3 py-1"
              style={{ fontFamily: bodyFont, fontSize: "11.5px", borderColor: skillColor, color: skillColor }}
            >
              {skill}
            </span>
          ))}
        </div>
      );
    }

    if (tk.skillStyle === "bar") {
      return (
        <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-3 p-0">
          {skills.map((skill, i) => (
            <li key={i}>
              <div style={{ fontFamily: bodyFont, fontSize: "11.5px", color: textColor, marginBottom: "4px" }}>
                {skill}
              </div>
              <div
                aria-hidden="true"
                style={{ height: "4px", background: skillTrackColor, borderRadius: "3px", overflow: "hidden" }}
              >
                <div
                  style={{
                    height: "4px",
                    borderRadius: "3px",
                    background: skillColor,
                    width: `${60 + ((i * 13) % 40)}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      );
    }

    // pill (default) — modern soft chip
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="rounded-full px-3.5 py-1.5 font-medium"
            style={{
              fontFamily: bodyFont,
              fontSize: "11.5px",
              backgroundColor: ats ? "#f3f4f6" : `${skillColor}16`,
              color: skillColor,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  // ── Experience ────────────────────────────────────────────────────────────
  const experience = d.experience || [];
  const renderExperience = () => (
    <div className="flex flex-col" style={{ gap: itemGap }}>
      {experience.map((exp: any, idx: number) => {
        const bullets = normalizeBullets(exp.description);
        const rawIsString = typeof exp.description === "string";

        return (
          <div key={exp.id ?? idx}>
            <div className="flex items-start justify-between gap-3">
              <h3 style={{ fontFamily: displayFont, fontWeight: headingWeight, fontSize: "14.5px", color: textColor }}>
                {exp.role}
              </h3>
              {exp.duration && (
                <span className="whitespace-nowrap" style={{ fontFamily: bodyFont, fontSize: "11px", color: mutedColor }}>
                  {exp.duration}
                </span>
              )}
            </div>

            {exp.company && (
              <div
                className="mt-0.5 mb-1.5 font-medium"
                style={{ fontFamily: bodyFont, fontSize: "12.5px", color: ats ? secondary : accent }}
              >
                {exp.company}
              </div>
            )}

            {bullets.length > 0 ? (
              <ul className="list-disc space-y-1 pl-4">
                {bullets.map((bullet, i) => (
                  <li key={i} style={bodyTextStyle}>
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : rawIsString ? (
              <p style={bodyTextStyle}>{exp.description}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );

  // ── Education ─────────────────────────────────────────────────────────────
  const education = d.education || [];
  const renderEducation = () => (
    <div className="flex flex-col" style={{ gap: itemGap }}>
      {education.map((edu: any, idx: number) => (
        <div key={edu.id ?? idx} className="flex items-start justify-between gap-3">
          <div>
            <div style={{ fontFamily: displayFont, fontWeight: headingWeight, fontSize: "13.5px", color: textColor }}>
              {edu.degree}
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: "12px", color: mutedColor, marginTop: "1px" }}>
              {edu.institute}
            </div>
            {edu.grade && (
              <div style={{ fontFamily: bodyFont, fontSize: "11.5px", color: mutedColor, marginTop: "1px" }}>
                Grade: {edu.grade}
              </div>
            )}
          </div>
          {edu.year && (
            <span className="whitespace-nowrap" style={{ fontFamily: bodyFont, fontSize: "11px", color: mutedColor }}>
              {edu.year}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  // ── Projects ──────────────────────────────────────────────────────────────
  const projects = (d.projects || []).filter((p: any) => p?.project_title);
  const renderProjects = () => (
    <div className="flex flex-col" style={{ gap: itemGap }}>
      {projects.map((proj: any, idx: number) => (
        <div key={proj.id ?? idx}>
          <div className="flex items-center justify-between gap-3">
            <h3 style={{ fontFamily: displayFont, fontWeight: headingWeight, fontSize: "14px", color: textColor }}>
              {proj.project_title}
            </h3>
            {proj.link && (
              <a
                href={proj.link}
                target="_blank"
                rel="noreferrer"
                className="whitespace-nowrap no-underline"
                style={{ fontFamily: bodyFont, fontSize: "11px", color: ats ? secondary : accent }}
              >
                ↗ link
              </a>
            )}
          </div>
          {proj.tech_stack && (
            <p
              className="font-medium"
              style={{ fontFamily: bodyFont, fontSize: "11.5px", color: ats ? secondary : accent, margin: "3px 0 4px" }}
            >
              {proj.tech_stack}
            </p>
          )}
          {proj.description && <p style={bodyTextStyle}>{proj.description}</p>}
        </div>
      ))}
    </div>
  );

  // ── Empty-state flags ─────────────────────────────────────────────────────
  const hasSummary = Boolean(d.summary?.trim?.());
  const hasExperience = hasContent(experience, "role");
  const hasEducation = hasContent(education, "degree");
  const hasProjects = projects.length > 0;
  const hasSkills = skills.length > 0;

  return (
    <div
      className="w-full"
      style={{
        padding: pagePadding,
        fontFamily: bodyFont,
        background: pageBg,
        color: textColor,
      }}
    >
      {renderHeader()}

      <Section title="Summary" show={hasSummary}>
        <div
          className={cn(
            cardStyle === "elevated" && "shadow-sm",
            cardStyle === "bordered" && "border"
          )}
          style={{
            borderRadius: cardRadius,
            padding: cardStyle === "flat" ? 0 : "10px 14px",
            background: ats || cardStyle === "flat" ? "transparent" : cardStyle === "elevated" ? `${accent}06` : pageBg,
            borderColor: cardStyle === "bordered" ? borderColor : undefined,
            borderLeft: cardStyle === "flat" ? `3px solid ${accent}` : undefined,
            paddingLeft: cardStyle === "flat" ? "12px" : undefined,
          }}
        >
          <p style={bodyTextStyle}>{d.summary}</p>
        </div>
      </Section>

      <Section title="Experience" show={hasExperience}>
        {renderExperience()}
      </Section>

      <Section title="Education" show={hasEducation}>
        {renderEducation()}
      </Section>

      <Section title="Projects" show={hasProjects}>
        {renderProjects()}
      </Section>

      <Section title="Skills" show={hasSkills}>
        {renderSkills()}
      </Section>
    </div>
  );
}