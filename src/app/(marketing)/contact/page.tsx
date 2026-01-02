import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch | EduConnect',
  description: 'Have questions about teaching in China? Contact EduConnect for support with applications, visa assistance, and teaching opportunities.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-32 pb-16 bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about teaching in China? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
            <form className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                >
                  <option value="">Please select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="teaching">Teaching Opportunities</option>
                  <option value="visa">Visa & Documentation</option>
                  <option value="support">Support Services</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  placeholder="Tell us how we can help you..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              {/* Honeypot field - hidden from users but visible to bots */}
              <div className="absolute left-[-9999px] opacity-0 pointer-events-none" aria-hidden="true">
                <label htmlFor="website">Website (leave blank)</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-brand-red text-white font-semibold py-4 px-8 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-xl p-8 border border-gray-200">
              <h3 className="font-montserrat text-xl font-bold text-gray-900 mb-3">
                Quick Response
              </h3>
              <p className="text-gray-700">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-8 border border-gray-200">
              <h3 className="font-montserrat text-xl font-bold text-gray-900 mb-3">
                Direct Support
              </h3>
              <p className="text-gray-700">
                For urgent matters, you can reach us directly at{' '}
                <a href="mailto:team@educonnectchina.com" className="text-brand-red font-semibold hover:underline">
                  team@educonnectchina.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
