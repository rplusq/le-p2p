import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  OrderCancelled,
  OrderCompleted,
  OrderCreated,
  OrderPayed,
  OrderReleased,
  OrderReserved,
  OwnershipTransferred,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/LeP2P/LeP2P"

export function createOrderCancelledEvent(
  id: BigInt,
  reason: string
): OrderCancelled {
  let orderCancelledEvent = changetype<OrderCancelled>(newMockEvent())

  orderCancelledEvent.parameters = new Array()

  orderCancelledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  orderCancelledEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )

  return orderCancelledEvent
}

export function createOrderCompletedEvent(
  id: BigInt,
  buyer: Address,
  paymentProof: string
): OrderCompleted {
  let orderCompletedEvent = changetype<OrderCompleted>(newMockEvent())

  orderCompletedEvent.parameters = new Array()

  orderCompletedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  orderCompletedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  orderCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "paymentProof",
      ethereum.Value.fromString(paymentProof)
    )
  )

  return orderCompletedEvent
}

export function createOrderCreatedEvent(
  id: BigInt,
  seller: Address,
  amount: BigInt,
  fiatToTokenExchangeRate: BigInt,
  iban: string
): OrderCreated {
  let orderCreatedEvent = changetype<OrderCreated>(newMockEvent())

  orderCreatedEvent.parameters = new Array()

  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "fiatToTokenExchangeRate",
      ethereum.Value.fromUnsignedBigInt(fiatToTokenExchangeRate)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("iban", ethereum.Value.fromString(iban))
  )

  return orderCreatedEvent
}

export function createOrderPayedEvent(
  id: BigInt,
  buyer: Address,
  paymentProof: string
): OrderPayed {
  let orderPayedEvent = changetype<OrderPayed>(newMockEvent())

  orderPayedEvent.parameters = new Array()

  orderPayedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  orderPayedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  orderPayedEvent.parameters.push(
    new ethereum.EventParam(
      "paymentProof",
      ethereum.Value.fromString(paymentProof)
    )
  )

  return orderPayedEvent
}

export function createOrderReleasedEvent(
  id: BigInt,
  reason: string
): OrderReleased {
  let orderReleasedEvent = changetype<OrderReleased>(newMockEvent())

  orderReleasedEvent.parameters = new Array()

  orderReleasedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  orderReleasedEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )

  return orderReleasedEvent
}

export function createOrderReservedEvent(
  id: BigInt,
  buyer: Address
): OrderReserved {
  let orderReservedEvent = changetype<OrderReserved>(newMockEvent())

  orderReservedEvent.parameters = new Array()

  orderReservedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  orderReservedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return orderReservedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}
