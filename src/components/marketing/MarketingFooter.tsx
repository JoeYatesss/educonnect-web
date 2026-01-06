import Link from 'next/link';

export default function MarketingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-brand-red transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about#mission" className="hover:text-brand-red transition-colors duration-200">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/about#how-it-works" className="hover:text-brand-red transition-colors duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-red transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Teachers Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Teachers</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/requirements" className="hover:text-brand-red transition-colors duration-200">
                  Requirements
                </Link>
              </li>
              <li>
                <Link href="/integration-guide" className="hover:text-brand-red transition-colors duration-200">
                  China Integration Guide
                </Link>
              </li>
              <li>
                <Link href="/language-course" className="hover:text-brand-red transition-colors duration-200">
                  Survival Chinese Course
                </Link>
              </li>
              <li>
                <Link href="/teacher-resources" className="hover:text-brand-red transition-colors duration-200">
                  Teacher Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal & Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal#privacy" className="hover:text-brand-red transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal#terms" className="hover:text-brand-red transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal#cookies" className="hover:text-brand-red transition-colors duration-200">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-red transition-colors duration-200">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="mb-2">&copy; 2025 EduConnect Asia Ltd. All rights reserved.</p>
          <p className="text-sm text-gray-500">
            71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ
          </p>
        </div>
      </div>
    </footer>
  );
}
