// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@iden3/contracts/ZKPVerifier.sol";
import "@iden3/contracts/lib/GenesisUtils.sol";
import "@iden3/contracts/interfaces/ICircuitValidator.sol";
import "./helpers/ByteHasher.sol";
import "./interfaces/IWorldId.sol";

contract LeP2PEscrow is AccessControl, ZKPVerifier {
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
    uint256 public nextOrderId = 1;
    IERC20 public token;

    /// @dev The World ID instance that will be used for verifying proofs
	IWorldId internal immutable _worldId;

	/// @dev The contract's external worldcoin nullifier hash
	uint256 internal immutable _worldcoinExternalNullifier;

	/// @dev The World ID group ID (always 1)
	uint256 internal immutable _worldcoinGroupId = 1;

	/// @dev Whether an address has a verified worldcoin nullifier hash. Used to guarantee that an address is a verified human
	mapping(address => uint256) internal _addressToWorldcoinNullifierHash;

    /// @dev Whether an address has a verified kyc id
    mapping(address => uint256) internal _addressToKycId;

	/// @param worldId_ The WorldID instance that will verify the proofs
	/// @param appId The World ID app ID
	/// @param actionId The World ID action ID
	/// @param token_ The token that will be used for payments
	constructor(IWorldId worldId_, string memory appId, string memory actionId, IERC20 token_) {
        require(address(worldId_) != address(0), "World ID address cannot be 0");
        require(bytes(appId).length > 0, "App ID cannot be empty");
        require(bytes(actionId).length > 0, "Action ID cannot be empty");
        require(address(token_) != address(0), "Token address cannot be 0");
		_worldcoinExternalNullifier = abi.encodePacked(abi.encodePacked(appId).hashToField(), actionId).hashToField();
		_worldId = worldId_;
        token = token_;
        _setupRole(ARBITRATOR_ROLE, msg.sender);
	}

    /**
    * @dev Creates an order to be published in the File Node
    * @param amount Amount of tokens to be sold
    * @param fiatToTokenExchangeRate Fiat to token exchange rate
    * @param iban IBAN of the seller
    */
    function createOrder(uint256 amount, uint256 fiatToTokenExchangeRate, string memory iban) onlyVerifiedHuman external {
        // Check that the amount to be sold is greater than 0
        require(amount > 0, "Amount must be greater than 0");
        
        // Check that the exchange rate is greater than 0
        require(fiatToTokenExchangeRate > 0, "Exchange rate must be greater than 0");
        
        // Check that the IBAN is not empty
        require(bytes(iban).length > 0, "IBAN must not be empty");

        amountCheckKYC(amount);
        
        // Transfer tokens to this contract to hold them
        token.transferFrom(msg.sender, address(this), amount);
        
        // Create order to be published
        orders[nextOrderId] = Order({
            seller: msg.sender,
            amount: amount,
            fiatToTokenExchangeRate: fiatToTokenExchangeRate,
            iban: iban,
            buyer: address(0),
            paymentProof: ""
        });
        
        // Emit event to be saved in the File Node
        emit OrderCreated(nextOrderId, msg.sender, amount, fiatToTokenExchangeRate, iban);
        nextOrderId++;
    }
    
    function reserveOrder(uint256 id) onlyVerifiedHuman external {
        amountCheckKYC(amount);
        Order storage order = orders[id];
        require(order.seller != address(0), "Order does not exist");
        require(order.buyer == address(0), "Order already has a buyer");

        order.buyer = msg.sender;
    }
    
    function submitPayment(uint256 id, string memory ipfsHash) external {
        Order storage order = orders[id];
        require(order.seller != address(0), "Order does not exist");
        require(msg.sender == order.buyer, "Not the buyer");

        order.paymentProof = ipfsHash;
    }
    
    function confirmOrder(uint256 id) external {
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

    function cancelOrderUser(uint256 id, string memory reason) external {
        // Retrieve the order to be cancelled
        Order storage order = orders[id];

        bool isSeller = msg.sender == order.seller;
        bool isBuyer = msg.sender == order.buyer;
        bool isOrderOnBuyerSide = order.buyer != address(0);
        bool isOrderOnSellerSide = order.buyer == address(0);
        bool isOrderExistant = order.seller != address(0);

        // Check that the order exists
        require(isOrderExistant, "Order does not exist");

        // Check that the sender is the seller when the order has no buyer
        if (isOrderOnSellerSide) {
            require(isSeller, "Not the seller");
        }
        // Check that the sender is the seller when the order has a buyer
        else if(isOrderOnBuyerSide) {
            require(isBuyer, "Not the buyer");
        }

        _cancelOrder(id, reason);
    }

    function cancelOrderArbitrator(uint256 id, string memory reason) external {
        // Retrieve the order to be cancelled
        Order storage order = orders[id];

        bool isArbitrator = hasRole(ARBITRATOR_ROLE, msg.sender);
        bool isOrderExistant = order.seller != address(0);

        // Check that the order exists
        require(isOrderExistant, "Order does not exist");

        // Check that the sender is the arbitrator
        require(isArbitrator, "Not the seller");


        _cancelOrder(id, reason);
    }

    function _cancelOrder(uint256 id, string memory reason) private {
        Order storage order = orders[id];
        address seller = order.seller;
        uint256 amount = order.amount;

         // Delete the order
        delete orders[id];

        // Emit event of order cancellation to be saved in the File Node
        emit OrderCancelled(id, reason);

        // Transfer tokens back to the seller
        token.transfer(seller, amount);
    }

    // World ID Verification

    /// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further details)
	/// @param root The root of the Merkle tree (returned by the JS widget).
	/// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
	/// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
	function verifyAndRegister(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public {
    require(nullifierHash != 0, "Nullifier hash cannot be 0");
		// First, we make sure this person hasn't done this before
		if (_addressToWorldcoinNullifierHash[msg.sender] != 0) revert AlreadyRegisteredNullifier();

		// We now verify the provided proof is valid and the user is verified by World ID
		_worldId.verifyProof(
			root,
			_worldcoinGroupId,
			abi.encodePacked(signal).hashToField(),
			nullifierHash,
			_worldcoinExternalNullifier,
			proof
		);

		// We now record the user has done this, so they can't do it again (proof of uniqueness)
		_addressToWorldcoinNullifierHash[msg.sender] = nullifierHash;
	}
    

    modifier onlyVerifiedHuman() {
        require(_addressToWorldcoinNullifierHash[msg.sender] != 0, "Address not registered");
        _;
    }

    function amountCheckKYC(uint256) view external {
        if(amount > 1000e6) {
            require(_addressToKycId[msg.sender] != 0, "Address needs to be kycd for amounts greater than 1000");
        }
    }

    // Polygon ID Verification

    function _beforeProofSubmit(
        uint64, /* requestId */
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view override {
        // check that the challenge input of the proof is equal to the msg.sender 
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        require(
            _msgSender() == addr,
            "address in the proof is not a sender address"
        );
    }

    function _afterProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal override {
        require(
            requestId == TRANSFER_REQUEST_ID && addressToId[_msgSender()] == 0,
            "proof can not be submitted more than once"
        );

        uint256 id = inputs[validator.getChallengeInputIndex()];
        _addressToKycId[_msgSender()] = id;
    }


}
