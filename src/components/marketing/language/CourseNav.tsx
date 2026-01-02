'use client';

import { courseModules } from '@/data/language-course';

interface CourseNavProps {
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
}

export default function CourseNav({ activeModule, onModuleChange }: CourseNavProps) {
  const scrollToModule = (moduleId: string) => {
    const element = document.getElementById(moduleId);
    if (element) {
      const offset = 120; // Account for fixed header + nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      onModuleChange(moduleId);
    }
  };

  return (
    <nav className="sticky top-20 bg-white border-b-2 border-gray-200 shadow-sm z-30 overflow-x-auto">
      <div className="container mx-auto px-4">
        <div className="flex gap-3 py-4">
          {courseModules.map((module) => (
            <button
              key={module.id}
              onClick={() => scrollToModule(module.id)}
              className={`px-6 py-3 rounded-lg font-montserrat font-semibold whitespace-nowrap transition-all ${
                activeModule === module.id
                  ? 'bg-brand-red text-white shadow-md'
                  : 'bg-slate-50 text-gray-700 hover:bg-slate-100 border border-gray-200'
              }`}
            >
              {module.title}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
