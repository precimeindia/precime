import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, phone } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and Phone number are required' },
        { status: 400 }
      );
    }

    const destinationEmail = process.env.DESTINATION_EMAIL;
    
    if (!destinationEmail) {
       console.error("DESTINATION_EMAIL environment variable is not set.");
       return NextResponse.json(
         { error: 'Server configuration error.' },
         { status: 500 }
       );
    }

    // Send the email
    const data = await resend.emails.send({
      from: 'Precime Contact Form <onboarding@resend.dev>', // You should verify a domain in Resend for production
      to: [destinationEmail],
      subject: `New Contact Request: ${name}`,
      html: `
        <h2>New Contact Request</h2>
        <p>You have received a new contact request from the website.</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Phone Number:</strong> ${phone}</li>
        </ul>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
