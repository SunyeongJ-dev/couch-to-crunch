import Image from "next/image";
type SearchProps = {
  searchWord: string;
  setSearchWord: (newValue: string) => void;
  isCompact: boolean;
  setIsCompact: (newValue: boolean) => void;
};

export default function SearchBar({
  searchWord,
  setSearchWord,
  isCompact,
  setIsCompact,
}: SearchProps) {
  if (isCompact) {
    return (
      <button
        className="fixed bottom-8 right-8 z-50 bg-primary rounded-full p-3 cursor-pointer shadow-lg transition-all duration-300 opacity-100 scale-100"
        onClick={() => setIsCompact(false)}
      >
        <Image
          src="/search.svg"
          alt="Search"
          width={28}
          height={28}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </button>
    );
  }
  return (
    <div className="fixed bottom-8 right-8 z-50 bg-sub-background rounded-xl shadow-lg p-3 flex gap-2 items-end w-[85%] sm:max-w-[50%] lg:max-w-3xl transition-all duration-300 opacity-100 scale-100">
      <input
        type="text"
        placeholder="Search workouts..."
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
        className="w-full bg-transparent border border-text-300 rounded-md px-3 py-1 text-md text-text-500 focus:outline-none focus:ring-2 focus:ring-primary"
        autoFocus
      />
      <button
        className="flex mb-1.5 cursor-pointer justify-center items-center"
        onClick={() => setIsCompact(true)}
        aria-label="Close search"
      >
        <Image src="/x.svg" alt="Close search" width={24} height={24} />
      </button>
    </div>
  );
}
