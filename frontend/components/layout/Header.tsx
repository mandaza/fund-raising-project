"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { EVENT_INFO } from "@/lib/utils/constants";

function LogoMark() {
  return (
    <Image
      src="/logo/mosh-logo.png"
      alt="MOSH"
      width={114}
      height={28}
      priority
      className="h-7 w-auto flex-none"
    />
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-3 text-xl font-bold text-primary hover:text-primary-dark"
            >
              <LogoMark />
              <span className="sr-only">{EVENT_INFO.name}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/book"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/return"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Check Booking
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary"
            >
              <span className="sr-only">Open menu</span>
              {!mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="pb-3">
          <div className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
            Every booking supports a child with special needs
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/book"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Now
            </Link>
            <Link
              href="/return"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Check Booking
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
