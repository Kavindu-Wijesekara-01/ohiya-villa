import Image from "next/image";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#C58E47]/70 bg-white shadow-lg animate-pulse">
        <Image
          src="/logo.jpeg"
          alt="Dawn Breezy Bungalow Logo"
          fill
          priority
          quality={95}
          sizes="128px"
          className="object-cover scale-[1.24]"
        />
      </div>
    </div>
  );
}
