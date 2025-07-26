// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../contracts/Counter.sol";

contract Deploy is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        
        Counter counter = new Counter();
        
        console.log("Counter deployed to:", address(counter));
        
        vm.stopBroadcast();
    }
}
