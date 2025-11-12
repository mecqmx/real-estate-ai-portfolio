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

  // 1. Check if user is authenticated
  if (!session || !session.user) {
    return NextResponse.json(
      { message: 'You must be logged in to request an inspection.' },
      { status: 401 }
    );
  }

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
        client: {
          connect: { id: session.user.id }, // Link to the logged-in user
        },
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
