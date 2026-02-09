// app/ui/header.tsx
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 w-full px-8 bg-sub-background border-b border-text-300">
      <div className="flex h-full justify-between items-center">
        <Link href="/">
          <Image
            src="/favicon.ico"
            alt="Couch to Crunch"
            width={24}
            height={24}
            className="block sm:hidden mb-0.5"
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
          <ul className="flex space-x-6">
            <li>
              <Link href="/saved">
                <Image
                  src="bookmark.svg"
                  alt="Saved Workouts"
                  width={24}
                  height={24}
                />
              </Link>
            </li>
            <li>
              <Link href="">
                <Image
                  src="user.svg"
                  alt="User Profile"
                  width={24}
                  height={24}
                  className="ml-2"
                />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
