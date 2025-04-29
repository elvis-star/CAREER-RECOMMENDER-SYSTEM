import nodemailer from 'nodemailer';
import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize environment variables
const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY;
const MAILJET_FROM_EMAIL =
  process.env.MAILJET_FROM_EMAIL || process.env.EMAIL_FROM_ADDRESS;
const MAILJET_FROM_NAME =
  process.env.MAILJET_FROM_NAME ||
  process.env.EMAIL_FROM_NAME ||
  'Career Recommender';

const NODEMAILER_EMAIL = process.env.AUTH_EMAIL || process.env.EMAIL_USERNAME;
const NODEMAILER_PASSWORD =
  process.env.AUTH_PASSWORD || process.env.EMAIL_PASSWORD;
const NODEMAILER_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
const NODEMAILER_HOST = process.env.EMAIL_HOST;
const NODEMAILER_PORT = process.env.EMAIL_PORT;

const LOGO_URL = process.env.LOGO_URL || 'https://via.placeholder.com/150';

// Initialize Nodemailer transport
const createNodemailerTransport = () => {
  // If service is specified, use it
  if (NODEMAILER_SERVICE && NODEMAILER_SERVICE !== 'custom') {
    return nodemailer.createTransport({
      service: NODEMAILER_SERVICE,
      secure: false,
      auth: {
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Otherwise use custom SMTP settings
  return nodemailer.createTransport({
    host: NODEMAILER_HOST,
    port: NODEMAILER_PORT,
    secure: NODEMAILER_PORT === '465',
    auth: {
      user: NODEMAILER_EMAIL,
      pass: NODEMAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Initialize Mailjet client if credentials are available
const getMailjetClient = () => {
  if (MAILJET_API_KEY && MAILJET_SECRET_KEY) {
    return Mailjet.apiConnect(MAILJET_API_KEY, MAILJET_SECRET_KEY);
  }
  return null;
};

// Email templates
const emailTemplates = {
  // Base template with header and footer
  baseTemplate: (content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
       <img src="${LOGO_URL}" alt="Career Recommender" style="max-width: 150px; height: auto;" />
    </div>
    ${content}
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 12px;">
      <p>© ${new Date().getFullYear()} Career Recommender. All rights reserved.</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
`,

  // Welcome email template
  welcome: (name) => `
  <h2 style="color: #333; text-align: center;">Welcome to Career Recommender!</h2>
  <p style="color: #555; font-size: 16px;">Hello ${name},</p>
  <p style="color: #555; font-size: 16px;">
    Thank you for creating an account with Career Recommender. We're excited to help you discover the perfect career path!
  </p>
  <p style="color: #555; font-size: 16px;">
    You can now log in to your account to input your KCSE results and get personalized career recommendations.
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" 
       style="background-color: #0080ff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      Explore Careers
    </a>
  </div>
`,

  // Password reset template
  resetPassword: (resetLink) => `
  <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
  <p style="color: #555; font-size: 16px;">
    We received a request to reset your password. Click the button below to set a new password:
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${resetLink}" 
       style="background-color: #0080ff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      Reset Password
    </a>
  </div>
  <p style="color: #555; font-size: 14px;">
    If you did not request a password reset, please ignore this email or contact support if you have concerns.
  </p>
  <p style="color: #555; font-size: 14px;">
    This link will expire in 10 minutes for security reasons.
  </p>
`,

  // Email verification template
  verifyEmail: (verificationLink) => `
  <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
  <p style="color: #555; font-size: 16px;">
    Thank you for registering! Please verify your email address to complete your registration.
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${verificationLink}" 
       style="background-color: #0080ff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      Verify Email
    </a>
  </div>
  <p style="color: #555; font-size: 14px;">
    If you did not create an account, please ignore this email.
  </p>
`,

  // Account notification template
  accountNotification: (message) => `
  <h2 style="color: #333; text-align: center;">Account Notification</h2>
  <p style="color: #555; font-size: 16px;">
    ${message}
  </p>
`,

  // Career recommendation template
  careerRecommendation: (name, careers) => `
  <h2 style="color: #333; text-align: center;">Your Career Recommendations</h2>
  <p style="color: #555; font-size: 16px;">Hello ${name},</p>
  <p style="color: #555; font-size: 16px;">
    Based on your KCSE results, we've generated personalized career recommendations for you:
  </p>
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <h3 style="color: #0080ff; margin-top: 0;">Top Recommendations:</h3>
    <ul>
      ${careers
        .map(
          (career) => `
        <li style="margin-bottom: 10px;">
          <strong>${career.title}</strong> - ${career.match}% match
          <div style="font-size: 14px; color: #666;">${career.description.substring(
            0,
            100
          )}...</div>
        </li>
      `
        )
        .join('')}
    </ul>
  </div>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${
      process.env.CLIENT_URL || 'http://localhost:3000'
    }/recommendations" 
       style="background-color: #0080ff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      View Detailed Recommendations
    </a>
  </div>
`,

  // Account locked template
  accountLocked: (unlockTime) => `
  <h2 style="color: #333; text-align: center;">Account Temporarily Locked</h2>
  <p style="color: #555; font-size: 16px;">
    For security reasons, your account has been temporarily locked due to multiple failed login attempts.
  </p>
  <p style="color: #555; font-size: 16px;">
    You can try again after ${unlockTime} or use the password reset option below.
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${
      process.env.CLIENT_URL || 'http://localhost:3000'
    }/forgot-password" 
       style="background-color: #0080ff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      Reset Password
    </a>
  </div>
  <p style="color: #555; font-size: 14px;">
    If you did not attempt to log in, please reset your password immediately as someone may be trying to access your account.
  </p>
`,

  // Security alert template
  securityAlert: (activity, time, location) => `
  <h2 style="color: #333; text-align: center;">Security Alert</h2>
  <p style="color: #555; font-size: 16px;">
    We detected a security-related activity on your account that you should be aware of:
  </p>
  <div style="background-color: #fff4f4; border-left: 4px solid #ff4d4f; padding: 15px; margin: 20px 0;">
    <p style="margin: 0; color: #333; font-weight: bold;">Activity: ${activity}</p>
    <p style="margin: 5px 0 0; color: #666;">Time: ${time}</p>
    <p style="margin: 5px 0 0; color: #666;">Location: ${location}</p>
  </div>
  <p style="color: #555; font-size: 16px;">
    If this was you, you can ignore this message. If you didn't perform this action, please secure your account immediately.
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${
      process.env.CLIENT_URL || 'http://localhost:3000'
    }/reset-password" 
       style="background-color: #ff4d4f; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      Secure My Account
    </a>
  </div>
`,
  adminInvitation: (data) => `
  <h2 style="color: #333; text-align: center;">Admin Invitation</h2>
  <p style="color: #555; font-size: 16px;">Hello ${data.name},</p>
  <p style="color: #555; font-size: 16px;">
    You have been invited by ${data.inviterName} to join the Career Recommender System as an administrator.
  </p>
  <p style="color: #555; font-size: 16px;">
    As an administrator, you will have access to manage users, careers, institutions, and system settings.
  </p>
  <p style="color: #555; font-size: 16px;">
    To accept this invitation and create your admin account, please click the button below:
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${data.invitationURL}" 
       style="background-color: #0080ff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      Accept Invitation
    </a>
  </div>
  <p style="color: #555; font-size: 14px;">
    This invitation link will expire in 7 days.
  </p>
  <p style="color: #555; font-size: 14px;">
    If you did not expect this invitation or believe it was sent in error, please ignore this email.
  </p>
`,
};

// Send email via Mailjet
const sendMailjetEmail = async (to, subject, htmlContent) => {
  const mailjetClient = getMailjetClient();

  if (!mailjetClient) {
    throw new Error('Mailjet credentials not configured');
  }

  const request = mailjetClient.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: MAILJET_FROM_EMAIL,
          Name: MAILJET_FROM_NAME,
        },
        To: [
          {
            Email: to,
          },
        ],
        Subject: subject,
        HTMLPart: htmlContent,
      },
    ],
  });

  try {
    const result = await request;
    console.log('Email sent successfully via Mailjet');
    return result;
  } catch (err) {
    console.error('Failed to send email via Mailjet', err);
    throw new Error(`Failed to send email via Mailjet: ${err.message}`);
  }
};

// Send email via Nodemailer
const sendNodemailerEmail = async (to, subject, htmlContent) => {
  const transport = createNodemailerTransport();

  try {
    const result = await transport.sendMail({
      from: `"${MAILJET_FROM_NAME}" <${NODEMAILER_EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log('Email sent successfully via Nodemailer');
    return result;
  } catch (err) {
    console.error('Failed to send email via Nodemailer', err);
    throw new Error(`Failed to send email via Nodemailer: ${err.message}`);
  }
};

// Main email sending function with fallback
export const sendEmail = async (options) => {
  const { email, subject, template, templateData } = options;

  // If template is provided, use it
  if (template) {
    // Get the template function
    const templateFn = emailTemplates[template];

    if (!templateFn) {
      throw new Error(`Email template "${template}" not found`);
    }

    // Generate the HTML content
    const templateContent = templateFn(templateData);
    const htmlContent = emailTemplates.baseTemplate(templateContent);

    // Try to send via Mailjet first, then fall back to Nodemailer
    try {
      if (MAILJET_API_KEY && MAILJET_SECRET_KEY) {
        return await sendMailjetEmail(email, subject, htmlContent);
      } else {
        return await sendNodemailerEmail(email, subject, htmlContent);
      }
    } catch (mailjetError) {
      console.error(
        'Primary email service failed, trying fallback',
        mailjetError
      );

      try {
        return await sendNodemailerEmail(email, subject, htmlContent);
      } catch (nodemailerError) {
        console.error('Both email services failed', nodemailerError);
        throw new Error('Failed to send email through all available methods');
      }
    }
  } else {
    // For backward compatibility with the original implementation
    // that just takes a message
    const htmlContent = emailTemplates.baseTemplate(`
    <p style="color: #555; font-size: 16px;">${options.message}</p>
  `);

    try {
      if (MAILJET_API_KEY && MAILJET_SECRET_KEY) {
        return await sendMailjetEmail(email, subject, htmlContent);
      } else {
        return await sendNodemailerEmail(email, subject, htmlContent);
      }
    } catch (error) {
      console.error('Email sending failed', error);
      throw new Error('Failed to send email');
    }
  }
};

// Specific email sending functions
export const sendWelcomeEmail = async (email, name) => {
  return sendEmail({
    email,
    subject: 'Welcome to Career Recommender',
    template: 'welcome',
    templateData: name,
  });
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  return sendEmail({
    email,
    subject: 'Reset Your Password',
    template: 'resetPassword',
    templateData: resetLink,
  });
};

export const sendVerificationEmail = async (email, verificationLink) => {
  return sendEmail({
    email,
    subject: 'Verify Your Email Address',
    template: 'verifyEmail',
    templateData: verificationLink,
  });
};

export const sendAccountNotification = async (email, message) => {
  return sendEmail({
    email,
    subject: 'Account Notification',
    template: 'accountNotification',
    templateData: message,
  });
};

export const sendRecommendationEmail = async (email, name, careers) => {
  return sendEmail({
    email,
    subject: 'Your Career Recommendations',
    template: 'careerRecommendation',
    templateData: { name, careers },
  });
};

export const sendAccountLockedEmail = async (email, unlockTime) => {
  return sendEmail({
    email,
    subject: 'Account Temporarily Locked',
    template: 'accountLocked',
    templateData: unlockTime,
  });
};

export const sendSecurityAlertEmail = async (
  email,
  activity,
  time,
  location
) => {
  return sendEmail({
    email,
    subject: 'Security Alert - Action Required',
    template: 'securityAlert',
    templateData: { activity, time, location },
  });
};

// Add this function to your existing email.js file

// Send admin invitation email
export const sendAdminInvitation = async (
  email,
  name,
  invitationURL,
  inviterName
) => {
  return sendEmail({
    email,
    subject: "You've been invited to join as an administrator",
    template: 'adminInvitation',
    templateData: { name, invitationURL, inviterName },
  });
};
