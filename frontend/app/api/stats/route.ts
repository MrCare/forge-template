import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET: Get counter operations and stats
export async function GET() {
  try {
    const operations = await prisma.counterOperation.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50, // Limit to last 50 operations
    });

    const totalOperations = operations.length;
    const incrementCount = operations.filter((op: any) => op.operation === 'increment').length;
    const decrementCount = operations.filter((op: any) => op.operation === 'decrement').length;
    const setCount = operations.filter((op: any) => op.operation === 'set').length;

    return NextResponse.json({
      operations,
      stats: {
        total: totalOperations,
        increment: incrementCount,
        decrement: decrementCount,
        set: setCount
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operations' },
      { status: 500 }
    );
  }
}

// POST: Create a new counter operation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { operation, value } = body;

    const counterOperation = await prisma.counterOperation.create({
      data: {
        operation,
        value,
      },
    });

    return NextResponse.json(counterOperation);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create operation' },
      { status: 500 }
    );
  }
}
