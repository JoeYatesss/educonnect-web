'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useModal } from '@/contexts/ModalContext';

const heroImages = [
  { src: '/images/china-classroom.jpeg', alt: 'Modern classroom in China' },
  { src: '/images/shanghai_skyline.jpg', alt: 'Shanghai skyline at sunset' },
  { src: '/images/china_classroom_big_teacher.jpg', alt: 'Teacher in classroom' },
  { src: '/images/shanghai_french_concession.jpg', alt: 'Shanghai French Concession' },
  { src: '/images/international_school_campus.jpg', alt: 'International school campus' },
  { src: '/images/china_rooftops_closeup.jpg', alt: 'Traditional Chinese rooftops' },
  { src: '/images/guilin_river.png', alt: 'Guilin river landscape' },
  { src: '/images/shanghai.jpg', alt: 'Shanghai cityscape' },
  { src: '/images/china_classroom_busy.jpg', alt: 'Busy classroom in China' },
];

const partnerSchools = [
  { src: '/images/Schools/dulwich.png', alt: 'Dulwich College International' },
  { src: '/images/Schools/NAS.png', alt: 'Nord Anglia Education' },
  { src: '/images/Schools/SAS.png', alt: 'Shanghai American School' },
  { src: '/images/Schools/WISS.png', alt: 'Western International School of Shanghai' },
  { src: '/images/Schools/SUIS.png', alt: 'Shanghai United International School' },
  { src: '/images/Schools/dulwich.png', alt: 'Dulwich College Beijing' },
  { src: '/images/Schools/NAS.png', alt: 'British International School Shanghai' },
  { src: '/images/Schools/SAS.png', alt: 'Concordia International School' },
  { src: '/images/Schools/WISS.png', alt: 'Yew Chung International School' },
  { src: '/images/Schools/SUIS.png', alt: 'Wellington College China' },
];

const faqs = [
  {
    question: "How much can I earn teaching in China?",
    answer: "Our teaching positions offer 25,000-40,000 RMB monthly (approximately £3,000-£4,800), plus benefits including housing assistance, medical insurance, and paid holidays. Many teachers save 60-70% of their salary."
  },
  {
    question: "What qualifications do I need to teach in China?",
    answer: "You need a Bachelor's degree, at least one year of teaching experience, a teaching qualification (TEFL/PGCE), and to be a native English speaker from an English-speaking country."
  },
  {
    question: "Which cities in China offer the best teaching opportunities?",
    answer: "Shanghai, Beijing, Shenzhen, and Guangzhou offer the highest salaries and most international schools. We also place teachers in Nanjing, Hangzhou, and other tier-1 cities with excellent opportunities."
  },
  {
    question: "Do you help with visa applications for China?",
    answer: "Yes, we provide complete visa support including Z-visa applications, work permit assistance, and guidance through all required documentation and legalization processes."
  },
  {
    question: "What subjects are most in demand in Chinese international schools?",
    answer: "English, Mathematics, Science, and Physical Education are in highest demand. We also regularly place Art, Music, History, and Computer Science teachers in top international schools."
  },
  {
    question: "Is it difficult to adapt to living in China as a foreign teacher?",
    answer: "We provide comprehensive support including free Mandarin lessons, expat community connections, and ongoing assistance to help you settle in. Most teachers find the experience rewarding and exciting."
  }
];

const testimonials = [
  {
    name: "Emma Richardson",
    role: "Head of English, Shanghai",
    quote: "I went from classroom teacher to Head of English in two years - that would've taken a decade in the UK. The career progression here is unreal. Plus, I'm saving £1,500 a month while living in a gorgeous apartment in the French Concession. My Mandarin's coming along too - ordering street food like a local now!",
    image: "/images/Teacher Testimonials/teacher-asian-lady.png"
  },
  {
    name: "James Carter",
    role: "Geography Teacher, Beijing",
    quote: "The tech in these schools blew my mind. AI-powered learning tools, VR field trips to the Great Wall, interactive everything. Back home I was fighting for a working projector. Here, I'm teaching with resources I didn't know existed. And with housing covered and tax at just 3%, I'm actually building real savings for the first time in my teaching career.",
    image: "/images/Teacher Testimonials/teacher-white_man_shirt.png"
  },
  {
    name: "Tom Fletcher",
    role: "PE Teacher, Shenzhen",
    quote: "Shenzhen is like living in the future - you can pay for everything with your phone, take bullet trains across the country for weekend trips, and the sports facilities here are Olympic-standard. I'm saving 70% of my salary, eating incredible food for £3 a meal, and my flat is twice the size of my London studio. Why would I go back?",
    image: "/images/Teacher Testimonials/teacher-PE-man.png"
  },
  {
    name: "Alex Murphy",
    role: "Science Teacher, Guangzhou",
    quote: "The cultural immersion has been the unexpected highlight. Learning Mandarin, celebrating Chinese New Year with my students' families, exploring ancient temples on weekends. The work-life balance is better than I ever had at home - shorter commutes, affordable massages after work, and the 13th month bonus was a nice surprise. It's not just a job, it's a whole new life.",
    image: "/images/Teacher Testimonials/teacher_nerdy_guy.png"
  },
  {
    name: "Ben Clarke",
    role: "Mathematics Teacher, Chengdu",
    quote: "I was burnt out teaching in Manchester - underpaid, overworked, drowning in paperwork. Here in Chengdu, I earn more, work reasonable hours, and the students genuinely respect teachers. The cost of living is so low that my 32K RMB salary feels like a six-figure income. Three years in and I've paid off my student loans entirely.",
    image: "/images/Teacher Testimonials/teacher-hispanic_man.png"
  }
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

export default function HomePage() {
  const { openSignup } = useModal();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-gray-900">Teach.</span>
                <span className="block text-gray-900 italic">Explore.</span>
                <span className="block text-brand-red">Thrive.</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600">
                Teach at top international schools. Explore vibrant cities like Shanghai and Beijing. Thrive with competitive salaries and full support.
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

            {/* Hero Image Carousel */}
            <div className="relative w-full h-[350px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              {heroImages.map((image, index) => (
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover object-center transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  priority={index === 0}
                />
              ))}
              {/* Carousel indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database Banner */}
      <section className="py-10 bg-brand-red">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <p className="text-lg md:text-xl text-white italic">
            Access the most comprehensive database of teaching opportunities in China.
          </p>
        </div>
      </section>

      {/* Connect with Excellence Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Connect with Excellence
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                EduConnect bridges the gap between exceptional Western educators and premier international schools across China. We specialize in placing qualified teachers in Shanghai, Beijing, Shenzhen, and Guangzhou&apos;s top educational institutions, offering competitive salaries and comprehensive support.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                    &#10003;
                  </span>
                  <span className="text-gray-700">Certified teacher matching with top international schools</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                    &#10003;
                  </span>
                  <span className="text-gray-700">Full visa and relocation support for China</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                    &#10003;
                  </span>
                  <span className="text-gray-700">Ongoing career guidance and cultural integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                    &#10003;
                  </span>
                  <span className="text-gray-700">Established since 2020 with 500+ successful placements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                    &#10003;
                  </span>
                  <span className="text-gray-700">Partnerships with leading schools across China</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/international_school_campus.jpg"
                alt="Beautiful international school campus in China where EduConnect places teachers"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partner Schools Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Partner Schools Across China
            </h2>
            <p className="text-xl text-gray-600">
              We work with leading international schools in Shanghai, Beijing, Shenzhen, and Guangzhou
            </p>
          </div>
        </div>
        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrolling track - needs inline-flex and min-w-max for seamless loop */}
          <div className="inline-flex animate-marquee" style={{ minWidth: 'max-content' }}>
            {/* First set of logos */}
            <div className="flex items-center gap-12 px-6">
              {partnerSchools.map((school, index) => (
                <div key={`first-${index}`} className="relative w-36 h-20 flex-shrink-0">
                  <Image
                    src={school.src}
                    alt={school.alt}
                    fill
                    className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center gap-12 px-6">
              {partnerSchools.map((school, index) => (
                <div key={`second-${index}`} className="relative w-36 h-20 flex-shrink-0">
                  <Image
                    src={school.src}
                    alt={school.alt}
                    fill
                    className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section id="opportunities" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
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

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from teachers who&apos;ve transformed their careers
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full max-w-[340px]"
              >
                <div className="flex flex-col h-full text-center">
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-brand-red/20 mb-3">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-brand-red">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed flex-grow text-[15px]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about teaching in China
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-sm">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 max-w-7xl text-center">
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
