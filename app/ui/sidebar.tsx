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
    <aside className="hidden sm:block w-56 h-screen bg-sub-background p-8 border-r border-text-300 overflow-y-auto">
      <Filter value={value} onChange={onChange} />
    </aside>
  );
}
