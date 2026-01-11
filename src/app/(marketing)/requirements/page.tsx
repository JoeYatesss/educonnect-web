import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Teacher Requirements for China Jobs | Qualifications Needed | EduConnect',
  description: 'Qualify to teach in China with EduConnect. Requirements: Bachelor\'s degree, professional experience, excellent English skills. Learn what you need for international school positions in China.',
};

export default function RequirementsPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-20 bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Teacher Requirements
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We maintain high standards to ensure the best educational experience for our schools' students.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Minimum Requirements */}
          <div className="mb-16 bg-white p-8 rounded-xl border border-gray-200">
            <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-6">
              Minimum Requirements
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-gray-900">Professional Experience:</strong>
                  <span className="text-gray-700"> Relevant professional experience in a well-regarded company or industry</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-gray-900">Educational Background:</strong>
                  <span className="text-gray-700"> Bachelor's degree (BA) in a relevant subject area</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-gray-900">Excellent English Skills:</strong>
                  <span className="text-gray-700"> A native English speaker from an English-speaking country</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-gray-900">Valid Passport:</strong>
                  <span className="text-gray-700"> A valid passport with at least 6 months remaining validity</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-gray-900">Clean Background Check:</strong>
                  <span className="text-gray-700"> A clear criminal record, verified through a police background check</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-gray-900">Health Clearance:</strong>
                  <span className="text-gray-700"> Ability to pass a medical examination (required for Z-Visa)</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-gray-900">Contract Commitment:</strong>
                  <span className="text-gray-700"> Willingness to commit to a minimum one-year contract</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Preferred Skills */}
          <div className="mb-16 bg-slate-50 p-8 rounded-xl border border-gray-200">
            <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-4">
              Preferred Additional Skills
            </h2>
            <p className="text-gray-900 mb-4 font-semibold">
              We are especially interested in candidates who possess:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-brand-red mt-1">•</span>
                Second language proficiency (Mandarin, French, etc.)
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-brand-red mt-1">•</span>
                Advanced degrees or additional certifications (MA, PhD, etc.)
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-brand-red mt-1">•</span>
                Coding, programming or advanced AI skills
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-brand-red mt-1">•</span>
                An interest in using educational technology in the classroom
              </li>
            </ul>
          </div>

          {/* Our Focus */}
          <div className="mb-16 bg-white p-8 rounded-xl border border-gray-200">
            <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-4">
              Our Focus
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We are committed to recruiting hard-working, talented, and well-mannered individuals who can equip our schools' students to excel in life. We seek educators who share our passion for excellence.
            </p>
          </div>

          {/* Flexible Requirements Callout */}
          <div className="bg-gray-900 p-10 rounded-xl text-white text-center">
            <h2 className="font-montserrat text-3xl font-bold mb-4">
              Don't Meet All Requirements?
            </h2>
            <p className="text-lg font-semibold mb-3">
              If you do not meet our requirements but think you would still be a good fit, don't hesitate to contact us.
            </p>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              We value well-educated, professional candidates who bring positive energy and a great attitude. Sometimes the right fit matters more than checking every box.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                href="/signup"
                className="px-8 py-4 bg-brand-red text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Apply Anyway
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
