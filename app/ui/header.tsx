import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-background border-b border-text-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Couch to Crunch Logo"
            width={180}
            height={30}
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
