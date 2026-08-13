import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || '');
}

const FROM_EMAIL = 'noreply@aponairtravels.com';

interface SendEmailParams {
  to: string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  return getResend().emails.send({
    from: `Apon Air Travels <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return sendEmail({
    to: [process.env.ADMIN_EMAIL || 'info@aponairtravels.com'],
    subject: `New Contact: ${data.subject}`,
    html: `
      <h2>New Contact Enquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  });
}
