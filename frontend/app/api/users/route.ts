import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const operations = await prisma.counterOperation.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      take: 50 // Limit to last 50 operations
    })
    
    return NextResponse.json({ operations })
  } catch (error) {
    console.error('获取计数器操作失败:', error)
    return NextResponse.json(
      { error: '获取计数器操作失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { operation, value, txHash } = body
    
    if (!operation) {
      return NextResponse.json(
        { error: '操作类型是必填项' },
        { status: 400 }
      )
    }
    
    const counterOperation = await prisma.counterOperation.create({
      data: {
        operation,
        value: value || null,
        txHash: txHash || null
      }
    })
    
    return NextResponse.json({ counterOperation }, { status: 201 })
  } catch (error) {
    console.error('记录计数器操作失败:', error)
    return NextResponse.json(
      { error: '记录计数器操作失败' },
      { status: 500 }
    )
  }
}
