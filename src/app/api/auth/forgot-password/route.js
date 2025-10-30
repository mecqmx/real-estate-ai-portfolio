// src/app/api/auth/forgot-password/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto'; // To generate secure tokens
import nodemailer from 'nodemailer'; // To send emails (simulated for now)

const prisma = new PrismaClient();

// Mail transporter configuration (PLACEHOLDER - YOU MUST CONFIGURE THIS FOR PRODUCTION)
// For development, you can use Ethereal Mail (https://ethereal.email/) or Mailtrap.io
// Or just log the email to the console.
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email", // Example host (for development)
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "user@ethereal.email", // Replace with your Ethereal/Mailtrap user
    pass: "your_password", // Replace with your Ethereal/Mailtrap password
  },
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // For security, we don't reveal if the email exists or not.
      // We always respond with a generic success message.
      console.log(`Password reset requested for non-existent or unverified email: ${email}`);
      return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Delete old tokens for this user to avoid token spam
    await prisma.passwordResetToken.deleteMany({
      where: { email: user.email },
    });

    // Save the new token to the database
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        email: user.email,
        expires: tokenExpires,
      },
    });

    // --- Send the email (SIMULATED FOR NOW) ---
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: '"Real Estate App" <no-reply@realestate.com>',
      to: user.email,
      subject: 'Password Reset Request for Your Real Estate App Account',
      html: `
        <p>Hello ${user.name || user.email},</p>
        <p>You have requested to reset the password for your Real Estate App account.</p>
        <p>Please click on the following link to reset your password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you,</p>
        <p>The Real Estate App Team</p>
      `,
    };

    // Uncomment the following lines to send emails in development/production
    // await transporter.sendMail(mailOptions);
    console.log(`Password reset email simulated for ${user.email}. Link: ${resetUrl}`);

    return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error("Error requesting password reset:", error);
    return NextResponse.json({ message: 'Failed to process password reset request.', error: error.message }, { status: 500 });
  }
}