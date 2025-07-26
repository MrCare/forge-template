// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Counter} from "../contracts/Counter.sol";

contract CounterTest is Test {
    Counter public counter;

    function setUp() public {
        counter = new Counter();
    }

    function test_Increment() public {
        counter.increment();
        assertEq(counter.number(), 1);
    }

    function testFuzz_SetNumber(uint256 x) public {
        counter.setNumber(x);
        assertEq(counter.number(), x);
    }
    
    function test_Decrement() public {
        counter.setNumber(5);
        counter.decrement();
        assertEq(counter.number(), 4);
    }
    
    function test_DecrementRevertWhenZero() public {
        vm.expectRevert("Counter: cannot decrement below zero");
        counter.decrement();
    }
}
