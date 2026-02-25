// app/ui/header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
