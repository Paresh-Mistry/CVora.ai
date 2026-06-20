import React from "react";

interface Props {
  d: any;
  tk: any;
}

export default function LayoutStack({
  d = {},
  tk = {},
}: Props) {
  const accent = tk.accent || "#2563eb";

  const SectionTitle = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    switch (tk.divider) {
      case "underline":
        return (
          <h2
            className="mb-3 mt-6 border-b pb-1 text-xs font-bold uppercase tracking-[2px]"
            style={{ color: accent }}
          >
            {children}
          </h2>
        );

      case "leftbar":
        return (
          <h2
            className="mb-3 mt-6 border-l-4 pl-2 text-xs font-bold uppercase tracking-[2px]"
            style={{
              color: accent,
              borderColor: accent,
            }}
          >
            {children}
          </h2>
        );

      case "band":
        return (
          <div
            className="mb-3 mt-6 inline-block rounded px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-white"
            style={{
              backgroundColor: accent,
            }}
          >
            {children}
          </div>
        );

      default:
        return (
          <h2
            className="mb-3 mt-6 text-xs font-bold uppercase tracking-[2px]"
            style={{ color: accent }}
          >
            {children}
          </h2>
        );
    }
  };

  const renderHeader = () => {
    switch (tk.headerStyle) {
      case "centered":
        return (
          <div
            className="mb-4 border-b-2 pb-4 text-center"
            style={{ borderColor: accent}}
          >
            <h1
              className="font-bold leading-none"
              style={{
                color: accent,
                fontSize: tk.nameSize || "28px",
              }}
            >
              {d.name}
            </h1>

            <p className="mt-1 text-[13px] text-muted-foreground">
              {d.domain}
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              {[d.email, d.phone, d.location]
                .filter(Boolean)
                .map((item, i) => (
                  <span key={i}>{item}</span>
                ))}
            </div>
          </div>
        );

      case "split":
        return (
          <div
            className="mb-4 flex items-end justify-between border-b-2 pb-4"
            style={{ borderColor: accent }}
          >
            <div>
              <h1
                className="font-bold leading-none"
                style={{
                  color: accent,
                  fontSize: tk.nameSize || "26px",
                }}
              >
                {d.name}
              </h1>

              <p className="mt-1 text-[13px] text-muted-foreground">
                {d.domain}
              </p>
            </div>

            <div className="text-right text-xs text-muted-foreground">
              {[d.email, d.phone, d.location]
                .filter(Boolean)
                .map((item, i) => (
                  <div key={i}>{item}</div>
                ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="mb-4">
            <h1
              className="font-light leading-none tracking-tight"
              style={{
                fontSize: tk.nameSize || "36px",
                color: accent
              }}
            >
              {d.name}
            </h1>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[13px] text-muted-foreground">
                {d.domain}
              </span>

              <span className="text-xs text-muted-foreground">
                {d.linkedin} • {d.email} • {d.phone}
              </span>
            </div>

            <div className="mt-3 h-px bg-black" />
          </div>
        );
    }
  };

  const renderSkills = () => {
    const skills = d.skills || [];

    if (tk.skillStyle === "pill") {
      return (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, i: number) => (
            <span
              key={i}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${accent}20`,
                color: accent,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      );
    }

    if (tk.skillStyle === "tag") {
      return (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, i: number) => (
            <span
              key={i}
              className="rounded border px-3 py-1 text-xs"
              style={{
                borderColor: accent,
                color: accent,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      );
    }

    return (
      <p className="text-[13px] text-muted-foreground">
        {skills.join(" • ")}
      </p>
    );
  };

  return (
    <div
      className="bg-white p-2 text-[13px] text-slate-900"
      style={{
        padding: tk.padding || "40px 44px",
        fontFamily: tk.font || "Inter",
      }}
    >
      {renderHeader()}

      {d.summary && (
        <>
          <SectionTitle>Summary</SectionTitle>

          <p className=" text-slate-600">
            {d.summary}
          </p>
        </>
      )}

      <SectionTitle>Experience</SectionTitle>

      {(d.experience || []).map((exp: any) => (
        <div key={exp.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">
              {exp.title}
            </h3>

            <span className="text-xs text-muted-foreground">
              {exp.dates}
            </span>
          </div>

          <div
            className="mb-1 text-[13px] font-medium"
            style={{ color: accent }}
          >
            {exp.company}
          </div>

          <ul className="list-disc pl-4">
            {(exp.bullets || []).map(
              (bullet: string, i: number) => (
                <li
                  key={i}
                  className="text-[13px] text-slate-600"
                >
                  {bullet}
                </li>
              )
            )}
          </ul>
        </div>
      ))}

      <SectionTitle>Education</SectionTitle>

      {(d.education || []).map((edu: any) => (
        <div
          key={edu.id}
          className="flex justify-between"
        >
          <div>
            <div className="font-semibold">
              {edu.degree}
            </div>

            <div className="text-[13px] text-muted-foreground">
              {edu.school}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {edu.dates}
          </div>
        </div>
      ))}

      <SectionTitle>Skills</SectionTitle>

      {renderSkills()}
    </div>
  );
}