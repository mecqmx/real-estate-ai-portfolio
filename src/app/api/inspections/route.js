// src/app/api/inspections/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const session = await getServerSession(authOptions);

  // 1. Check if user is authenticated and is an AGENT or ADMIN
  if (!session || !['AGENT', 'ADMIN'].includes(session.user?.role)) {
    return NextResponse.json(
      { message: 'You are not authorized to view inspection requests.' },
      { status: 401 }
    );
  }

  try {
    let inspectionRequests;

    // 2. Fetch requests based on user role
    if (session.user.role === 'ADMIN') {
      // Admins can see all requests
      inspectionRequests = await prisma.inspectionRequest.findMany({
        include: {
          property: { select: { title: true } }, // Include property title
          client: { select: { name: true, email: true } }, // Include client info
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Agents see requests for properties they are assigned to
      inspectionRequests = await prisma.inspectionRequest.findMany({
        where: {
          property: {
            assignedAgents: { some: { agentId: session.user.id } },
          },
        },
        include: {
          property: { select: { title: true } },
          client: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(inspectionRequests, { status: 200 });
  } catch (error) {
    console.error('Error fetching inspection requests:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  try {
    const body = await request.json();
    const { propertyId, name, email, phone, preferredDate, message } = body;

    // 2. Basic validation
    if (!propertyId || !name || !email || !preferredDate) {
      return NextResponse.json(
        { message: 'Missing required fields: propertyId, name, email, and preferredDate are required.' },
        { status: 400 }
      );
    }

    // --- NEW: Server-side format validation ---
    const nameRegex = /^[a-zA-Z\s'-.]{2,100}$/; // Allows letters, spaces, hyphens, apostrophes, dots
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/; // Simple phone number regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex

    if (!nameRegex.test(name)) {
      return NextResponse.json({ message: 'Invalid name format. Only letters, spaces, and hyphens are allowed.' }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format.' }, { status: 400 });
    }

    if (phone && !phoneRegex.test(phone)) {
      return NextResponse.json({ message: 'Invalid phone number format.' }, { status: 400 });
    }
    // --- End of new validation ---

    // 3. Check if the property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { message: `Property with ID ${propertyId} not found.` },
        { status: 404 }
      );
    }

    // 4. Create the inspection request in the database
    const newInspectionRequest = await prisma.inspectionRequest.create({
      data: {
        name,
        email,
        phone, // <-- Pass the phone number
        preferredDate: new Date(preferredDate), // Ensure it's a Date object
        message,
        property: {
          connect: { id: propertyId },
        },
        // If the user is logged in, connect the request to their account
        ...(session?.user?.id ? {
          client: {
            connect: { id: session.user.id },
          },
        } : {}),
        // Status defaults to PENDING as per the schema
      },
    });

    return NextResponse.json(newInspectionRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating inspection request:', error);

    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON in request body.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
