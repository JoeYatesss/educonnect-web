'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const BENEFITS = [
  {
    title: 'Vetted Teacher Profiles',
    description: 'Every teacher in our database has been screened for qualifications, experience, and teaching ability.',
  },
  {
    title: 'Complete Information',
    description: 'Access full profiles including CVs, introduction videos, teaching experience, and contact details.',
  },
  {
    title: 'Smart Matching',
    description: 'Our algorithm helps match teachers to your school based on subjects, age groups, and location preferences.',
  },
  {
    title: 'Save & Compare',
    description: 'Bookmark interesting candidates and compare profiles to find the best fit for your school.',
  },
  {
    title: 'Direct Contact',
    description: 'Reach out directly to teachers via email, phone, or WeChat without intermediaries.',
  },
  {
    title: 'Downloadable CVs',
    description: 'Download teacher CVs and share them with your hiring committee instantly.',
  },
];

const STEPS = [
  {
    number: 1,
    title: 'Create Your Account',
    description: 'Sign up with your school details in just a few minutes.',
  },
  {
    number: 2,
    title: 'Browse Teachers',
    description: 'Search our database by subject, location preference, age group, and experience level.',
  },
  {
    number: 3,
    title: 'Unlock Full Access',
    description: 'Pay once to unlock complete profiles, contact details, CVs, and introduction videos.',
  },
  {
    number: 4,
    title: 'Connect & Hire',
    description: 'Contact teachers directly and start your hiring process immediately.',
  },
];

const FAQ = [
  {
    question: 'How much does it cost?',
    answer: 'Full access costs ¥7,500 (approximately $1,000 USD) as a one-time payment. This gives you unlimited access to all teacher profiles, contact information, and downloadable CVs.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards, WeChat Pay, and Alipay through our secure Stripe payment system. We also offer invoice payment for schools that prefer bank transfers.',
  },
  {
    question: 'How are teachers vetted?',
    answer: 'All teachers submit their qualifications, teaching experience, CVs, and introduction videos. We verify their information and ensure they meet the basic requirements for teaching in China.',
  },
  {
    question: 'Can I see teacher profiles before paying?',
    answer: 'You can browse teacher previews including their preferred locations, subjects, age groups, and experience levels. Full profiles including contact details and CVs require payment.',
  },
  {
    question: 'How many teachers are in your database?',
    answer: 'We have a growing database of qualified teachers from around the world, all interested in teaching positions in China. New teachers are added regularly.',
  },
  {
    question: 'Can I get an invoice for my school?',
    answer: 'Absolutely. During checkout, you can request an invoice payment option. We\'ll send you a formal invoice that you can process through your school\'s finance department.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-6 text-left flex justify-between items-center hover:text-brand-red transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-gray-900 pr-8">{question}</span>
        <span className={`text-2xl text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function ForSchoolsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <span className="inline-block px-4 py-2 bg-brand-red/10 text-brand-red rounded-full text-sm font-semibold">
                For Schools
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-gray-900">Find.</span>
                <span className="block text-gray-900 italic">Connect.</span>
                <span className="block text-brand-red">Hire.</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600">
                Access our database of vetted, qualified teachers ready to join international schools in China. Browse profiles, download CVs, and connect directly.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Qualified Teachers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Vetted Profiles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">Direct</div>
                  <div className="text-sm text-gray-600">Contact Access</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/school-signup"
                  className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-gray-200">
              <div className="text-center">
                <div className="text-5xl font-bold text-brand-red mb-2">¥7,500</div>
                <div className="text-gray-600 mb-6">One-time payment</div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className="text-gray-700">Unlimited teacher profiles</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className="text-gray-700">Full contact information</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className="text-gray-700">Downloadable CVs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className="text-gray-700">Introduction videos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className="text-gray-700">Save & bookmark teachers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className="text-gray-700">WeChat Pay accepted</span>
                  </li>
                </ul>
                <Link
                  href="/school-signup"
                  className="block w-full py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Start Now
                </Link>
                <p className="text-sm text-gray-500 mt-4">
                  Approx. $1,000 USD / €920 EUR / £790 GBP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database Banner */}
      <section className="py-10 bg-brand-red">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <p className="text-lg md:text-xl text-white italic">
            Access the most comprehensive database of qualified teachers looking for positions in China.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Schools Choose EduConnect
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to find and hire qualified teachers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-red font-bold text-xl">&#10003;</span>
                </div>
                <h3 className="font-montserrat text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Get started in minutes and find your next great teacher.
              </p>
              <div className="space-y-6">
                {STEPS.map((step) => (
                  <div key={step.number} className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div className="pt-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/school-signup"
                className="inline-block px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Create Your Account
              </Link>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/international_school_campus.jpg"
                alt="International school campus in China"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-slate-50 rounded-xl p-8 border border-gray-200">
            {FAQ.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="font-montserrat text-4xl md:text-5xl font-bold mb-6">
            Ready to find your next teacher?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create your account and start browsing qualified teachers today.
          </p>
          <Link
            href="/school-signup"
            className="inline-block px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
