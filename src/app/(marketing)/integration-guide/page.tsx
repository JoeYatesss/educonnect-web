'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import GuideSidebar from '@/components/marketing/guide/GuideSidebar';
import { guideSections } from '@/data/integration-guide';

export default function IntegrationGuidePage() {
  const [activeSection, setActiveSection] = useState(guideSections[0].id);
  const [activeSubsection, setActiveSubsection] = useState('');

  // Find the active section
  const activeSectionData = guideSections.find(section => section.id === activeSection);

  // Find the next section
  const currentSectionIndex = guideSections.findIndex(section => section.id === activeSection);
  const nextSection = currentSectionIndex < guideSections.length - 1
    ? guideSections[currentSectionIndex + 1]
    : null;

  const handleNextSection = () => {
    if (nextSection) {
      setActiveSection(nextSection.id);
      setActiveSubsection('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <GuideSidebar
        activeSection={activeSection}
        activeSubsection={activeSubsection}
        onSectionChange={setActiveSection}
        onSubsectionChange={setActiveSubsection}
      />

      {/* Main Content */}
      <div className="lg:ml-72 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16 pt-8">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            China Integration Guide
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your comprehensive resource for thriving as an international teacher in China
          </p>
        </header>

        {/* Active Section Content */}
        {activeSectionData && (
          <div>
            <h2 className="font-montserrat text-4xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-brand-red inline-block">
              <span className="mr-3 text-3xl">{activeSectionData.emoji}</span>
              {activeSectionData.title}
            </h2>

            {/* All Subsections - Scrollable */}
            <div className="space-y-12 mt-12">
              {activeSectionData.subsections.map((subsection) => (
                <div
                  key={subsection.id}
                  id={subsection.id}
                  className="scroll-mt-24"
                >
                  <h3 className="font-montserrat text-2xl font-semibold text-gray-800 mb-6">
                    {subsection.title}
                  </h3>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed prose-headings:font-montserrat prose-headings:text-gray-900 prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline">
                    {subsection.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Next Section Button */}
            {nextSection && (
              <div className="mt-16 pt-8 border-t border-gray-200">
                <button
                  onClick={handleNextSection}
                  className="flex items-center justify-between w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-6 transition-all group"
                >
                  <div className="text-left">
                    <p className="text-sm text-gray-500 mb-1">Next Section</p>
                    <p className="font-montserrat text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">{nextSection.emoji}</span>
                      {nextSection.title}
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 text-brand-red group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-20 bg-gray-900 rounded-xl p-12 text-center text-white">
          <h3 className="font-montserrat text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of teachers who have successfully made the move to China
          </p>
          <a
            href="/signup"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}
