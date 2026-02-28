// app/lib/hooks/useSearch.ts
// Custom React hook to manage search state and behavior in the header component.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function useSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return { query, handleSearch, isSearchOpen, setQuery, setIsSearchOpen };
}
