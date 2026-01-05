'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

interface MarketingNavProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export default function MarketingNav({ onOpenLogin, onOpenSignup }: MarketingNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/requirements', label: 'Requirements' },
    { href: '/integration-guide', label: 'China Guide' },
    { href: '/language-course', label: 'Chinese Course' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
      <nav className="container mx-auto px-6 h-20 max-w-7xl">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-gray-900 font-montserrat text-2xl font-bold tracking-tight group-hover:text-gray-700 transition-colors">
              EduConnect
            </span>
            <span
              className="text-brand-red font-chinese text-[1.75rem] font-bold group-hover:scale-105 transition-transform duration-200"
              style={{textShadow: '1px 1px 3px rgba(230, 74, 74, 0.3)'}}
            >
              中国
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-700 hover:text-brand-red font-medium text-[15px] tracking-tight transition-all duration-200 relative ${
                  pathname === link.href ? 'text-brand-red font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4 border-l border-gray-200 pl-6">
              <button
                onClick={onOpenLogin}
                className="bg-white text-gray-700 px-6 py-3 rounded font-semibold border border-gray-300 hover:border-brand-red hover:text-brand-red transition-all duration-200"
              >
                Log In
              </button>
              <button
                onClick={onOpenSignup}
                className="group bg-brand-red text-white px-6 py-3 rounded font-semibold hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
              >
                Get Started
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="container mx-auto px-6 py-6 max-w-7xl">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 text-gray-700 hover:text-brand-red font-medium transition-colors ${
                    pathname === link.href ? 'text-brand-red font-semibold' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setIsOpen(false);
                  }}
                  className="bg-white text-gray-700 px-6 py-3 rounded font-semibold text-center border border-gray-300 hover:border-brand-red hover:text-brand-red transition-all duration-200"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onOpenSignup();
                    setIsOpen(false);
                  }}
                  className="group bg-brand-red text-white px-6 py-3 rounded font-semibold text-center hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
