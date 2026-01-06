import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Teacher Resources | Tools & Apps for Teaching in China',
  description: 'Essential resources for teachers in China: language learning apps, classroom management tools, teaching platforms, and guides to help you thrive in your international teaching career.',
};

const resources = [
  {
    category: 'Language Learning',
    description: 'Master Mandarin to connect with students, colleagues, and your local community',
    items: [
      {
        name: 'SaraSpeak',
        description: 'AI-powered Mandarin learning app designed for expats in China. Practice speaking with realistic conversations, get instant pronunciation feedback, and learn practical phrases for daily life.',
        link: 'https://apps.apple.com/gb/app/saraspeak/id6752782936',
        linkText: 'Download on App Store',
        icon: '🗣️',
        highlight: true,
      },
    ],
  },
  {
    category: 'Teaching & Classroom Tools',
    description: 'Platforms to help you teach effectively and manage your classroom',
    items: [
      {
        name: 'GuideLight',
        description: 'Complete teaching platform for tracking student progress, creating assessments, assigning homework, automated marking, and generating insights. Perfect for managing your classroom in China.',
        link: 'https://guidelight.live',
        linkText: 'Explore GuideLight',
        icon: '🎓',
        highlight: true,
      },
      {
        name: 'Teach Anything Now',
        description: 'Comprehensive teaching resources, lesson plans, and professional development materials for international educators.',
        link: 'https://teachanythingnow.com',
        linkText: 'Browse Resources',
        icon: '📚',
        highlight: true,
      },
    ],
  },
  {
    category: 'Living in China',
    description: 'Essential apps and resources for daily life as an expat in China',
    items: [
      {
        name: 'WeChat',
        description: 'Essential for communication, payments, and daily life in China. Connect with colleagues, parents, and local services.',
        link: 'https://www.wechat.com/',
        linkText: 'Download WeChat',
        icon: '💬',
      },
      {
        name: 'Alipay',
        description: 'Mobile payment app used everywhere in China. Link your bank account to pay for almost anything.',
        link: 'https://global.alipay.com/',
        linkText: 'Get Alipay',
        icon: '💳',
      },
      {
        name: 'Didi',
        description: 'China\'s ride-hailing app. Easy taxi booking with English interface available.',
        link: 'https://www.didiglobal.com/',
        linkText: 'Download Didi',
        icon: '🚗',
      },
      {
        name: 'Meituan',
        description: 'Food delivery, restaurant bookings, and local services. A lifesaver for busy teachers.',
        link: 'https://about.meituan.com/',
        linkText: 'Learn More',
        icon: '🍜',
      },
    ],
  },
  {
    category: 'Professional Development',
    description: 'Continue growing as an educator with these resources',
    items: [
      {
        name: 'Coursera for Campus',
        description: 'Access world-class courses from top universities to enhance your teaching skills.',
        link: 'https://www.coursera.org/',
        linkText: 'Browse Courses',
        icon: '🎯',
      },
      {
        name: 'Edutopia',
        description: 'Research-based teaching strategies, classroom tips, and innovative education practices.',
        link: 'https://www.edutopia.org/',
        linkText: 'Visit Edutopia',
        icon: '💡',
      },
      {
        name: 'TES Resources',
        description: 'Vast library of lesson plans, worksheets, and teaching materials shared by educators worldwide.',
        link: 'https://www.tes.com/teaching-resources',
        linkText: 'Find Resources',
        icon: '📝',
      },
    ],
  },
  {
    category: 'Health & Wellbeing',
    description: 'Take care of yourself while teaching abroad',
    items: [
      {
        name: 'International SOS',
        description: 'Medical and security assistance for expats. Many international schools provide coverage.',
        link: 'https://www.internationalsos.com/',
        linkText: 'Learn More',
        icon: '🏥',
      },
      {
        name: 'Headspace',
        description: 'Meditation and mindfulness app to manage stress and maintain work-life balance.',
        link: 'https://www.headspace.com/',
        linkText: 'Try Headspace',
        icon: '🧘',
      },
    ],
  },
];

export default function TeacherResourcesPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-20 bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Teacher Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Essential tools, apps, and resources to help you thrive as a teacher in China
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="bg-brand-red/5 border border-brand-red/20 rounded-xl p-8">
            <h2 className="font-montserrat text-2xl font-bold text-gray-900 mb-4">
              Setting Yourself Up for Success
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Moving to China for your teaching career is an exciting adventure. We&apos;ve curated these resources
              to help you settle in quickly, teach effectively, and make the most of your experience. From
              language learning apps to classroom management tools, these are the essentials that experienced
              teachers in China recommend.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {resources.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16 last:mb-0">
              <div className="mb-8">
                <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-2">
                  {category.category}
                </h2>
                <p className="text-gray-600">
                  {category.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                      item.highlight
                        ? 'bg-brand-red/5 border-brand-red/30 hover:border-brand-red'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl flex-shrink-0">{item.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl text-gray-900 mb-2">
                          {item.name}
                          {item.highlight && (
                            <span className="ml-2 text-xs bg-brand-red text-white px-2 py-1 rounded-full">
                              Recommended
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          {item.description}
                        </p>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                            item.highlight
                              ? 'text-brand-red hover:text-red-700'
                              : 'text-gray-700 hover:text-brand-red'
                          }`}
                        >
                          {item.linkText}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EduConnect Resources */}
      <section className="py-16 bg-slate-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-8 text-center">
            EduConnect Resources
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Don&apos;t forget about the resources we provide to help you succeed in China
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/integration-guide"
              className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-brand-red hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">🌏</span>
                <div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">China Integration Guide</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Comprehensive guide covering visas, banking, accommodation, cultural tips, and everything
                    you need to know about settling into life in China.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/language-course"
              className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-brand-red hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">🇨🇳</span>
                <div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">Survival Chinese Course</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Our free Mandarin course designed for teachers, covering essential phrases for school,
                    daily life, and building relationships with students and colleagues.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-montserrat text-3xl font-bold text-white mb-4">
            Ready to Start Your Teaching Journey?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join EduConnect and let us match you with the perfect teaching position in China.
            We&apos;ll support you every step of the way.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/requirements"
              className="px-8 py-4 bg-white text-gray-900 font-semibold rounded hover:bg-gray-100 transition-colors"
            >
              View Requirements
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-brand-red text-white font-semibold rounded hover:bg-red-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
