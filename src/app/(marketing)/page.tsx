'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/contexts/ModalContext';

export default function HomePage() {
  const { openSignup } = useModal();

  return (
    <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-white pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-gray-900">Teach.</span>
                <span className="block text-gray-900">Explore.</span>
                <span className="block text-brand-red">Thrive.</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600">
                Globalise your career with a teaching job in China.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">25K+</div>
                  <div className="text-sm text-gray-600">RMB Monthly</div>
                  <div className="text-xs text-gray-500 mt-1">≈ £2,700 / $3,400</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">Guaranteed</div>
                  <div className="text-sm text-gray-600">Interview</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={openSignup}
                  className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Start Your Journey
                </button>
                <Link
                  href="#opportunities"
                  className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/china-classroom.jpeg"
                alt="Modern classroom at international school in China"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section id="opportunities" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose EduConnect?
            </h2>
            <p className="text-xl text-gray-600">
              Discover the benefits of our service
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <Image
                  src="/images/virtual_interview.png"
                  alt="Interview guaranteed"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-gray-900 mb-3 text-center">
                Interview guaranteed.
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                We match your profile to schools across China, and guarantee at least one interview for candidates that meet our requirements.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <Image
                  src="/images/complete_support.jpeg"
                  alt="Complete support"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-gray-900 mb-3 text-center">
                Complete support.
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                We offer a free, tailored Mandarin course, expat community support, and ongoing guidance to help you thrive in China.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <Image
                  src="/images/high_school_english.png"
                  alt="Competitive packages"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-gray-900 mb-3 text-center">
                Competitive packages.
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Earn 25-40K RMB monthly with comprehensive benefits including housing, flights, and medical insurance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-montserrat text-4xl md:text-5xl font-bold mb-6">
            Ready to start your adventure?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of teachers who have transformed their careers by teaching in China.
          </p>
          <button
            onClick={openSignup}
            className="inline-block px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
}
