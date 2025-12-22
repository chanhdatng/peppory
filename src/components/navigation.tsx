"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/showroom", label: "Showroom" },
  { href: "/contact", label: "Liên hệ" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-[var(--color-cream)]/90 backdrop-blur-sm z-40 border-b border-[var(--color-sand)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--color-charcoal)] hover:text-[var(--color-terracotta)] transition-colors"
        >
          Peppory
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                pathname === link.href
                  ? "text-[var(--color-charcoal)]"
                  : "text-[var(--color-charcoal)]/70 hover:text-[var(--color-terracotta)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[var(--color-charcoal)] p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden bg-[var(--color-cream)] border-t border-[var(--color-sand)]">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 transition-colors ${
                  pathname === link.href
                    ? "text-[var(--color-charcoal)]"
                    : "text-[var(--color-charcoal)]/70"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
