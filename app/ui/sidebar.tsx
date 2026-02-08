import Filter from "./filter";
import { FilterState } from "../ui/filter";

export default function SideBar({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <>
      <div className="sm:hidden fixed top-16 left-0 right-0 z-40 w-full border-b border-text-300 bg-sub-background px-6 py-3">
        <details>
          <summary className="cursor-pointer select-none font-semibold">
            Filters
          </summary>
          <div className="pt-4 pb-2 px-4">
            <Filter value={value} onChange={onChange} />
          </div>
        </details>
      </div>

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
    </>
  );
}
