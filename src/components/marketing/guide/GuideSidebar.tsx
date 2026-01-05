'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { guideSections } from '@/data/integration-guide';

interface GuideSidebarProps {
  activeSection: string;
  activeSubsection: string;
  onSectionChange: (sectionId: string) => void;
  onSubsectionChange: (subsectionId: string) => void;
}

export default function GuideSidebar({
  activeSection,
  activeSubsection,
  onSectionChange,
  onSubsectionChange
}: GuideSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set() // Start with all sections collapsed
  );

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    // Expand the section when it's clicked
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.add(sectionId);
      return newSet;
    });
  };

  const toggleSection = (sectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleSubsectionClick = (subsectionId: string) => {
    onSubsectionChange(subsectionId);
    // Scroll to the subsection
    const element = document.getElementById(subsectionId);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsOpen(false); // Close mobile menu
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
        className={`lg:sticky lg:top-24 lg:self-start fixed top-20 left-0 h-[calc(100vh-80px)] lg:h-auto lg:max-h-[calc(100vh-6rem)] w-72 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-y-auto z-50 transition-transform duration-300 ${
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

          {guideSections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const isActive = activeSection === section.id;
            return (
              <div key={section.id} className="mb-4">
                <div
                  className={`flex items-center gap-2 w-full font-semibold transition-colors py-2 rounded-md ${
                    isActive ? 'bg-brand-red text-white' : 'text-gray-900'
                  }`}
                >
                  <button
                    onClick={(e) => toggleSection(section.id, e)}
                    className="p-1 hover:bg-gray-100 hover:bg-opacity-20 rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleSectionClick(section.id)}
                    className="flex items-center gap-2 flex-1 hover:opacity-80"
                  >
                    <span className="text-2xl">{section.emoji}</span>
                    <span className="text-sm">{section.title}</span>
                  </button>
                </div>
                {isExpanded && (
                  <div className="space-y-1 ml-8 mt-2">
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => handleSubsectionClick(subsection.id)}
                        className={`block w-full text-left py-2 px-3 rounded-md text-sm transition-colors ${
                          activeSubsection === subsection.id
                            ? 'bg-gray-900 text-white font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {subsection.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
