# Foundry + Next.js + 数据库模板

[📖 English README](README.md) | 🇨🇳 中文文档

一个全栈、生产就绪的模板，用于构建基于 Foundry、Next.js 和数据库集成的去中心化应用程序。

## 特性

- 🔧 **Foundry** - 快速、便携、模块化的以太坊开发工具包
- ⚛️ **Next.js 14** - 带有 App Router 的 React 框架
- �️ **Prisma ORM** - 支持 SQLite 和 PostgreSQL 的类型安全数据库客户端
- �🔗 **Viem** - TypeScript 以太坊接口
- 🦄 **Wagmi** - 以太坊 React Hooks
- 💳 **RainbowKit** - 顶级钱包连接组件
- 🎨 **shadcn/ui** - 美观且易用的 UI 组件库
- 🎯 **TypeScript** - 全栈类型安全
- 💅 **Tailwind CSS** - 实用优先的 CSS 框架
- 📦 **pnpm** - 快速、节省磁盘空间的包管理器

## 前置要求

- [Node.js](https://nodejs.org/) v18+ 
- [pnpm](https://pnpm.io/) v8+ (如果缺失会自动安装)
- [Foundry](https://getfoundry.sh/) - 使用 `curl -L https://foundry.paradigm.xyz | bash && foundryup` 安装
- [PostgreSQL](https://postgresql.org/) (可选，用于生产环境)

## 快速开始

```bash
# 1. 克隆模板
git clone <your-repo-url>
cd foundry-nextjs-template

# 2. 运行设置脚本 (安装依赖、设置数据库、部署合约)
chmod +x setup.sh && ./setup.sh

# 3. 启动前端
cd frontend && pnpm dev
```

设置脚本会自动：
- 检查并安装前置条件
- 安装所有依赖
- 设置 SQLite 数据库并添加示例数据
- 启动本地区块链 (Anvil)
- 部署智能合约
- 配置合约地址

完成后你将看到：

![alt text](image.png)

## 项目结构

```
├── contracts/          # 智能合约
├── script/            # 部署脚本  
├── test/              # 合约测试
├── frontend/          # Next.js 应用程序
│   ├── app/           # App router 页面
│   ├── components/    # React 组件
│   ├── lib/           # 工具和配置
│   ├── hooks/         # 自定义 React hooks
│   ├── prisma/        # 数据库模式和迁移
│   │   ├── schema.prisma    # 数据库模式
│   │   └── seed.ts          # 示例数据种子文件
│   └── scripts/       # 数据库工具
├── foundry.toml       # Foundry 配置
├── setup.sh           # 自动化设置脚本
├── package.json       # 根 package.json 配置，包含 pnpm 脚本
├── README.md          # 英文文档
└── README.zh-CN.md    # 中文文档
```

## 数据库配置

此模板包含 **Prisma ORM**，支持 SQLite（开发）和 PostgreSQL（生产）。

### 默认设置 (SQLite)
模板默认使用 SQLite 以便于开发：
```bash
# 数据库文件: frontend/dev.db
# 在设置过程中自动配置
```

### PostgreSQL 设置 (生产环境)
对于生产环境或当你偏好 PostgreSQL 时：

1. **安装 PostgreSQL** (如果尚未安装):
   ```bash
   # macOS 使用 Homebrew
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   
   # 创建数据库和用户
   sudo -u postgres psql
   CREATE DATABASE your_app_name;
   CREATE USER your_username WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE your_app_name TO your_username;
   \q
   ```

2. **切换到 PostgreSQL**:
   ```bash
   cd frontend
   
   # 复制 PostgreSQL 模式
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   
   # 更新 .env 文件
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_app_name"
   
   # 应用模式和种子数据
   pnpm run db:push
   pnpm run db:seed
   ```

### 数据库命令
```bash
cd frontend

# 生成 Prisma 客户端
pnpm run db:generate

# 将模式推送到数据库 (开发)
pnpm run db:push

# 创建并运行迁移 (生产)
pnpm run db:migrate

# 用示例数据填充数据库
pnpm run db:seed

# 打开 Prisma Studio (数据库 GUI)
pnpm run db:studio

# 重置数据库
pnpm run db:reset
```

## 可用脚本

```bash
# Foundry
forge build           # 编译合约
forge test            # 运行测试
anvil                 # 启动本地节点

# 前端
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm lint             # 运行 ESLint

# 数据库 (在 frontend 目录中)
pnpm run db:generate  # 生成 Prisma 客户端
pnpm run db:push      # 将模式推送到数据库
pnpm run db:migrate   # 创建并运行迁移
pnpm run db:seed      # 用示例数据填充数据库
pnpm run db:studio    # 打开 Prisma Studio
pnpm run db:reset     # 重置数据库

# 根目录脚本
pnpm setup            # 安装所有依赖
pnpm clean            # 清理构建产物
```

## 示例功能

模板包含一个**带操作跟踪的简单计数器**，演示数据库集成：

- **操作记录**: 计数器操作（递增、递减、设置）会记录到数据库
- **操作历史**: 查看总操作次数和最近历史
- **数据持久化**: 操作数据在会话间持久保存
- **简洁界面**: 带有操作统计的极简计数器显示

### API 端点

- `GET /api/stats` - 获取计数器操作统计和历史
- `POST /api/stats` - 记录新的计数器操作

### 数据库模式

```prisma
model CounterOperation {
  id        String   @id @default(cuid())
  operation String   // "increment", "decrement", "set"
  value     Int?     // 对于设置操作，存储值
  timestamp DateTime @default(now())
}
```

## 开发工作流

1. **智能合约** - 在 `contracts/` 中编辑，使用 `forge test` 测试
2. **前端** - 在 `frontend/components/` 中编写 React 组件
3. **数据库** - 在 `frontend/prisma/schema.prisma` 中修改模式，然后运行 `pnpm run db:push`
4. **配置** - 部署期间自动更新合约地址
5. **样式** - 使用 Tailwind 类和 shadcn/ui 组件

## 添加 UI 组件

```bash
cd frontend
pnpm dlx shadcn-ui@latest add [组件名称]
```

## 环境变量

模板使用以下环境变量（在设置过程中自动配置）：

```env
# 数据库 (frontend/.env)
DATABASE_URL="file:./dev.db"  # SQLite (默认)
# DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"  # PostgreSQL

# Next.js (frontend/.env.local)
NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."  # 在设置期间自动填入
```

## 切换数据库提供商

### 从 SQLite 切换到 PostgreSQL
```bash
cd frontend
./scripts/switch-db.sh postgresql
# 按照提示配置 PostgreSQL 连接
pnpm run db:push
pnpm run db:seed
```

### 从 PostgreSQL 切换到 SQLite
```bash
cd frontend
./scripts/switch-db.sh sqlite
pnpm run db:push
pnpm run db:seed
```

## 生产部署

1. **数据库**: 设置 PostgreSQL 并配置 `DATABASE_URL`
2. **合约**: 部署到目标网络
3. **前端**: 使用你偏好的平台构建和部署
4. **环境**: 设置生产环境变量

```bash
# 构建生产版本
cd frontend
pnpm run build

# 生产数据库迁移
pnpm run db:migrate
```

## 许可证

MIT
