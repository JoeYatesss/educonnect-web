import { Metadata } from 'next';
import GuideSidebar from '@/components/marketing/guide/GuideSidebar';
import { guideSections } from '@/data/integration-guide';

export const metadata: Metadata = {
  title: 'China Integration Guide - EduConnect',
  description: 'Comprehensive guide for international teachers moving to China. Everything from VPNs and banking to housing and cultural tips.',
};

export default function IntegrationGuidePage() {
  return (
    <div className="relative">
      <GuideSidebar />

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

        {/* Sections */}
        <div className="space-y-16">
          {guideSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              data-section-id={section.id}
              className="scroll-mt-24"
            >
              <h2 className="font-montserrat text-4xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-brand-red inline-block">
                <span className="mr-3 text-3xl">{section.emoji}</span>
                {section.title}
              </h2>

              <div className="space-y-12">
                {section.subsections.map((subsection) => (
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
            </section>
          ))}
        </div>

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
