import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legal Information | Privacy & Terms | EduConnect',
  description: 'EduConnect legal information including privacy policy, terms of service, and cookies policy. Learn how we protect your data and privacy.',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-20 bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Legal Information
          </h1>
          <p className="text-lg text-gray-600">
            Effective Date: September 6, 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

          {/* Privacy Policy */}
          <div id="privacy" className="mb-16 scroll-mt-24">
            <h2 className="font-montserrat text-4xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-brand-red inline-block">
              Privacy Policy
            </h2>

            <div className="space-y-8 mt-8">
              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">1. Data Controller</h3>
                <div className="bg-slate-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-700"><strong>EduConnect Asia Ltd</strong></p>
                  <p className="text-gray-700">Address: 71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ</p>
                  <p className="text-gray-700">Data Protection Officer: team@educonnectchina.com</p>
                </div>
              </div>

              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h3>
                <p className="text-gray-700 mb-4">We collect and process the following types of personal data:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red mt-1">•</span>
                    <span><strong>Registration Information:</strong> Name, email address, phone number, nationality, teaching qualifications, and experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red mt-1">•</span>
                    <span><strong>Profile Data:</strong> CV/Resume, educational background, work history, references</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red mt-1">•</span>
                    <span><strong>Communication Data:</strong> Messages, emails, and correspondence with our team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red mt-1">•</span>
                    <span><strong>Technical Data:</strong> IP address, browser type, device information, and usage analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red mt-1">•</span>
                    <span><strong>Cookies:</strong> Session data and preferences (see Cookies section below)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">3. Legal Basis for Processing</h3>
                <p className="text-gray-700 mb-4">We process your personal data under the following legal bases:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red mt-1">•</span>
                    <span><strong>Consent:</strong> When you provide explicit consent for marketing communications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red mt-1">•</span>
                    <span><strong>Contract:</strong> To fulfill our services and match you with teaching opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red mt-1">•</span>
                    <span><strong>Legitimate Interests:</strong> To improve our services and prevent fraud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red mt-1">•</span>
                    <span><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">4. How We Use Your Information</h3>
                <p className="text-gray-700 mb-4">We use your personal data to:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Match you with suitable teaching positions in China</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Communicate with schools and educational institutions on your behalf</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Provide relocation and visa support services</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Send relevant job opportunities and updates (with consent)</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Improve our services and user experience</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Comply with legal and regulatory requirements</span></li>
                </ul>
              </div>

              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">5. Your Rights Under GDPR</h3>
                <p className="text-gray-700 mb-4">You have the following rights regarding your personal data:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Right of Access:</strong> Request a copy of your personal data</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Right of Rectification:</strong> Correct inaccurate or incomplete data</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Right of Erasure:</strong> Request deletion of your personal data</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Right to Restrict Processing:</strong> Limit how we process your data</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Right to Data Portability:</strong> Receive your data in a structured format</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Right to Object:</strong> Object to processing based on legitimate interests</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing communications</span></li>
                </ul>
                <p className="text-gray-700 mt-4">To exercise these rights, contact us at privacy@educonnect.asia</p>
              </div>
            </div>
          </div>

          {/* Terms of Service */}
          <div id="terms" className="mb-16 scroll-mt-24">
            <h2 className="font-montserrat text-4xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-brand-red inline-block">
              Terms of Service
            </h2>

            <div className="space-y-8 mt-8">
              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h3>
                <p className="text-gray-700">By accessing and using EduConnect's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
              </div>

              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h3>
                <p className="text-gray-700 mb-4">EduConnect provides:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Matching services between qualified teachers and educational institutions in China</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Visa and relocation support services</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Career guidance and cultural support</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Ongoing assistance during your teaching placement</span></li>
                </ul>
              </div>

              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">3. Eligibility</h3>
                <p className="text-gray-700 mb-4">To use our services, you must:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Be at least 18 years old</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Hold relevant teaching qualifications</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Be legally eligible to work in China</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span>Provide accurate and complete information</span></li>
                </ul>
              </div>

              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">6. Fees and Payments</h3>
                <p className="text-gray-700">Our core matching service is provided at no cost to teachers. Additional services may incur fees, which will be clearly communicated before any charges are made.</p>
              </div>

              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h3>
                <p className="text-gray-700">EduConnect shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our liability is limited to the maximum extent permitted by law.</p>
              </div>
            </div>
          </div>

          {/* Cookies Policy */}
          <div id="cookies" className="mb-16 scroll-mt-24">
            <h2 className="font-montserrat text-4xl font-bold text-gray-900 mb-8 pb-3 border-b-4 border-brand-red inline-block">
              Cookies Policy
            </h2>

            <div className="space-y-8 mt-8">
              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h3>
                <p className="text-gray-700">Cookies are small text files stored on your device when you visit our website. They help us provide you with a better user experience and analyze how our site is used.</p>
              </div>

              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">2. Types of Cookies We Use</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-montserrat text-xl font-semibold text-gray-900 mb-3">Essential Cookies</h4>
                    <p className="text-gray-700 mb-2">These cookies are necessary for the website to function and cannot be switched off:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Session cookies:</strong> Maintain your login status and form data</span></li>
                      <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Security cookies:</strong> Protect against fraud and security threats</span></li>
                      <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Load balancing cookies:</strong> Ensure optimal site performance</span></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-montserrat text-xl font-semibold text-gray-900 mb-3">Analytics Cookies</h4>
                    <p className="text-gray-700 mb-2">These cookies help us understand how visitors interact with our site:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Umami Analytics:</strong> Track page views, user behavior, and site performance (privacy-focused, GDPR compliant)</span></li>
                      <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Conversion tracking:</strong> Measure the effectiveness of our services</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-gray-900 mb-4">3. Managing Cookies</h3>
                <p className="text-gray-700 mb-4">You can control cookies through:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Browser settings:</strong> Most browsers allow you to block or delete cookies</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Cookie consent banner:</strong> Adjust preferences when you first visit our site</span></li>
                  <li className="flex items-start gap-2"><span className="text-brand-red mt-1">•</span><span><strong>Opt-out tools:</strong> Use industry standard opt-out mechanisms</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-slate-50 rounded-xl p-8 border border-gray-200">
            <h2 className="font-montserrat text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>For general inquiries:</strong> info@educonnect.asia</p>
              <p><strong>For privacy matters:</strong> privacy@educonnect.asia</p>
              <p><strong>For legal matters:</strong> legal@educonnect.asia</p>
              <p><strong>For cookie preferences:</strong> cookies@educonnect.asia</p>
            </div>
            <p className="text-gray-700 mt-4">You can also contact our Data Protection Officer directly for any privacy-related concerns.</p>
            <p className="text-gray-600 mt-6"><strong>Last updated:</strong> September 6, 2024</p>
            <p className="text-gray-600 mt-2">We may update this legal information from time to time. Any changes will be posted on this page with an updated effective date.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
