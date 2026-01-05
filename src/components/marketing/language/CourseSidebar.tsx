'use client';

import { X } from 'lucide-react';
import { courseModules } from '@/data/language-course';
import { useState } from 'react';

interface CourseSidebarProps {
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
}

export default function CourseSidebar({
  activeModule,
  onModuleChange
}: CourseSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleModuleClick = (moduleId: string) => {
    onModuleChange(moduleId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

          <h3 className="font-montserrat text-sm font-semibold text-gray-500 uppercase mb-4">
            Course Modules
          </h3>

          {courseModules.map((module) => {
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => handleModuleClick(module.id)}
                className={`w-full text-left p-4 rounded-lg mb-2 transition-all ${
                  isActive
                    ? 'bg-brand-red text-white shadow-md'
                    : 'bg-slate-50 text-gray-700 hover:bg-slate-100 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    isActive ? 'bg-white text-brand-red' : 'bg-brand-red text-white'
                  }`}>
                    {module.level}
                  </span>
                </div>
                <div className="font-montserrat font-semibold">{module.title}</div>
                <div className={`text-sm mt-1 ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
                  {module.sections.reduce((acc, section) => acc + section.items.length, 0)} items
                </div>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
