import { NextRequest, NextResponse } from 'next/server';
import { createAnonClient } from '@/lib/supabase/anon';

// RFC 5322 compliant email regex (simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const MAX_EMAIL_LENGTH = 254;

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

function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1];
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email presence
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Validate email length
    if (email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: 'Email address is too long' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
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

    // Call the secure database function
    const { data, error } = await supabase.rpc('subscribe_to_newsletter', {
      p_email: normalizedEmail,
      p_source: 'website',
    });

    if (error) {
      console.error('Newsletter subscription error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    // Handle response from database function
    if (!data.success) {
      return NextResponse.json(
        { error: data.error },
        { status: 409 }
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
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
