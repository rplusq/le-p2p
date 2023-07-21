// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./helpers/ByteHasher.sol";
import "./interfaces/IWorldID.sol";

contract LeP2PEscrow is AccessControl {
    using ByteHasher for bytes;

    /// @notice Thrown when attempting to reuse a nullifier
	error AlreadyRegisteredNullifier();

    struct Order {
        address seller;
        uint256 amount;
        uint256 fiatToTokenExchangeRate;
        string iban;
        address buyer;
        string paymentProof;
    }

    event OrderCreated(uint256 id, address seller, uint256 amount, uint256 fiatToTokenExchangeRate, string iban);
    event OrderCancelled(uint256 id, string reason);
    event OrderCompleted(uint256 id, address buyer, string paymentProof);

    mapping(uint256 => Order) public orders;
    
    bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");
    uint256 public nextOrderId = 0;
    IERC20 public token;

    /// @dev The World ID instance that will be used for verifying proofs
	IWorldID internal immutable _worldId;

	/// @dev The contract's external nullifier hash
	uint256 internal immutable _externalNullifier;

	/// @dev The World ID group ID (always 1)
	uint256 internal immutable _groupId = 1;

	/// @dev Whether an address has a verified nullifier hash. Used to guarantee that an address is a verified human
	mapping(address => uint256) internal _addressToNullifierHash;

	/// @param worldId_ The WorldID instance that will verify the proofs
	/// @param appId The World ID app ID
	/// @param actionId The World ID action ID
	/// @param token_ The token that will be used for payments
	constructor(IWorldID worldId_, string memory appId, string memory actionId, IERC20 token_) {
        require(address(worldId_) != address(0), "World ID address cannot be 0");
        require(bytes(appId).length > 0, "App ID cannot be empty");
        require(bytes(actionId).length > 0, "Action ID cannot be empty");
        require(address(token_) != address(0), "Token address cannot be 0");
		_externalNullifier = abi.encodePacked(abi.encodePacked(appId).hashToField(), actionId).hashToField();
		_worldId = worldId_;
        token = token_;
        _setupRole(ARBITRATOR_ROLE, msg.sender);
	}
    
    function createOrder(uint256 amount, uint256 fiatToTokenExchangeRate, string memory iban) onlyRegistered external {
        require(amount > 0, "Amount must be greater than 0");
        require(fiatToTokenExchangeRate > 0, "Exchange rate must be greater than 0");
        require(bytes(iban).length > 0, "IBAN must not be empty");
        token.transferFrom(msg.sender, address(this), amount);
        orders[nextOrderId] = Order({
            seller: msg.sender,
            amount: amount,
            fiatToTokenExchangeRate: fiatToTokenExchangeRate,
            iban: iban,
            buyer: address(0),
            paymentProof: ""
        });
        
        emit OrderCreated(nextOrderId, msg.sender, amount, fiatToTokenExchangeRate, iban);
        nextOrderId++;
    }
    
    function cancelOrder(uint256 id, string memory reason) onlyRegistered external {
        Order storage order = orders[id];
        require(order.seller != address(0), "Order does not exist");
        require(msg.sender == order.seller, "Not the seller");
        require(order.buyer == address(0), "Order has a buyer");

        delete orders[id];

        emit OrderCancelled(id, reason);

        token.transfer(order.seller, order.amount);
    }
    
    function submitPayment(uint256 id, string memory ipfsHash) onlyRegistered external {
        Order storage order = orders[id];
        require(order.seller != address(0), "Order does not exist");
        require(order.buyer == address(0), "Order already has a buyer");

        order.buyer = msg.sender;
        order.paymentProof = ipfsHash;
    }
    
    function confirmOrder(uint256 id) external onlyRegistered {
        Order storage order = orders[id];
        require(msg.sender == order.seller, "Not the seller");
        require(order.buyer != address(0), "Order has no buyer");

        emit OrderCompleted(id, order.buyer, order.paymentProof);

        token.transfer(order.buyer, order.amount);
    }
    
    function arbitrateCompleteOrder(uint256 id) external {
        require(hasRole(ARBITRATOR_ROLE, msg.sender), "Not an arbitrator");

        Order storage order = orders[id];

        token.transfer(order.buyer, order.amount);

        emit OrderCompleted(id, order.buyer, order.paymentProof);
    }

    /// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further details)
	/// @param root The root of the Merkle tree (returned by the JS widget).
	/// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
	/// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
	function verifyAndRegister(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public {
		// First, we make sure this person hasn't done this before
		if (_addressToNullifierHash[msg.sender] != 0) revert AlreadyRegisteredNullifier();

		// We now verify the provided proof is valid and the user is verified by World ID
		_worldId.verifyProof(
			root,
			_groupId,
			abi.encodePacked(signal).hashToField(),
			nullifierHash,
			_externalNullifier,
			proof
		);

		// We now record the user has done this, so they can't do it again (proof of uniqueness)
		_addressToNullifierHash[msg.sender] = nullifierHash;
	}

    modifier onlyRegistered() {
        require(_addressToNullifierHash[msg.sender] != 0, "Address not registered");
        _;
    }
}
