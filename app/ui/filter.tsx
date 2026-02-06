type FilterState = {
  selectedTags: string[];
};

type FilterProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
};

export default function Filter({ value, onChange }: FilterProps) {
  const toggleTag = (tag: string) => {
    const isSelected = value.selectedTags.includes(tag);
    const nextTags = isSelected
      ? value.selectedTags.filter((t) => t !== tag)
      : [...value.selectedTags, tag];
    onChange({ selectedTags: nextTags });
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Level</h3>
        <ul>
          {["beginner", "intermediate", "advanced"].map((level) => (
            <li
              key={level}
              className={`cursor-pointer ${
                value.selectedTags.includes(level.toLowerCase())
                  ? "font-bold"
                  : ""
              }`}
              onClick={() => toggleTag(level.toLowerCase())}
            >
              {level}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Type</h3>
        <ul>
          {["cardio", "strength", "flexibility", "hiit", "yoga"].map((type) => (
            <li
              key={type}
              className={`cursor-pointer ${
                value.selectedTags.includes(type.toLowerCase())
                  ? "font-bold"
                  : ""
              }`}
              onClick={() => toggleTag(type.toLowerCase())}
            >
              {type}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Duration</h3>
        <ul>
          {["<20min", "20-30min", "30-60min", "60+min"].map((duration) => (
            <li
              key={duration}
              className={`cursor-pointer ${
                value.selectedTags.includes(duration.toLowerCase())
                  ? "font-bold"
                  : ""
              }`}
              onClick={() => toggleTag(duration.toLowerCase())}
            >
              {duration}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Equipment</h3>
        <ul>
          {[
            "no-equipment",
            "dumbbells",
            "resistance-bands",
            "kettlebells",
            "barbell",
          ].map((equip) => (
            <li
              key={equip}
              className={`cursor-pointer ${
                value.selectedTags.includes(equip.toLowerCase())
                  ? "font-bold"
                  : ""
              }`}
              onClick={() => toggleTag(equip.toLowerCase())}
            >
              {equip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
