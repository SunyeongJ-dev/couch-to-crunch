import Filter from "./filter";
import { FilterState } from "../ui/filter";

export default function SideBar({
  value,
  onChange,
  onReset,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}) {
  return (
    <>
      <div className="sm:hidden fixed top-16 left-0 right-0 z-50 w-full border-b border-text-300 bg-sub-background px-6 py-3">
        <details className="group">
          <summary className="cursor-pointer select-none font-semibold border-b border-text-300">
            Filters
          </summary>
          <div className="fixed inset-0 top-16 z-40 hidden" />
          <div className="relative z-50 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar pt-4 pb-6 px-4">
            <Filter value={value} onChange={onChange} />
            <button
              className="w-full text-sm text-sub-background bg-primary hover:bg-secondary transition duration-300 px-3 py-1 rounded-md font-medium cursor-pointer"
              onClick={onReset}
            >
              Reset
            </button>
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
        <button
          className="mt-2 text-sm text-sub-background bg-primary hover:bg-secondary transition duration-300 px-3 py-1 rounded-md font-medium cursor-pointer"
          onClick={onReset}
        >
          Reset
        </button>
      </aside>
    </>
  );
}
