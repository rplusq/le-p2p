// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../src/interfaces/IWorldId.sol";
import "../test/mocks/USDCMock.sol";

import "../src/LeP2P.sol";

contract LeP2PScript is Script {
    IWorldId public worldId = IWorldId(0x719683F13Eeea7D84fCBa5d7d17Bf82e03E3d260);
    IERC20 public usdc = IERC20(0xB6070545E83827182446F0B00405f04456e594ca);
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        LeP2PEscrow escrow = new LeP2PEscrow(worldId, "app_staging_1031c7704926adf29c35a8f92008a648", "register", IERC20(address(usdc)));
        vm.stopBroadcast();
        console2.log("LeP2PEscrow:", address(escrow));
        console2.log("USDCMock:", address(usdc));
    }
}
