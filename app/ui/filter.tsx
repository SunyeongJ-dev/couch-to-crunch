import type {
  LevelOption,
  TypeOption,
  DurationOption,
  SortOption,
} from "../lib/types";

export type FilterState = {
  sort: SortOption;
  level?: LevelOption;
  types: TypeOption[];
  duration?: DurationOption;
};

type FilterProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
};

export default function Filter({ value, onChange }: FilterProps) {
  const typeOptions: { label: string; value: TypeOption }[] = [
    { label: "Cardio", value: "cardio" },
    { label: "Strength", value: "strength" },
    { label: "HIIT", value: "hiit" },
    { label: "Yoga", value: "yoga" },
    { label: "Stretching", value: "stretching" },
    { label: "Walking", value: "walking" },
  ];
  const durationOptions: { label: string; value: DurationOption }[] = [
    { label: "Under 20 min", value: "<20min" },
    { label: "20-30 min", value: "20-30min" },
    { label: "30-45 min", value: "30-45min" },
    { label: "45+ min", value: "45+min" },
  ];
  const setSort = (sort: SortOption) => {
    onChange({ ...value, sort });
  };

  const toggleLevel = (level: LevelOption) => {
    onChange({ ...value, level: value.level === level ? undefined : level });
  };

  const toggleType = (type: TypeOption) => {
    const has = value.types.includes(type);
    onChange({
      ...value,
      types: has
        ? value.types.filter((t) => t !== type)
        : [...value.types, type],
    });
  };

  const toggleDuration = (duration: DurationOption) => {
    onChange({
      ...value,
      duration: value.duration === duration ? undefined : duration,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 hidden sm:block">Filters</h2>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Sort By</h3>
        <ul>
          {[
            { label: "Newest", value: "newest" },
            { label: "Most Viewed", value: "most_viewed" },
          ].map((sort) => (
            <li
              key={sort.value}
              className={`select-none cursor-pointer px-2 rounded ${
                value.sort === sort.value ? "bg-accent text-white" : ""
              }`}
              onClick={() => setSort(sort.value as SortOption)}
            >
              {sort.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Level</h3>
        <ul>
          {["beginner", "intermediate", "advanced"].map((level) => (
            <li
              key={level}
              className={`select-none cursor-pointer px-2 rounded ${
                value.level === level.toLowerCase()
                  ? "bg-accent text-white"
                  : ""
              }`}
              onClick={() => toggleLevel(level.toLowerCase() as LevelOption)}
            >
              {level[0].toUpperCase() + level.slice(1)}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Type</h3>
        <ul>
          {typeOptions.map((type) => (
            <li
              key={type.value}
              className={`select-none cursor-pointer px-2 rounded ${
                value.types.includes(type.value) ? "bg-accent text-white " : ""
              }`}
              onClick={() => toggleType(type.value)}
            >
              {type.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-l font-bold mb-1">Duration</h3>
        <ul>
          {durationOptions.map((duration) => (
            <li
              key={duration.value}
              className={`select-none cursor-pointer px-2 rounded ${
                value.duration === duration.value ? "bg-accent text-white" : ""
              }`}
              onClick={() => toggleDuration(duration.value)}
            >
              {duration.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
