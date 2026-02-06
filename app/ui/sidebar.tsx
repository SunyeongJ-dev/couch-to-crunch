import Filter from "./filter";

type FilterState = {
  selectedTags: string[];
};

export default function SideBar({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <aside
      className="
        hidden sm:block
        fixed left-0
        top-16 bottom-0
        w-56
        bg-sub-background
        border-r border-text-300
        overflow-y-auto
        px-8 py-6
      "
    >
      <Filter value={value} onChange={onChange} />
    </aside>
  );
}
