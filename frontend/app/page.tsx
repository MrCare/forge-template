'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Counter } from '@/components/counter';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Foundry + Next.js Template
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A lightweight, production-ready template for building decentralized applications
          </p>
          <ConnectButton />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">🔧 Foundry</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Fast, portable Ethereum development toolkit</li>
                <li>• Built-in testing and debugging</li>
                <li>• Solidity scripting for deployments</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">⚛️ Next.js 14</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• App Router with React Server Components</li>
                <li>• TypeScript for type safety</li>
                <li>• Optimized performance and SEO</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">🎨 Modern Stack</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Viem for Ethereum interactions</li>
                <li>• RainbowKit for wallet connections</li>
                <li>• shadcn/ui for beautiful components</li>
                <li>• Tailwind CSS for styling</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Counter />
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Ready to build the next generation of decentralized applications
          </p>
        </div>
      </div>
    </main>
  );
}
