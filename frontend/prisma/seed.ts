import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始播种数据库...')

  // 清理现有数据
  await prisma.counterOperation.deleteMany()

  // 创建示例计数器操作记录
  const sampleOperations = [
    {
      operation: 'increment',
      txHash: '0x1234567890abcdef1234567890abcdef12345678',
    },
    {
      operation: 'increment',
      txHash: '0x2345678901bcdef23456789012cdef345678901',
    },
    {
      operation: 'decrement',
      txHash: '0x3456789012cdef456789012def456789012345',
    },
    {
      operation: 'set',
      value: 10,
      txHash: '0x456789012def56789012ef56789012345678901',
    },
    {
      operation: 'increment',
      txHash: '0x56789012ef6789012f6789012456789012345678',
    },
  ]

  for (const operation of sampleOperations) {
    await prisma.counterOperation.create({
      data: operation,
    })
  }

  console.log(`✅ 已创建 ${sampleOperations.length} 个示例计数器操作记录`)
  console.log('✅ 数据库播种完成！')
}

main()
  .catch((e) => {
    console.error('❌ 播种失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
