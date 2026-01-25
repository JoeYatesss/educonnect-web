'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const translations = {
  en: {
    forSchools: 'For Schools',
    tagline: 'The smartest way to hire foreign teachers.',
    stats: {
      vetted: 'Vetted Teachers',
      management: 'Process Management',
    },
    pricing: {
      perYear: 'Per year',
      features: {
        vetted: 'Rigorously vetted teachers',
        management: 'Full hiring process management',
        downloads: 'Downloadable CVs & videos',
        matching: 'Smart candidate matching',
        support: 'Ongoing placement support',
        payment: 'WeChat and Alipay accepted',
      },
      startNow: 'Start Now',
      approx: 'Approx. $1,000 USD / €920 EUR / £790 GBP',
    },
    banner: 'Unlimited hires. One flat annual fee. No per-placement charges.',
    benefits: {
      title: 'Why Schools Choose EduConnect',
      subtitle: 'Everything you need to find and hire qualified teachers',
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Get started in minutes and find your next great teacher.',
      createAccount: 'Create Your Account',
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know',
      items: [
        {
          question: 'How much does it cost?',
          answer: 'Full access costs ¥7,500 (approximately $1,000 USD) per year. This gives you unlimited access to all teacher profiles, contact information, and downloadable CVs.',
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
          question: 'How many teachers can I hire?',
          answer: 'We continuously recruit and vet qualified teachers from around the world. With your subscription, you can hire as many as you need—no limits, no extra fees.',
        },
        {
          question: 'Can I get an invoice for my school?',
          answer: 'Absolutely. During checkout, you can request an invoice payment option. We\'ll send you a formal invoice that you can process through your school\'s finance department.',
        },
      ],
    },
    cta: {
      title: 'Ready to find your next teacher?',
      subtitle: 'Create your account and start browsing qualified teachers today.',
      button: 'Get Started',
    },
    getStarted: 'Get Started',
  },
  zh: {
    forSchools: '学校专区',
    tagline: '招聘外籍教师最智能的方式。',
    stats: {
      vetted: '经过严格审核的教师',
      management: '全流程管理',
    },
    pricing: {
      perYear: '每年',
      features: {
        vetted: '严格审核的教师',
        management: '完整的招聘流程管理',
        downloads: '可下载的简历和视频',
        matching: '智能候选人匹配',
        support: '持续支持服务',
        payment: '支持微信和支付宝',
      },
      startNow: '立即开始',
      approx: '约 $1,000 美元 / €920 欧元 / £790 英镑',
    },
    banner: '无限招聘名额，统一年费，无每次安置费用。',
    benefits: {
      title: '为什么学校选择 EduConnect',
      subtitle: '为您提供寻找和招聘合格教师所需的一切',
    },
    howItWorks: {
      title: '使用流程',
      subtitle: '几分钟内即可开始，找到您的下一位优秀教师。',
      createAccount: '创建账户',
    },
    faq: {
      title: '常见问题',
      subtitle: '您需要了解的一切',
      items: [
        {
          question: '费用是多少？',
          answer: '完整访问费用为每年 ¥7,500（约 $1,000 美元）。您可无限访问所有教师档案、联系信息和可下载的简历。',
        },
        {
          question: '接受哪些付款方式？',
          answer: '我们通过安全的 Stripe 支付系统接受信用卡/借记卡、微信支付和支付宝。我们还为偏好银行转账的学校提供发票付款选项。',
        },
        {
          question: '教师如何审核？',
          answer: '所有教师需提交其资格证明、教学经验、简历和介绍视频。我们会对信息进行验证，确保他们满足在中国教学的基本要求。',
        },
        {
          question: '付款前可以查看教师档案吗？',
          answer: '您可以浏览教师预览信息，包括他们偏好的地点、科目、年龄组和经验水平。包含联系方式和简历在内的完整档案需要付费访问。',
        },
        {
          question: '可以招聘多少教师？',
          answer: '我们持续从世界各地招聘和审核合格教师。通过订阅服务，您可以根据需要招聘任意数量的教师——无限制，无额外费用。',
        },
        {
          question: '可以为学校开具发票吗？',
          answer: '当然可以。在结账时，您可以选择发票付款选项。我们将向您发送正式发票，您可以通过学校的财务部门进行报销。',
        },
      ],
    },
    cta: {
      title: '准备好找到您的下一位教师了吗？',
      subtitle: '立即创建账户，开始浏览合格的教师。',
      button: '开始使用',
    },
    getStarted: '开始使用',
  },
};

const BENEFITS_EN = [
  {
    title: 'Rigorously Vetted Teachers',
    description: 'Every teacher undergoes thorough screening including qualification verification, background checks, and teaching demonstrations.',
  },
  {
    title: 'End-to-End Management',
    description: 'We handle the entire hiring process from initial matching to final placement, saving you time and resources.',
  },
  {
    title: 'Smart Matching',
    description: 'Our algorithm matches teachers to your school based on subjects, age groups, and location preferences.',
  },
  {
    title: 'Quality Guaranteed',
    description: 'We only present candidates who meet our strict standards for international school teaching.',
  },
  {
    title: 'Complete Profiles',
    description: 'Access full profiles including CVs, introduction videos, teaching experience, and qualifications.',
  },
  {
    title: 'Ongoing Support',
    description: 'We support both schools and teachers throughout the placement process and beyond.',
  },
];

const BENEFITS_ZH = [
  {
    title: '严格审核的教师',
    description: '每位教师都经过全面筛选，包括资格验证、背景调查和教学演示。',
  },
  {
    title: '全流程管理',
    description: '我们处理从初始匹配到最终安置的整个招聘流程，为您节省时间和资源。',
  },
  {
    title: '智能匹配',
    description: '我们的算法根据科目、年龄组和地点偏好将教师与您的学校进行匹配。',
  },
  {
    title: '质量保证',
    description: '我们只提供符合我们严格国际学校教学标准的候选人。',
  },
  {
    title: '完整档案',
    description: '可访问完整档案，包括简历、介绍视频、教学经验和资格证明。',
  },
  {
    title: '持续支持',
    description: '我们在安置过程及之后持续为学校和教师提供支持服务。',
  },
];

const STEPS_EN = [
  {
    number: 1,
    title: 'Create Your Account',
    description: 'Sign up with your school details in just a few minutes.',
  },
  {
    number: 2,
    title: 'Browse Teachers',
    description: 'Browse candidates by subject, location preference, age group, and experience level.',
  },
  {
    number: 3,
    title: 'Unlock Full Access',
    description: 'Subscribe to access complete profiles, CVs, and introduction videos.',
  },
  {
    number: 4,
    title: 'We Manage the Process',
    description: 'Select candidates and we handle outreach, coordination, and placement.',
  },
];

const STEPS_ZH = [
  {
    number: 1,
    title: '创建账户',
    description: '使用您的学校详细信息，几分钟内即可完成注册。',
  },
  {
    number: 2,
    title: '浏览教师',
    description: '按科目、地点偏好、年龄组和经验水平浏览候选人。',
  },
  {
    number: 3,
    title: '解锁完整访问',
    description: '订阅服务以访问完整档案、简历和介绍视频。',
  },
  {
    number: 4,
    title: '我们管理流程',
    description: '选择候选人后，我们负责联系、协调和安置工作。',
  },
];

function FAQItem({ question, answer, language }: { question: string; answer: string; language: 'en' | 'zh' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-6 text-left flex justify-between items-center hover:text-brand-red transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-lg font-semibold text-gray-900 pr-8 ${language === 'zh' ? 'font-chinese' : ''}`}>{question}</span>
        <span className={`text-2xl text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p className={`text-gray-600 leading-relaxed ${language === 'zh' ? 'font-chinese' : ''}`}>{answer}</p>
      </div>
    </div>
  );
}

export default function ForSchoolsPage() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    // Load language preference from localStorage
    const savedLang = localStorage.getItem('schools-page-language') as 'en' | 'zh' | null;
    if (savedLang) {
      setLanguage(savedLang);
    }

    // Listen for language changes from the toggle
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('schools-page-language') as 'en' | 'zh' | null;
      if (newLang) {
        setLanguage(newLang);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event (for same-tab updates)
    const handleLanguageChange = (e: CustomEvent) => {
      setLanguage(e.detail);
    };
    window.addEventListener('languageChange' as any, handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange' as any, handleLanguageChange as EventListener);
    };
  }, []);

  const t = translations[language];
  const benefits = language === 'zh' ? BENEFITS_ZH : BENEFITS_EN;
  const steps = language === 'zh' ? STEPS_ZH : STEPS_EN;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center bg-white py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-10">
              <span className="inline-block px-4 py-2 bg-brand-red/10 text-brand-red rounded-full text-sm font-semibold">
                {t.forSchools}
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-gray-900">Find.</span>
                <span className="block text-gray-700 italic">Connect.</span>
                <span className="block text-brand-red">Hire.</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600">
                {t.tagline}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                  <div className={`text-sm text-gray-600 ${language === 'zh' ? 'font-chinese' : ''}`}>{t.stats.vetted}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{language === 'zh' ? '完整' : 'Full'}</div>
                  <div className={`text-sm text-gray-600 ${language === 'zh' ? 'font-chinese' : ''}`}>{t.stats.management}</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/school-signup"
                  className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {t.getStarted}
                </Link>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-gray-200">
              <div className="text-center">
                <div className="text-5xl font-bold text-brand-red mb-2">¥7,500</div>
                <div className={`text-gray-600 mb-6 ${language === 'zh' ? 'font-chinese' : ''}`}>{t.pricing.perYear}</div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className={`text-gray-700 ${language === 'zh' ? 'font-chinese' : ''}`}>{t.pricing.features.vetted}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className={`text-gray-700 ${language === 'zh' ? 'font-chinese' : ''}`}>{t.pricing.features.management}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className={`text-gray-700 ${language === 'zh' ? 'font-chinese' : ''}`}>{t.pricing.features.downloads}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className={`text-gray-700 ${language === 'zh' ? 'font-chinese' : ''}`}>{t.pricing.features.matching}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className={`text-gray-700 ${language === 'zh' ? 'font-chinese' : ''}`}>{t.pricing.features.support}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      &#10003;
                    </span>
                    <span className={`text-gray-700 ${language === 'zh' ? 'font-chinese' : ''}`}>{t.pricing.features.payment}</span>
                  </li>
                </ul>
                <Link
                  href="/school-signup"
                  className="block w-full py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {t.pricing.startNow}
                </Link>
                <p className={`text-sm text-gray-500 mt-4 ${language === 'zh' ? 'font-chinese' : ''}`}>
                  {t.pricing.approx}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database Banner */}
      <section className="py-16 bg-brand-red">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <p className={`text-lg md:text-xl text-white italic ${language === 'zh' ? 'font-chinese' : ''}`}>
            {t.banner}
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 ${language === 'zh' ? 'font-chinese' : ''}`}>
              {t.benefits.title}
            </h2>
            <p className={`text-xl text-gray-600 ${language === 'zh' ? 'font-chinese' : ''}`}>
              {t.benefits.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-red font-bold text-xl">&#10003;</span>
                </div>
                <h3 className={`font-montserrat text-xl font-semibold text-gray-900 mb-3 ${language === 'zh' ? 'font-chinese' : ''}`}>{benefit.title}</h3>
                <p className={`text-gray-600 leading-relaxed ${language === 'zh' ? 'font-chinese' : ''}`}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 ${language === 'zh' ? 'font-chinese' : ''}`}>
                {t.howItWorks.title}
              </h2>
              <p className={`text-xl text-gray-600 leading-relaxed ${language === 'zh' ? 'font-chinese' : ''}`}>
                {t.howItWorks.subtitle}
              </p>
              <div className="space-y-6">
                {steps.map((step) => (
                  <div key={step.number} className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div className="pt-1">
                      <h3 className={`font-semibold text-lg text-gray-900 mb-1 ${language === 'zh' ? 'font-chinese' : ''}`}>{step.title}</h3>
                      <p className={`text-gray-600 ${language === 'zh' ? 'font-chinese' : ''}`}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/school-signup"
                className="inline-block px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t.howItWorks.createAccount}
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
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 ${language === 'zh' ? 'font-chinese' : ''}`}>
              {t.faq.title}
            </h2>
            <p className={`text-xl text-gray-600 ${language === 'zh' ? 'font-chinese' : ''}`}>
              {t.faq.subtitle}
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-slate-50 rounded-xl p-8 border border-gray-200">
            {t.faq.items.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} language={language} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className={`font-montserrat text-4xl md:text-5xl font-bold mb-6 ${language === 'zh' ? 'font-chinese' : ''}`}>
            {t.cta.title}
          </h2>
          <p className={`text-xl text-gray-300 mb-8 max-w-2xl mx-auto ${language === 'zh' ? 'font-chinese' : ''}`}>
            {t.cta.subtitle}
          </p>
          <Link
            href="/school-signup"
            className="inline-block px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {t.cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}
