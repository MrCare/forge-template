/*
 * @Author: Mr.Car
 * @Date: 2025-07-28 19:50:25
 */
import { type Address } from 'viem';

// Update these addresses after deployment
export const COUNTER_ADDRESS = '0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d' as Address; // Default Anvil first deployment

export const COUNTER_ABI = [
  {
    type: 'function',
    name: 'number',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setNumber',
    inputs: [{ name: 'newNumber', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'decrement',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'NumberIncremented',
    inputs: [
      {
        name: 'newNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'NumberDecremented',
    inputs: [
      {
        name: 'newNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'NumberSet',
    inputs: [
      {
        name: 'newNumber',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
] as const;
