'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { COUNTER_ADDRESS, COUNTER_ABI } from '@/lib/contracts';

// Function to record operation to database
const recordOperation = async (operation: string, value?: number) => {
  try {
    await fetch('/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation,
        value: value || null,
      }),
    });
  } catch (error) {
    console.error('Failed to record operation:', error);
  }
};

export function useCounter() {
  // Read the current counter value
  const { 
    data: count, 
    isLoading: isCountLoading,
    refetch: refetchCount 
  } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    functionName: 'number',
  });

  const { 
    writeContract, 
    data: hash, 
    isPending,
    error: writeError 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError 
  } = useWaitForTransactionReceipt({
    hash,
  });

  const increment = () => {
    writeContract({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'increment',
    });
    // Record the increment operation
    recordOperation('increment');
  };

  const decrement = () => {
    writeContract({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'decrement',
    });
    // Record the decrement operation
    recordOperation('decrement');
  };

  const setNumber = (newNumber: bigint) => {
    writeContract({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'setNumber',
      args: [newNumber],
    });
    // Record the set operation with the value
    recordOperation('set', Number(newNumber));
  };

  return {
    // State
    count,
    hash,
    
    // Loading states
    isCountLoading,
    isPending,
    isConfirming,
    isConfirmed,
    
    // Errors
    writeError,
    confirmError,
    
    // Actions
    increment,
    decrement,
    setNumber,
    refetchCount,
  };
}
