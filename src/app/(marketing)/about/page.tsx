import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About EduConnect | Connecting Teachers with Schools in China',
  description: 'Learn about EduConnect\'s mission to connect qualified teachers with international schools in China. Discover how we match educators with their ideal teaching positions.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-20 bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            About EduConnect
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting exceptional educators with international schools in China
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Who We Are */}
          <div className="mb-16">
            <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              EduConnect is a recruitment platform dedicated to connecting qualified, passionate teachers with
              international schools across China. We understand that finding the right teaching position abroad
              can be challenging, and we're here to make that process seamless and rewarding.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our platform brings together educators seeking meaningful international experiences and schools
              looking for talented professionals who can contribute to their students' success.
            </p>
          </div>

          {/* Our Mission */}
          <div id="mission" className="mb-16 bg-slate-50 p-8 rounded-xl border border-gray-200">
            <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We are committed to recruiting hard-working, talented, and well-mannered individuals who can
              equip students to excel in life. We seek educators who share our passion for excellence and
              believe in the transformative power of quality education.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quality First</h3>
                <p className="text-gray-600 text-sm">
                  We maintain high standards to ensure the best educational experience
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive resources to help you succeed in China
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
                <p className="text-gray-600 text-sm">
                  Clear communication and honest expectations throughout
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div id="how-it-works" className="mb-16">
            <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Our streamlined process makes it easy to connect with the right opportunities in China.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">Create Your Profile</h3>
                  <p className="text-gray-700">
                    Sign up and upload your CV, qualifications, and teaching credentials. Tell us about
                    your experience, preferences, and what you're looking for in your next teaching position.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">We Match You</h3>
                  <p className="text-gray-700">
                    Our team reviews your profile and matches you with schools that align with your
                    qualifications, experience, and preferences. We work behind the scenes to find your
                    ideal position.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">Get Connected</h3>
                  <p className="text-gray-700">
                    When we find a great match, we'll connect you directly with the school for interviews
                    and next steps. We support you throughout the entire process.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">Start Your Journey</h3>
                  <p className="text-gray-700">
                    Once you accept a position, we provide resources to help you integrate into Chinese
                    culture, including our Survival Chinese course and comprehensive integration guide.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16 bg-white p-8 rounded-xl border border-gray-200">
            <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-6">
              Why Choose EduConnect?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-gray-900">Curated Opportunities:</strong>
                  <span className="text-gray-700"> We work only with reputable international schools that meet our quality standards</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-gray-900">Comprehensive Support:</strong>
                  <span className="text-gray-700"> From language courses to cultural integration guides, we help you succeed</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-gray-900">Personalized Matching:</strong>
                  <span className="text-gray-700"> We take time to understand your goals and find positions that truly fit</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-gray-900">Experience & Expertise:</strong>
                  <span className="text-gray-700"> Our team understands both the education sector and the unique aspects of teaching in China</span>
                </div>
              </li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="bg-gray-900 p-10 rounded-xl text-white text-center">
            <h2 className="font-montserrat text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
              Join EduConnect today and discover exciting teaching opportunities in China.
              Upload your CV and let us match you with your ideal position.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/requirements"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded hover:bg-gray-100 transition-colors"
              >
                View Requirements
              </Link>
              <Link
                href="/signup"
                className="px-8 py-4 bg-brand-red text-white font-semibold rounded hover:bg-red-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
