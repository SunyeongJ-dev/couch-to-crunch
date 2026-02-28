"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function useSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  return { query, handleSearch, isSearchOpen, setQuery, setIsSearchOpen };
}
