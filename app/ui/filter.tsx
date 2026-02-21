// app/ui/filter.tsx
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
  isCollapsed?: boolean;
};

export default function Filter({ value, onChange, isCollapsed }: FilterProps) {
  // Label and value options for the filter UI.
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

  // When the sort option is changed, we update the filter state with the new sort value.
  const setSort = (sort: SortOption) => {
    onChange({ ...value, sort });
  };

  // When a level option is toggled, we check if it's already selected. If it is, we deselect it by setting it to undefined.
  const toggleLevel = (level: LevelOption) => {
    onChange({ ...value, level: value.level === level ? undefined : level });
  };

  // Variable has checks if the type is already included in the filter state.
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
    <div
      className={`transition-all duration-300 transform ${isCollapsed ? "opacity-0" : "opacity-100"}`}
    >
      <h2 className="text-xl font-bold mb-4 hidden sm:block whitespace-nowrap">
        Filters
      </h2>
      <div className="mb-4 whitespace-nowrap">
        <h3 className="text-l font-bold mb-1">Sort By</h3>
        <ul className="flex flex-col gap-0.5">
          {[
            { label: "Newest", value: "newest" },
            { label: "Most Viewed", value: "most_viewed" },
          ].map((option) => (
            <li
              key={option.value}
              className={`select-none cursor-pointer px-2 rounded ${
                value.sort === option.value ? "bg-accent text-white" : ""
              }`}
              onClick={() => setSort(option.value as SortOption)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4 whitespace-nowrap">
        <h3 className="text-l font-bold mb-1">Level</h3>
        <ul className="flex flex-col gap-0.5">
          {["beginner", "intermediate", "advanced"].map((option) => (
            <li
              key={option}
              className={`select-none cursor-pointer px-2 rounded ${
                value.level === option.toLowerCase()
                  ? "bg-accent text-white"
                  : ""
              }`}
              onClick={() => toggleLevel(option.toLowerCase() as LevelOption)}
            >
              {option[0].toUpperCase() + option.slice(1)}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4 whitespace-nowrap">
        <h3 className="text-l font-bold mb-1">Type</h3>
        <ul className="flex flex-col gap-0.5">
          {typeOptions.map((option) => (
            <li
              key={option.value}
              className={`select-none cursor-pointer px-2 rounded ${
                value.types.includes(option.value)
                  ? "bg-accent text-white "
                  : ""
              }`}
              onClick={() => toggleType(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4 whitespace-nowrap">
        <h3 className="text-l font-bold mb-1">Duration</h3>
        <ul className="flex flex-col gap-0.5">
          {durationOptions.map((option) => (
            <li
              key={option.value}
              className={`select-none cursor-pointer px-2 rounded ${
                value.duration === option.value ? "bg-accent text-white" : ""
              }`}
              onClick={() => toggleDuration(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
