import Link from 'next/link';

export default function MarketingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* EduConnect Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">EduConnect</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/integration-guide" className="hover:text-white transition-colors">
                  China Guide
                </Link>
              </li>
              <li>
                <Link href="/language-course" className="hover:text-white transition-colors">
                  Survival Chinese
                </Link>
              </li>
              <li>
                <Link href="/requirements" className="hover:text-white transition-colors">
                  Requirements
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Find Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal#cookies" className="hover:text-white transition-colors">
                  Cookies
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
