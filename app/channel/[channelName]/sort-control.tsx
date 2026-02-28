// app/channel/[channelName]/sort-control.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";

export default function SortControl({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const pathName = usePathname();
  const active = currentSort ?? "newest";

  return (
    <div className="mb-8">
      <div className="flex gap-1">
        {[
          { label: "Newest", value: "newest" },
          { label: "Most Viewed", value: "most_viewed" },
        ].map((sortOption) => (
          <button
            key={sortOption.value}
            onClick={() => router.push(`${pathName}?sort=${sortOption.value}`)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer transition duration-200
              ${
                active === sortOption.value
                  ? "border-b-2 border-primary text-primary -mb-0.5"
                  : "text-text-500 hover:text-primary"
              }`}
          >
            {sortOption.label}
          </button>
        ))}
      </div>
    </div>
  );
}
