'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import CourseSidebar from '@/components/marketing/language/CourseSidebar';
import VocabularyTable from '@/components/marketing/language/VocabularyTable';
import { courseModules } from '@/data/language-course';

export default function LanguageCoursePage() {
  const [activeModule, setActiveModule] = useState(courseModules[0].id);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-20 bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Survival Chinese Course
          </h1>
          <p className="text-xl text-gray-600 mb-2 max-w-3xl mx-auto">
            Master essential Chinese vocabulary with audio pronunciation guides
          </p>
          <p className="text-gray-500 text-lg">
            236 vocabulary items across 7 practical modules
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex gap-8">
            <CourseSidebar activeModule={activeModule} onModuleChange={setActiveModule} />

            {/* Course Modules */}
            <div className="flex-1 max-w-4xl">
        {courseModules
          .filter(module => module.id === activeModule)
          .map((module) => (
            <div key={module.id}>
              {/* Module Header */}
              <div className="mb-8 bg-white p-8 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-2 bg-brand-red text-white text-sm font-bold rounded-full">
                    {module.level}
                  </span>
                </div>
                <h2 className="font-montserrat text-4xl font-bold text-gray-900 mb-3">
                  {module.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {module.description}
                </p>
              </div>

              {/* Module Sections */}
              <div className="space-y-10">
                {module.sections.map((section, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="font-montserrat text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                      {section.title}
                    </h3>
                    <VocabularyTable items={section.items} />
                  </div>
                ))}
              </div>
            </div>
          ))}

            {/* Footer CTA */}
            <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Teach in China?</h3>
              <p className="text-gray-300 mb-6">
                Start your journey with confidence using these essential phrases
              </p>
              <a
                href="/signup"
                className="inline-block bg-brand-red text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
              >
                Join EduConnect
              </a>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
