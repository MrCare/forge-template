#!/bin/bash

# 数据库切换脚本
# 使用方法: ./scripts/switch-db.sh [sqlite|postgresql]

if [ "$#" -ne 1 ]; then
    echo "使用方法: $0 [sqlite|postgresql]"
    exit 1
fi

DB_TYPE=$1

case $DB_TYPE in
    sqlite)
        echo "切换到 SQLite 数据库..."
        cp prisma/schema.prisma prisma/schema.backup.prisma
        
        # 更新 .env 文件
        sed -i '' 's/DATABASE_PROVIDER=".*"/DATABASE_PROVIDER="sqlite"/' .env
        sed -i '' 's|DATABASE_URL=".*"|DATABASE_URL="file:./dev.db"|' .env
        
        echo "✅ 已切换到 SQLite 数据库"
        echo "📁 数据库文件: ./dev.db"
        ;;
        
    postgresql)
        echo "切换到 PostgreSQL 数据库..."
        
        # 检查是否有 PostgreSQL 配置
        if [ -f "prisma/schema.postgresql.prisma" ]; then
            cp prisma/schema.prisma prisma/schema.backup.prisma
            cp prisma/schema.postgresql.prisma prisma/schema.prisma
        else
            # 直接修改当前 schema
            sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
        fi
        
        # 更新 .env 文件
        sed -i '' 's/DATABASE_PROVIDER=".*"/DATABASE_PROVIDER="postgresql"/' .env
        echo "请在 .env 文件中设置正确的 PostgreSQL 连接字符串"
        echo "示例: DATABASE_URL=\"postgresql://username:password@localhost:5432/database_name\""
        
        echo "✅ 已切换到 PostgreSQL 数据库"
        ;;
        
    *)
        echo "❌ 不支持的数据库类型: $DB_TYPE"
        echo "支持的类型: sqlite, postgresql"
        exit 1
        ;;
esac

echo ""
echo "下一步:"
echo "1. pnpm run db:generate  # 重新生成 Prisma 客户端"
echo "2. pnpm run db:push      # 推送 schema 到数据库"
echo "3. pnpm run db:seed      # (可选) 添加示例数据"
