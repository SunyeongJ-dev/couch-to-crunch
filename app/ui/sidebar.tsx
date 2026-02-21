// app/ui/sidebar.tsx
"use client";

import Filter from "./filter";
import { FilterState } from "../ui/filter";
import Image from "next/image";

// The SideBar component is responsible for rendering the filter options and handling user interactions to update the filters.
// It has two main layouts: a fixed sidebar on larger screens and a collapsible details element on smaller screens.

// The component receives the current filter state, an onChange handler to update the filter and an onReset handler to reset the filters to their default values.
export default function SideBar({
  value,
  onChange,
  onReset,
  isCollapsed,
  setIsCollapsed,
}: {
  value: FilterState;
  // onChange is a callback function that is called whenever the filter state changes.
  // This definition indicates that onChange should be a function that takes the variable next which has the FilterState type and returns void (returns nothing).
  onChange: (next: FilterState) => void;
  // This indicates that onReset should be a function that takes no arguments and returns void.
  onReset: () => void;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
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
          <div className="relative z-50 overflow-y-auto no-scrollbar pt-4 pb-6 px-4">
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
        className={`hidden sm:block fixed left-0 top-16 bottom-0 z-50 bg-sub-background border-r border-text-300 overflow-y-auto transition-all duration-300 transform 
          ${isCollapsed ? "w-16" : "w-56"} px-0 py-6`}
      >
        <button
          className="absolute top-5 right-4.5 w-8 h-8 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <Image
              src="/open.svg"
              alt="Open Filters"
              width={24}
              height={24}
              className="pointer-events-none select-none"
            />
          ) : (
            <Image
              src="/collapse.svg"
              alt="Collapse Filters"
              width={24}
              height={24}
              className="pointer-events-none select-none"
            />
          )}
        </button>
        <div className="px-8">
          <Filter value={value} onChange={onChange} isCollapsed={isCollapsed} />
          <button
            className={`${isCollapsed ? "hidden" : "block"} mt-2 text-sm text-sub-background bg-primary hover:bg-secondary transition duration-300 px-3 py-1 rounded-md font-medium cursor-pointer`}
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </aside>
    </>
  );
}
