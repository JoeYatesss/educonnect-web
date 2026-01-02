'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { guideSections } from '@/data/integration-guide';

interface GuideSidebarProps {
  activeSection?: string;
}

export default function GuideSidebar({ activeSection }: GuideSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(activeSection || '');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section-id]');
      let current = '';

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('data-section-id') || '';
        }
      });

      if (current) {
        setActiveId(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-24 left-4 z-40 bg-gray-900 text-white p-3 rounded-lg shadow-lg"
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-20 left-0 h-[calc(100vh-80px)] w-72 bg-white border-r border-gray-200 overflow-y-auto z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="p-6">
          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          {guideSections.map((section) => (
            <div key={section.id} className="mb-6">
              <div className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                <span className="text-2xl">{section.emoji}</span>
                <span>{section.title}</span>
              </div>
              <div className="space-y-1 ml-8">
                {section.subsections.map((subsection) => (
                  <button
                    key={subsection.id}
                    onClick={() => scrollToSection(subsection.id)}
                    className={`block w-full text-left py-2 px-3 rounded-md text-sm transition-colors ${
                      activeId === subsection.id
                        ? 'bg-gray-900 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {subsection.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
