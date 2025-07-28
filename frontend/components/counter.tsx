'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCounter } from '@/hooks/useCounter';

export function Counter() {
  const [inputValue, setInputValue] = useState('');
  const [totalOperations, setTotalOperations] = useState(0);
  
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

  // Fetch total operations count
  const fetchOperationsCount = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setTotalOperations(data.stats.total);
    } catch (error) {
      console.error('Failed to fetch operations count:', error);
    }
  };

  const handleIncrement = () => {
    increment();
  };

  const handleDecrement = () => {
    decrement();
  };

  const handleSetNumber = () => {
    if (inputValue) {
      setNumber(BigInt(inputValue));
      setInputValue('');
    }
  };

  // Refetch count and operations when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchCount();
      // Delay to ensure database operation is recorded
      setTimeout(fetchOperationsCount, 500);
    }
  }, [isConfirmed, refetchCount]);

  // Initial fetch of operations count
  useEffect(() => {
    fetchOperationsCount();
  }, []);

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
          <p className="text-lg text-cyan-500 mt-1">
            Total Operations: {totalOperations}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleIncrement} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : '+1'}
          </Button>
          <Button 
            onClick={handleDecrement} 
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
