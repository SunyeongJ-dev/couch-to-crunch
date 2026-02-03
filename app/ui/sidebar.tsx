import Filter from "./filter";

export default function Sidebar() {
  return (
    <aside className="hidden sm:block w-56 h-screen bg-background p-4 border-r border-text-300 overflow-y-auto">
      <Filter />
    </aside>
  );
}
