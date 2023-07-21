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

    event OrderCreated(uint256 id, address seller, uint256 amount, uint256 fiatToTokenExchangeRate, string iban);
    event OrderCancelled(uint256 id, string reason);
    event OrderCompleted(uint256 id, address buyer, string paymentProof);

    struct Order {
        address seller;
        uint256 amount;
        uint256 fiatToTokenExchangeRate;
        string iban;
        address buyer;
        string paymentProof;
    }

    function setUp() public {
        vm.label(SELLER, "SELLER");
        vm.label(BUYER, "BUYER");
        token = new USDCMock();
        escrow = new LeP2PEscrow(IERC20(token));
        token.mint(SELLER, 1e6);
        vm.startPrank(SELLER);
        token.approve(address(escrow), type(uint256).max);
        vm.stopPrank();
    }

    function testCreateOrderOK() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";

        vm.expectEmit(true, true, true, true);
        emit OrderCreated(1, SELLER, amount, fiatToTokenExchangeRate, iban);

        // WHEN
        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        //THEN
        assertEq(token.balanceOf(SELLER), 0);
        assertEq(token.balanceOf(address(escrow)), 1e6);
        assertEq(token.balanceOf(BUYER), 0);
        assertEq(escrow.nextOrderId(), 2);
        (address orderSeller, uint256 orederAmount, uint256 oderFiatToTokenExchangeRate, string memory oderIban, address oderBuyer, string memory orderPaymentProof) = escrow.orders(1);
        assertEq(orderSeller, SELLER);
        assertEq(orederAmount, amount);
        assertEq(oderFiatToTokenExchangeRate, fiatToTokenExchangeRate);
        assertEq(oderIban, iban);
        assertEq(oderBuyer, address(0));
        assertEq(bytes(orderPaymentProof).length, 0);
    }

    function testRevertCreateOrderAmount() public {
        // GIVEN
        uint256 amount = 0;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";

        // WHEN + THEN
        vm.prank(SELLER);
        vm.expectRevert("Amount must be greater than 0");
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);
    }

    function testRevertCreateOrderRate() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 0;
        string memory iban = "ES6621000418401234567891";

        // WHEN + THEN
        vm.prank(SELLER);
        vm.expectRevert("Exchange rate must be greater than 0");
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);
    }

    function testRevertCreateOrderIBAN() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "";

        // WHEN + THEN
        vm.prank(SELLER);
        vm.expectRevert("IBAN must not be empty");
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);
    }

    function testReserveOrderOK() public {
    
    }

    function testCancelOrderSellerOK() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        string memory reason = "test";
        uint256 contractId = 1;

        // WHEN
        vm.expectEmit(true, true, true, true);
        emit OrderCancelled(contractId, reason);

        vm.prank(SELLER);
        escrow.cancelOrder(contractId, reason);

        //THEN
        assertEq(token.balanceOf(SELLER), 1e6);
        assertEq(token.balanceOf(address(escrow)), 0);
        assertEq(token.balanceOf(BUYER), 0);
        assertEq(escrow.nextOrderId(), 2);
        (address orderSeller, , , , , ) = escrow.orders(1);
        assertEq(orderSeller, address(0));
    }
}
