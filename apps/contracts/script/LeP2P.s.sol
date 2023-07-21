// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../src/LeP2P.sol";

contract CounterScript is Script {
    IERC20 public token;
    function setUp() public {}

    function run() public {
        vm.broadcast();
        LeP2PEscrow escrow = new LeP2PEscrow(token);
        console2.log("LeP2PEscrow:", address(escrow));
    }
}
