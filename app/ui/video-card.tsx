import Image from "next/image";

export default function VideoCard() {
  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative pb-[56.25%]">
        <Image
          src="/thumbnail-mqdefault.jpg"
          alt="Video Thumbnail"
          className="absolute top-0 left-0 w-full h-full object-cover"
          width={280}
          height={157}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Video Title</h3>
        <p className="--color-text-600 text-sm">Channel Name</p>
        <div className="flex justify-between">
          <p className="--color-text-500 text-xs mt-1">
            10K views • 2 days ago
          </p>
          <p className="--color-text-500 text-xs mt-1">23:00</p>
        </div>
      </div>
    </div>
  );
}
