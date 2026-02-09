// app/ui/sidebar.tsx
import Filter from "./filter";
import { FilterState } from "../ui/filter";

// The SideBar component is responsible for rendering the filter options and handling user interactions to update the filters.
// It has two main layouts: a fixed sidebar on larger screens and a collapsible details element on smaller screens.

// The component receives the current filter state, an onChange handler to update the filter and an onReset handler to reset the filters to their default values.
export default function SideBar({
  value,
  onChange,
  onReset,
}: {
  value: FilterState;
  // onChange is a callback function that is called whenever the filter state changes.
  // This definition indicates that onChange should be a function that takes the variable next which has the FilterState type and returns void (returns nothing).
  onChange: (next: FilterState) => void;
  // This indicates that onReset should be a function that takes no arguments and returns void.
  onReset: () => void;
}) {
  return (
    <>
      {/* This is the wrapper for the filter on smaller screens. */}
      <div className="sm:hidden fixed top-16 left-0 right-0 z-50 w-full border-b border-text-300 bg-sub-background px-6 py-3">
        <details className="group">
          <summary className="cursor-pointer select-none font-semibold border-b border-text-300">
            Filters
          </summary>
          <div className="fixed inset-0 top-16 z-40 hidden" />
          <div className="relative z-50 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar pt-4 pb-6 px-4">
            {/* Pass the current filter state and handlers again to the Filter component. */}
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

      {/* This is the sidebar for larger screens. */}
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
        {/* Pass the current filter state and handlers to the Filter component. */}
        <Filter value={value} onChange={onChange} />
        {/* The Reset button calls the onReset handler when clicked, which resets the filters to their default values. */}
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
