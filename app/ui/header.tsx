// app/ui/header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import useSearch from "@/app/lib/hooks/useSearch";

export default function Header() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // useRef is used to reference a DOM element, in this case, the modal.
  const modalRef = useRef<HTMLDivElement>(null);

  const { query, handleSearch, setQuery, setIsSearchOpen, isSearchOpen } =
    useSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModalOpen && !isSearchOpen) return;

    // When the mouse is clicked outside the modal and search bar, it will close them.
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setQuery("");
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    // Cleanup function to remove the event listener when the component unmounts or when isModalOpen changes.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isModalOpen, isSearchOpen]);

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
        <nav className="flex items-center">
          <div ref={searchRef} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search videos..."
              className={`${isSearchOpen ? "block" : "hidden"} mx-auto w-full lg:w-lg px-3 py-1 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent`}
            />
            <button
              className={`${isSearchOpen ? "block" : "hidden"} absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer`}
              onClick={() => {
                setIsSearchOpen(false);
                setQuery("");
              }}
            >
              <Image src="/x.svg" alt="Search" width={16} height={16} />
            </button>
          </div>
          <ul className="flex items-center gap-5">
            <li className="self-center">
              <button
                className={`${isSearchOpen ? "hidden" : "block"} flex items-center justify-center cursor-pointer`}
                onClick={() => setIsSearchOpen(true)}
              >
                <Image src="/search.svg" alt="Search" width={24} height={24} />
              </button>
            </li>
            <li
              className={`${isSearchOpen ? "hidden" : "block"} sm:block self-center`}
            >
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
            <li
              className={`${isSearchOpen ? "hidden" : "block"} sm:block self-center`}
            >
              <div ref={modalRef}>
                <button
                  className="flex items-center justify-center cursor-pointer sm:mx-2"
                  onClick={() => setIsModalOpen((prev) => !prev)}
                >
                  {session?.user ? (
                    <Image
                      src="/user.svg"
                      alt="User Signed In"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Image
                      src="/log-in.svg"
                      alt="Log In"
                      width={24}
                      height={24}
                    />
                  )}
                </button>
                {isModalOpen && (
                  <div className="absolute right-8 top-16 bg-sub-background border border-text-300 p-4">
                    {session?.user ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-md">
                          Hello,{" "}
                          {session.user.name ||
                            session.user.email?.split("@")[0]}
                          !
                        </p>
                        <button
                          onClick={() => {
                            signOut();
                            setIsModalOpen(false);
                          }}
                          className="w-full py-2 px-4 bg-primary rounded hover:bg-secondary text-white cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          signIn("google");
                          setIsModalOpen(false);
                        }}
                        className="w-full py-2 px-4 bg-accent text-white rounded hover:bg-accent-dark cursor-pointer"
                      >
                        Sign In with Google
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
