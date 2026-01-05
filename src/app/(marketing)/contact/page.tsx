import { Metadata } from 'next';
import { ContactForm } from '@/components/marketing/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch | EduConnect',
  description: 'Have questions about teaching in China? Contact EduConnect for support with applications, visa assistance, and teaching opportunities.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-20 bg-slate-50 border-b border-gray-200">
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
          <ContactForm />

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
