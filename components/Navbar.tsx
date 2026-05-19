import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/data";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Damber"
            width={140}
            height={32}
            priority
            className="h-7 sm:h-8 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#products"
            className="text-sm text-gray-600 hover:text-damber-navy transition-colors"
          >
            Mahsulotlar
          </Link>
          <Link
            href="#contact"
            className="text-sm text-gray-600 hover:text-damber-navy transition-colors"
          >
            Aloqa
          </Link>
        </div>

        {/* Phone */}
        <a
          href={`tel:${siteConfig.phoneRaw}`}
          className="flex items-center gap-2 text-sm font-medium text-damber-blue hover:text-damber-blue-dark transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="hidden sm:inline">{siteConfig.phone}</span>
        </a>
      </nav>
    </header>
  );
}
