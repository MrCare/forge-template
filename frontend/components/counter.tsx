'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCounter } from '@/hooks/useCounter';

export function Counter() {
  const [inputValue, setInputValue] = useState('');
  
  const {
    count,
    hash,
    isCountLoading,
    isPending,
    isConfirming,
    isConfirmed,
    writeError,
    confirmError,
    increment,
    decrement,
    setNumber,
    refetchCount,
  } = useCounter();

  const handleSetNumber = () => {
    if (inputValue) {
      setNumber(BigInt(inputValue));
      setInputValue('');
    }
  };

  // Refetch count when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchCount();
    }
  }, [isConfirmed, refetchCount]);

  const isLoading = isPending || isConfirming;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Counter Contract</CardTitle>
        <CardDescription>
          Interact with the deployed counter smart contract
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Current Count</p>
          <p className="text-3xl font-bold">
            {isCountLoading ? '...' : count?.toString() || '0'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={increment} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : '+1'}
          </Button>
          <Button 
            onClick={decrement} 
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            {isLoading ? 'Processing...' : '-1'}
          </Button>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter number"
            className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSetNumber} 
            disabled={isLoading || !inputValue}
          >
            Set
          </Button>
        </div>

        {hash && (
          <div className="text-xs text-muted-foreground">
            <p>Transaction: {hash}</p>
            {isConfirming && <p>Waiting for confirmation...</p>}
            {isConfirmed && <p>✅ Transaction confirmed!</p>}
          </div>
        )}

        {(writeError || confirmError) && (
          <div className="text-xs text-red-500">
            <p>Error: {writeError?.message || confirmError?.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
