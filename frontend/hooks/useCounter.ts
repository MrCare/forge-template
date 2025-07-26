'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { COUNTER_ADDRESS, COUNTER_ABI } from '@/lib/contracts';

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
  };

  const decrement = () => {
    writeContract({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'decrement',
    });
  };

  const setNumber = (newNumber: bigint) => {
    writeContract({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'setNumber',
      args: [newNumber],
    });
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
