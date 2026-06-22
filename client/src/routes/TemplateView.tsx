import { useState } from "react";
import Layout from "../Layout/PageLayout";
import MiniResumeThumbnail from "../components/common/MiniResumeThumbnail";
import { useNavigate } from "react-router-dom";
import { Crown, Search } from "lucide-react";
import { useTemplates } from "../hooks/useAI";

type LayoutKey = "A" | "B" | "C";

const layoutNames: Record<LayoutKey, string> = { A: "Stack", B: "Sidebar", C: "Banner" };
const layoutColors: Record<LayoutKey, string> = { A: "#7c3aed", B: "#0369a1", C: "#0f4c35" };
const layoutDescs: Record<LayoutKey, string> = {
  A: "Single column, top to bottom",
  B: "Left sidebar + main content",
  C: "Bold top banner + 2 columns",
};

const Generate: React.FC = () => {
  const [selected, setSelected] = useState("t4");
  const [filterLayout, setFilterLayout] = useState<LayoutKey | "all">("all");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {
    data: templates
  } = useTemplates()

  const filtered = templates?.filter((t) => {
    const layoutMatch =
      filterLayout === "all" ||
      t.layout === filterLayout;

    const searchMatch =
      t.name.toLowerCase().includes(search.toLowerCase());

    return layoutMatch && searchMatch;
  });

  return (
    <Layout>
      <section className="container max-w-7xl mx-auto py-14 px-4">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#212834] leading-tight">
              Find Your
              <span className="ml-2 bg-gradient-to-r from-[#11a8e4] to-[#63c5ea] bg-clip-text text-transparent mozilla-headline-hero">
                Resume&apos;s
              </span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base font-serif">
              Choose from a variety of elegant, modern, and professional templates.
            </p>
          </div>
        </div>


        <div className="flex flex-col lg:flex-row gap-6">

          <div className="lg:w-[280px] shrink-0 max-h-[80vh] overflow-y-auto">
            <div className="px-4 pt-[14px] pb-[10px] border border-[#e5e7eb]">
              <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-[0.8px] mb-[10px]">
                Base layouts
              </div>


              <div className="flex flex-col gap-3">
                {(["A", "B", "C"] as LayoutKey[]).map((l) => (
                  <div
                    key={l}
                    onClick={() =>
                      setFilterLayout(filterLayout === l ? "all" : l)
                    }
                    className="flex items-center gap-[10px] px-[10px] py-[7px] rounded-[7px] cursor-pointer"
                    style={{
                      background:
                        filterLayout === l
                          ? `${layoutColors[l]}10`
                          : "transparent",
                      border:
                        filterLayout === l
                          ? `1px solid ${layoutColors[l]}30`
                          : "1px solid transparent",
                    }}
                  >
                    <div
                      className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{
                        background: layoutColors[l],
                      }}
                    >
                      {l}
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-[#111]">
                        {layoutNames[l]} layout
                      </div>

                      <div className="text-[10px] text-[#9ca3af]">
                        {layoutDescs[l]}
                      </div>
                    </div>
                  </div>
                ))}

                {filterLayout !== "all" && (
                  <button
                    onClick={() => setFilterLayout("all")}
                    className="text-[10px] text-[#6b7280] bg-transparent text-left px-[10px] py-[2px] cursor-pointer"
                  >
                    ← Show all layouts
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Template grid */}
          <div className="flex-1 md:px-4">
            <div className="flex md:flex-row flex-col justify-between items-center text-[10px] font-bold text-[#9ca3af] uppercase tracking-[0.8px] mb-[10px]">
              {filterLayout === "all"
                ? "All templates"
                : `${layoutNames[filterLayout]} variants`}{" "}
              ({filtered?.length})

              <div className="relative w-full md:w-80 md:mt-0 mt-3">
                {/* The Icon */}
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />

                {/* The Input */}
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full border-b border-gray-200 pl-6 pr-4 py-2 outline-none text-gray-700 placeholder-gray-400 focus:border-gray-400 transition-colors"
                />
              </div>

            </div>


            <div className="
              grid
              grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              md:gap-4 gap-2
              ">
              {filtered?.map((tmpl) => (
                <button
                  key={tmpl.id}
                  // disabled={tmpl.is_premium == true ? true : false}
                  onClick={() => {
                    setSelected(tmpl.id);
                    navigate(`/template/${tmpl.id}/resume`);
                  }} className="p-1.5 rounded-[10px] text-left cursor-pointer outline-none transition-all"
                  style={{
                    border:
                      selected === tmpl.id
                        ? `2px solid ${tmpl.tokens.accent}`
                        : "2px solid #e5e7eb",
                    background:
                      selected === tmpl.id
                        ? `${tmpl.tokens.accent}06`
                        : "#fafafa",
                    boxShadow:
                      selected === tmpl.id
                        ? `0 0 0 3px ${tmpl.tokens.accent}18`
                        : "none",
                  }}
                >
                  <div className="relative rounded overflow-hidden border border-[#e5e7eb] bg-white mb-[7px]">
                    {/* Create a premium tags or logo on templates */}
                    {tmpl.is_premium && (
                      <div className="
                      absolute
                      top-2
                      right-2
                      z-20
                      bg-amber-100
                      text-amber-700
                      px-2
                      py-1
                      rounded-full
                      flex
                      items-center
                      gap-1
                      text-[10px]
                      font-semibold
                    ">
                        <Crown size={12} fill="currentColor" />
                        PRO
                      </div>
                    )}
                    <MiniResumeThumbnail
                      tmpl={tmpl}
                      scale={0.245}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div
                      className="text-[11px] font-bold"
                      style={{
                        color:
                          selected === tmpl.id
                            ? tmpl.tokens.accent
                            : "#111",
                      }}
                    >
                      {tmpl.name}
                    </div>

                    <div
                      className="text-[9px] font-bold rounded px-[5px] py-[1px]"
                      style={{
                        color: layoutColors[tmpl.layout],
                        background: `${layoutColors[tmpl.layout]}12`,
                      }}
                    >
                      {tmpl.layout}
                    </div>
                  </div>

                  <div className="text-[10px] text-[#9ca3af] mt-[1px]">
                    {tmpl.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </section>
    </Layout>
  );
};

export default Generate;



