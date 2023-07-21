pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LeP2PEscrow is AccessControl {
    bytes32 public constant ARBITRATOR_ROLE = "<<ARBITRATOR_ROLE>>";
    IERC20 public usdc;
    
    struct Order {
        address seller;
        uint256 amount;
        uint256 fiatToTokenExchangeRate;
        string iban;
        address buyer;
        string paymentProof;
        bool isComplete;
        string cancelReason;
    }
    
    mapping(uint256 => Order) public orders;
    uint256 public nextOrderId = 0;

    event OrderCreated(uint256 id, address seller, uint256 amount, uint256 fiatToTokenExchangeRate, string iban);
    event OrderCancelled(uint256 id, string reason);
    event OrderCompleted(uint256 id, address buyer, string paymentProof);
    
    constructor(IERC20 _usdc) {
        usdc = _usdc;
        _setupRole(ARBITRATOR_ROLE, msg.sender);
    }
    
    function createOrder(uint256 amount, uint256 fiatToTokenExchangeRate, string memory iban) external {
        usdc.transferFrom(msg.sender, address(this), amount);
        orders[nextOrderId] = Order({
            seller: msg.sender,
            amount: amount,
            fiatToTokenExchangeRate: fiatToTokenExchangeRate,
            iban: iban,
            buyer: address(0),
            paymentProof: "",
            isComplete: false,
            cancelReason: ""
        });
        
        emit OrderCreated(nextOrderId, msg.sender, amount, fiatToTokenExchangeRate, iban);
        nextOrderId++;
    }
    
    function cancelOrder(uint256 id, string memory reason) external {
        Order storage order = orders[id];
        require(msg.sender == order.seller, "Not the seller");
        require(order.buyer == address(0), "Order has a buyer");
        require(!order.isComplete, "Order is complete");

        order.cancelReason = reason;
        usdc.transfer(order.seller, order.amount);

        emit OrderCancelled(id, reason);
    }
    
    function submitPayment(uint256 id, string memory ipfsHash) external {
        Order storage order = orders[id];
        require(order.seller != address(0), "Order does not exist");
        require(order.buyer == address(0), "Order already has a buyer");
        require(!order.isComplete, "Order is complete");

        order.buyer = msg.sender;
        order.paymentProof = ipfsHash;
    }
    
    function confirmOrder(uint256 id) external {
        Order storage order = orders[id];
        require(msg.sender == order.seller, "Not the seller");
        require(order.buyer != address(0), "Order has no buyer");
        require(!order.isComplete, "Order is already complete");

        order.isComplete = true;
        usdc.transfer(order.buyer, order.amount);

        emit OrderCompleted(id, order.buyer, order.paymentProof);
    }
    
    function arbitrateCompleteOrder(uint256 id) external {
        require(hasRole(ARBITRATOR_ROLE, msg.sender), "Not an arbitrator");

        Order storage order = orders[id];
        require(!order.isComplete, "Order is already complete");

        order.isComplete = true;
        usdc.transfer(order.buyer, order.amount);

        emit OrderCompleted(id, order.buyer, order.paymentProof);
    }
}
