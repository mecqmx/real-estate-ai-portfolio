import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper function to upload a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The file content as a buffer.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<object>} - A promise that resolves with the Cloudinary upload result.
 */
async function uploadToCloudinary(fileBuffer, mimeType) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'real-estate-portfolio', // Optional: organize uploads
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(new Error('Failed to upload image to Cloudinary.'));
        }
        resolve(result);
      }
    );

    // Write the buffer to the stream
    uploadStream.end(fileBuffer);
  });
}

export async function POST(req) {
  // 1. Check for user authentication
  const session = await getServerSession(authOptions);
  if (!session || (session.user?.role !== 'AGENT' && session.user?.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // 3. Convert the file to a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 4. Upload the file to Cloudinary
    const uploadResult = await uploadToCloudinary(fileBuffer, file.type);

    // 5. Return the secure URL of the uploaded image
    return NextResponse.json({
      message: 'File uploaded successfully.',
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error('API Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Server error during file upload.' }, { status: 500 });
  }
}