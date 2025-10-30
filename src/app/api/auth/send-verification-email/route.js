// src/app/api/auth/send-verification-email/route.js
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
      console.log(`Verification email requested for non-existent email: ${email}`);
      return NextResponse.json({ message: 'If an account with that email exists, a verification link has been sent.' }, { status: 200 });
    }

    // If the email is already verified, do nothing
    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email is already verified.' }, { status: 200 });
    }

    // Generate a secure token (NextAuth.js uses a specific format for VerificationToken)
    // To simplify, we'll generate a simple token and save it.
    // NextAuth.js has its own way of generating and cleaning up verification tokens,
    // but for a manual flow, this works.
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 3600000); // Token valid for 24 hours

    // Delete old verification tokens for this user (identifier is the email)
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email },
    });

    // Save the new token to the database
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires: tokenExpires,
      },
    });

    // --- Send the email (SIMULATED FOR NOW) ---
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;

    const mailOptions = {
      from: '"Real Estate App Demo" <no-reply@realestatedemo.com>',
      to: user.email,
      subject: 'Verify Your Email for Real Estate App Demo',
      html: `
        <p>Hello ${user.name || user.email},</p>
        <p>Thank you for registering with Real Estate App Demo.</p>
        <p>Please click on the following link to verify your email address:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not register for this account, please ignore this email.</p>
        <p>Thank you,</p>
        <p>The Real Estate App Demo Team</p>
      `,
    };

    // Uncomment the following lines to send emails in development/production
    // await transporter.sendMail(mailOptions);
    console.log(`Verification email simulated for ${user.email}. Link: ${verificationUrl}`);

    return NextResponse.json({ message: 'If an account with that email exists, a verification link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json({ message: 'Failed to process verification email request.', error: error.message }, { status: 500 });
  }
}