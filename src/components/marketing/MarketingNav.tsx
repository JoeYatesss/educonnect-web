'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function MarketingNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/requirements', label: 'Requirements' },
    { href: '/integration-guide', label: 'China Guide' },
    { href: '/language-course', label: 'Chinese Course' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center min-h-[80px]">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-gray-900 font-montserrat text-2xl font-bold tracking-tight">EduConnect</span>
            <span className="text-brand-red ml-2 font-chinese text-[1.75rem] font-bold italic" style={{textShadow: '1px 1px 3px rgba(230, 74, 74, 0.3)'}}>中国</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-600 hover:text-gray-900 font-medium transition-colors ${
                  pathname === link.href ? 'text-gray-900' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/signup"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-gray-600 hover:text-gray-900 ${
                  pathname === link.href ? 'text-gray-900 font-semibold' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/signup"
              className="block mt-4 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Join Now
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
