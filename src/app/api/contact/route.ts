import { NextRequest, NextResponse } from 'next/server';
import { createAnonClient } from '@/lib/supabase/anon';

// RFC 5322 compliant email regex (simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Max lengths for input validation
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

// Common disposable email domains to block
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'guerrillamail.org',
  'mailinator.com', 'maildrop.cc', 'tempail.com', 'fakeinbox.com',
  '10minutemail.com', '10minmail.com', 'temp-mail.org', 'tempmailo.com',
  'getnada.com', 'trashmail.com', 'mohmal.com', 'yopmail.com', 'yopmail.fr',
  'sharklasers.com', 'grr.la', 'guerrillamail.info', 'pokemail.net',
  'spam4.me', 'bccto.me', 'discard.email', 'discardmail.com', 'spamgourmet.com',
  'mytrashmail.com', 'mt2009.com', 'thankyou2010.com', 'trash2009.com',
  'mailnesia.com', 'mailnull.com', 'e4ward.com', 'spamex.com', 'getairmail.com',
  'anonymbox.com', 'tempinbox.com', 'tempr.email', 'dispostable.com',
  'mintemail.com', 'emailondeck.com', 'incognitomail.org', 'mailcatch.com',
]);

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1];
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Honeypot check - if 'website' field is filled, it's likely a bot
    if (body.website) {
      // Silently reject bot submissions with fake success
      return NextResponse.json(
        { success: true, message: 'Message sent successfully!' },
        { status: 201 }
      );
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate types
    if (typeof name !== 'string' || typeof email !== 'string' ||
        typeof subject !== 'string' || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid field types' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.length > MAX_NAME_LENGTH ||
        email.length > MAX_EMAIL_LENGTH ||
        subject.length > MAX_SUBJECT_LENGTH ||
        message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: 'One or more fields exceed maximum length' },
        { status: 400 }
      );
    }

    // Validate email format
    const normalizedEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Block disposable email addresses
    if (isDisposableEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please use a permanent email address, not a disposable one' },
        { status: 400 }
      );
    }

    const supabase = createAnonClient();
    const ip_address = getClientIp(request);
    const user_agent = request.headers.get('user-agent') || 'unknown';

    // Call the secure database function that handles rate limiting and duplicate checks
    const { data, error } = await supabase.rpc('submit_contact_form', {
      p_name: name.trim(),
      p_email: normalizedEmail,
      p_subject: subject.trim(),
      p_message: message.trim(),
      p_ip_address: ip_address,
      p_user_agent: user_agent,
    });

    if (error) {
      console.error('Contact form submission error:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    // Handle response from database function
    if (!data.success) {
      const statusCode = data.code === 'RATE_LIMITED' || data.code === 'DUPLICATE' ? 429 : 400;
      return NextResponse.json(
        { error: data.error },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: data.message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
