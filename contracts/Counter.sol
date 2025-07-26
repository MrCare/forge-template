// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter {
    uint256 public number;
    
    event NumberIncremented(uint256 newNumber);
    event NumberDecremented(uint256 newNumber);
    event NumberSet(uint256 newNumber);

    function setNumber(uint256 newNumber) public {
        number = newNumber;
        emit NumberSet(newNumber);
    }

    function increment() public {
        number++;
        emit NumberIncremented(number);
    }
    
    function decrement() public {
        require(number > 0, "Counter: cannot decrement below zero");
        number--;
        emit NumberDecremented(number);
    }
}
