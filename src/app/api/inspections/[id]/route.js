// src/app/api/inspections/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT handler to update the status of an inspection
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  // 1. Check if user is authenticated and is an AGENT or ADMIN
  if (!session || !['AGENT', 'ADMIN'].includes(session.user?.role)) {
    return NextResponse.json(
      { message: 'You are not authorized to update inspection requests.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { status } = body;

    // 2. Validate that status is a valid enum value
    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Invalid status provided.' }, { status: 400 });
    }

    // 3. Find the request to ensure it exists
    const inspectionRequest = await prisma.inspectionRequest.findUnique({
      where: { id },
      include: { property: true } // Include property to check ownership
    });

    if (!inspectionRequest) {
      return NextResponse.json({ message: 'Inspection request not found.' }, { status: 404 });
    }

    // 4. Authorization check for AGENTs
    if (session.user.role === 'AGENT') {
      // Check if the agent is the owner of the property
      if (inspectionRequest.property.ownerId !== session.user.id) {
        return NextResponse.json({ message: 'Forbidden: You do not own this property.' }, { status: 403 });
      }
    }
    // Admins can update any inspection request

    // 5. Update the inspection request status
    const updatedRequest = await prisma.inspectionRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    console.error(`Error updating inspection request ${id}:`, error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
