// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "forge-std/Test.sol";
import "./mocks/MockWorldId.sol";
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

contract LeP2PTest is Test {
    LeP2PEscrow public escrow;
    USDCMock public token;
    MockWorldId public worldId;
    address public constant BUYER = address(1);
    address public constant SELLER = address(2);
    address public constant ARBITRATOR = address(3);

    event OrderCreated(uint256 id, address seller, uint256 amount, uint256 fiatToTokenExchangeRate, string iban);
    event OrderCancelled(uint256 id, string reason);
    event OrderPayed(uint256 id, address buyer, string paymentProof);
    event OrderReserved(uint256 id, address buyer);
    event OrderCompleted(uint256 id, address buyer, string paymentProof);
    event OrderReleased(uint256 id, string reason);

    struct Order {
        address seller;
        uint256 amount;
        uint256 fiatToTokenExchangeRate;
        string iban;
        address buyer;
        string paymentProof;
    }

    function _verifyAndRegisterAddress(address user) private {
        vm.startPrank(user);
        // If nullifier hash is 0, it will fail
        uint256 nullifierHash = 1;
        escrow.verifyAndRegister(address(0), 0, nullifierHash, [uint256(1),uint256(2),uint256(3),uint256(4),uint256(5),uint256(6),uint256(7),uint256(8)]);
        vm.stopPrank();
    }

    function setUp() public {
        vm.label(SELLER, "SELLER");
        vm.label(BUYER, "BUYER");
        vm.label(ARBITRATOR, "ARBITRATOR");
        token = new USDCMock();
        worldId = new MockWorldId();
        vm.startPrank(ARBITRATOR);
        escrow = new LeP2PEscrow(IWorldId(address(worldId)), "appId", "actionId", token);
        token.mint(SELLER, 1e6 * 2000);
        vm.startPrank(SELLER);
        token.approve(address(escrow), type(uint256).max);
        vm.stopPrank();
        // register seller and buyer
        _verifyAndRegisterAddress(SELLER);
        _verifyAndRegisterAddress(BUYER);
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
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.expectEmit(true, true, true, true);
        emit OrderReserved(1, BUYER);

        // WHEN
        vm.prank(BUYER);
        escrow.reserveOrder(1);

        //THEN
        (, , , , address oderBuyer,) = escrow.orders(1);

        assertEq(oderBuyer, BUYER);
    }

    function testRevertReserveOrderOrderNotExistant() public {
        // WHEN + THEN
        vm.prank(BUYER);
        vm.expectRevert("Order does not exist");
        escrow.reserveOrder(1);
    }

    function testRevertReserveOrderBuyerPresent() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        // WHEN + THEN
        vm.prank(BUYER);
        vm.expectRevert("Order already has a buyer");
        escrow.reserveOrder(1);
    }

    function testSubmitPaymentOK() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory ipfsHash = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4";

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        // WHEN
        vm.prank(BUYER);
        vm.expectEmit(true, true, true, true);
        emit OrderPayed(1, BUYER, ipfsHash);
        escrow.submitPayment(1, ipfsHash);

        //THEN
        (, , , , address oderBuyer,) = escrow.orders(1);

        assertEq(oderBuyer, BUYER);
    }

    function testRevertSubmitPaymentOrderNotExists() public {
        // GIVEN
        string memory ipfsHash = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4";

        // WHEN + THEN
        vm.prank(BUYER);
        vm.expectRevert("Order does not exist");
        escrow.submitPayment(1, ipfsHash);
    }

    function testRevertSubmitPaymentNotBuyer() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory ipfsHash = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4";

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        // WHEN
        vm.prank(SELLER);
        vm.expectRevert("Not the buyer");
        escrow.submitPayment(1, ipfsHash);
    }

    function testConfirmOrderOK() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory ipfsHash = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4";

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        vm.prank(BUYER);
        escrow.submitPayment(1, ipfsHash);

        // WHEN
        vm.prank(SELLER);
        vm.expectEmit(true, true, true, true);
        emit OrderCompleted(1, BUYER, ipfsHash);
        escrow.confirmOrder(1);

        //THEN
        (address oderSeller, , , , ,) = escrow.orders(1);

        assertEq(oderSeller, address(0));
        assertEq(token.balanceOf(SELLER), 0);
        assertEq(token.balanceOf(address(escrow)), 0);
        assertEq(token.balanceOf(BUYER), 1e6);
    }

    function testRevertConfirmOrderOrderNotExist() public {
        // WHEN + THEN
        vm.prank(SELLER);
        vm.expectRevert("Order does not exist");
        escrow.confirmOrder(1);
    }

    function testRevertConfirmOrderNotSeller() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory ipfsHash = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4";

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        vm.prank(BUYER);
        escrow.submitPayment(1, ipfsHash);

        // WHEN + THEN
        vm.prank(BUYER);
        vm.expectRevert("Not the seller");
        escrow.confirmOrder(1);
    }

    function testRevertConfirmOrderNoBuyer() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        // WHEN + THEN
        vm.prank(SELLER);
        vm.expectRevert("Order has no buyer");
        escrow.confirmOrder(1);
    }

    function testArbitrateCompleteOrderOK() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory ipfsHash = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4";

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        vm.prank(BUYER);
        escrow.submitPayment(1, ipfsHash);

        // WHEN
        vm.prank(ARBITRATOR);
        vm.expectEmit(true, true, true, true);
        emit OrderCompleted(1, BUYER, ipfsHash);
        escrow.arbitrateCompleteOrder(1);

        //THEN
        (address oderSeller, , , , ,) = escrow.orders(1);

        assertEq(oderSeller, address(0));
        assertEq(token.balanceOf(SELLER), 0);
        assertEq(token.balanceOf(address(escrow)), 0);
        assertEq(token.balanceOf(BUYER), 1e6);
    }

    function testRevertArbitrateCompleteOrderOrderNotExist() public {
        // WHEN + THEN
        vm.prank(ARBITRATOR);
        vm.expectRevert("Order does not exist");
        escrow.arbitrateCompleteOrder(1);
    }

    function testRevertArbitrateCompleteOrderNoBuyer() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        // WHEN + THEN
        vm.prank(ARBITRATOR);
        vm.expectRevert("Order has no buyer");
        escrow.arbitrateCompleteOrder(1);
    }

    function testRevertArbitrateCompleteOrderNotArbitrator() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory ipfsHash = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4";

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        vm.prank(BUYER);
        escrow.submitPayment(1, ipfsHash);

        // WHEN + THEN
        vm.prank(SELLER);
        vm.expectRevert("Not an arbitrator");
        escrow.arbitrateCompleteOrder(1);
    }

    function testCancelOrderSellerOK() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory reason = "test";
        uint256 orderId = 1;

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        // WHEN
        vm.expectEmit(true, true, true, true);
        emit OrderCancelled(orderId, reason);

        vm.prank(SELLER);
        escrow.cancelOrderSeller(orderId, reason);

        //THEN
        assertEq(token.balanceOf(SELLER), 1e6);
        assertEq(token.balanceOf(address(escrow)), 0);
        assertEq(token.balanceOf(BUYER), 0);
        assertEq(escrow.nextOrderId(), 2);
        (address orderSeller, , , , , ) = escrow.orders(1);
        assertEq(orderSeller, address(0));
    }

    function testRevertCancelOrderSellerOrderNotExist() public {
        // GIVEN
        string memory reason = "test";
        uint256 orderId = 1;

        // WHEN + THEN
        vm.prank(SELLER);
        vm.expectRevert("Order does not exist");
        escrow.cancelOrderSeller(orderId, reason);
    }

    function testRevertCancelOrderSellerNotSeller() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory reason = "test";
        uint256 orderId = 1;

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        // WHEN + THEN
        vm.prank(BUYER);
        vm.expectRevert("Not the seller");
        escrow.cancelOrderSeller(orderId, reason);
    }

    function testRevertCancelOrderSellerNotSellerSide() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory reason = "test";
        uint256 orderId = 1;

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        // WHEN + THEN
        vm.prank(SELLER);
        vm.expectRevert("Order is on buyer side");
        escrow.cancelOrderSeller(orderId, reason);
    }

    function testReleaseOrderBuyerOK() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory reason = "test";
        uint256 orderId = 1;

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        // WHEN
        vm.expectEmit(true, true, true, true);
        emit OrderReleased(orderId, reason);

        vm.prank(BUYER);
        escrow.releaseOrderBuyer(orderId, reason);

        //THEN
        (, , , , address orderBuyer, ) = escrow.orders(1);
        assertEq(orderBuyer, address(0));
    }

    function testRevertReleaseOrderBuyerOrderNotExist() public {
        // GIVEN
        string memory reason = "test";
        uint256 orderId = 1;

        // WHEN
        vm.prank(BUYER);
        vm.expectRevert("Order does not exist");
        escrow.releaseOrderBuyer(orderId, reason);
    }

    function testRevertReleaseOrderBuyerNotBuyer() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory reason = "test";
        uint256 orderId = 1;

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        // WHEN
        vm.prank(SELLER);
        vm.expectRevert("Not the buyer");
        escrow.releaseOrderBuyer(orderId, reason);
    }

    function testReleaseOrderArbitratorOK() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory reason = "test";
        uint256 orderId = 1;

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        // WHEN
        vm.expectEmit(true, true, true, true);
        emit OrderReleased(orderId, reason);

        vm.prank(ARBITRATOR);
        escrow.releaseOrderArbitrator(orderId, reason);

        //THEN
        (, , , , address orderBuyer, ) = escrow.orders(1);
        assertEq(orderBuyer, address(0));
    }

    function testRevertReleaseOrderArbitratorOrderNotExist() public {
        // GIVEN
        string memory reason = "test";
        uint256 orderId = 1;

        // WHEN
        vm.prank(BUYER);
        vm.expectRevert("Order does not exist");
        escrow.releaseOrderArbitrator(orderId, reason);
    }

    function testRevertReleaseOrderArbitratorNotArbitrator() public {
        // GIVEN
        uint256 amount = 1e6;
        uint256 fiatToTokenExchangeRate = 10;
        string memory iban = "ES6621000418401234567891";
        string memory reason = "test";
        uint256 orderId = 1;

        vm.prank(SELLER);
        escrow.createOrder(amount, fiatToTokenExchangeRate, iban);

        vm.prank(BUYER);
        escrow.reserveOrder(1);

        // WHEN
        vm.prank(SELLER);
        vm.expectRevert("Not an arbitrator");
        escrow.releaseOrderArbitrator(orderId, reason);
    }
}
