// app/ui/header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 w-full px-8 bg-sub-background border-b border-text-300">
      <div className="flex h-full justify-between items-center gap-5">
        <Link href="/">
          <Image
            src="/favicon.ico"
            alt="Couch to Crunch"
            width={24}
            height={24}
            className="block sm:hidden mb-0.5 min-w-6"
          />
          <Image
            src="/logo.png"
            alt="Couch to Crunch Logo"
            width={200}
            height={32}
            className="hidden sm:block"
          />
        </Link>
        <input
          type="text"
          placeholder="Search workouts..."
          className="hidden md:block bg-white md:w-80 lg:w-lg max-w-2xl border border-text-300 rounded-md px-3 py-1 text-sm h-8 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <nav>
          <ul className="flex items-center gap-5">
            <li className="md:hidden self-center flex items-center">
              <button
                type="button"
                className="cursor-pointer block"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <Image
                  src="/search.svg"
                  alt="Search Workouts"
                  width={24}
                  height={24}
                  className="text-text"
                />
              </button>
              {isSearchOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsSearchOpen(false)}
                  />
                  <div className="fixed top-4 right-8 z-50 w-72 max-w-xs flex items-center h-8 transition-all duration-300 ease-in-out transform opacity-100 translate-y-0">
                    <input
                      type="text"
                      placeholder="Search workouts..."
                      className="block bg-white border border-text-300 rounded-md px-3 py-1 text-sm w-full pr-10 h-8 focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-300 ease-in-out transform opacity-100 translate-y-0"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-lg text-text-500 cursor-pointer leading-none"
                      onClick={() => setIsSearchOpen(false)}
                      aria-label="Close search"
                    >
                      ×
                    </button>
                  </div>
                </>
              )}
            </li>
            <li className="self-center">
              <Link href="/saved">
                <Image
                  src="/bookmark.svg"
                  alt="Saved Workouts"
                  width={24}
                  height={24}
                  className="sm:ml-2"
                />
              </Link>
            </li>
            <li className="self-center">
              <Link href="">
                <Image
                  src="/user.svg"
                  alt="User Profile"
                  width={24}
                  height={24}
                  className="sm:ml-2"
                />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
