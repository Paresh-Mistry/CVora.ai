import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";

interface SkillSelectorProps {
  value: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillSelector({
  value,
  onChange,
}: SkillSelectorProps) {
  const [query, setQuery] = useState("");
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    fetch("/skills.json")
      .then((res) => res.json())
      .then((data) => setAllSkills(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }

    const results = allSkills
      .filter(
        (skill) =>
          skill.toLowerCase().includes(query.toLowerCase()) &&
          !value.includes(skill)
      )
      .slice(0, 10);

    setFiltered(results);
  }, [query, allSkills, value]);

  const addSkill = (skill: string) => {
    if (!value.includes(skill)) {
      onChange([...value, skill]);
    }
    setQuery("");
    setFiltered([]);
  };

  const removeSkill = (skill: string) => {
    onChange(value.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-3">
      {/* Search Box */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills..."
          className="w-full rounded-lg border pl-10 pr-3 py-2 text-sm"
        />

        {filtered.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border bg-white shadow-lg max-h-60 overflow-y-auto">
            {filtered.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Skill */}
      {query.trim() &&
        !allSkills.some(
          (s) => s.toLowerCase() === query.toLowerCase()
        ) && (
          <button
            type="button"
            onClick={() => addSkill(query)}
            className="text-sm text-blue-600 hover:underline"
          >
            Add "{query}" as custom skill
          </button>
        )}

      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
          >
            {skill}

            <button
              type="button"
              onClick={() => removeSkill(skill)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}