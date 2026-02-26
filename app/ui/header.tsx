// app/ui/header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import useSavedVideo from "@/app/lib/useSavedVideo";

export default function Header() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // useRef is used to reference a DOM element, in this case, the modal.
  const modalRef = useRef<HTMLDivElement>(null);
  const { videoIds, isReady } = useSavedVideo("");

  useEffect(() => {
    if (!isModalOpen) return;

    // When the mouse is clicked outside the modal, it will close the modal by setting isModalOpen to false.
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    // Cleanup function to remove the event listener when the component unmounts or when isModalOpen changes.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isModalOpen]);

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
        <nav>
          <ul className="flex items-center gap-5">
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
