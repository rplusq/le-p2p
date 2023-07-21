// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "forge-std/Test.sol";
import "../src/LeP2P.sol";

contract USDCMock is ERC20 {
    constructor() ERC20("USDC", "USDC") {}
    
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}

contract CounterTest is Test {
    LeP2PEscrow public escrow;
    USDCMock public token;
    address public constant BUYER = address(1);
    address public constant SELLER = address(2);
    address public constant ARBITRATOR = address(3);

    function setUp() public {
        token = new USDCMock();
        escrow = new LeP2PEscrow(IERC20(token));
        token.mint(SELLER, 1e6);
    }
}
