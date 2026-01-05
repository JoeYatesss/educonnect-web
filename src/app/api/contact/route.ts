import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// RFC 5322 compliant email regex (simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Max lengths for input validation
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Basic honeypot check - if 'website' field is filled, it's likely a bot
    const body = await request.clone().json();
    if (body.website) {
      // Silently reject bot submissions
      return NextResponse.json(
        { success: true, message: 'Message sent successfully!' },
        { status: 201 }
      );
    }

    const supabase = await createClient();

    // Get IP address and user agent for tracking
    const ip_address = request.headers.get('x-forwarded-for') ||
                       request.headers.get('x-real-ip') ||
                       'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';

    // Insert contact form submission
    const { data, error } = await supabase
      .from('contact_form_submissions')
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          subject: subject.trim(),
          message: message.trim(),
          ip_address,
          user_agent,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Contact form submission error:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully!',
        data,
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
