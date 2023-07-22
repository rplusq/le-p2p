import {
  OrderCancelled as OrderCancelledEvent,
  OrderCompleted as OrderCompletedEvent,
  OrderCreated as OrderCreatedEvent,
  OrderPayed as OrderPayedEvent,
  OrderReleased as OrderReleasedEvent,
  OrderReserved as OrderReservedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent
} from "../generated/LeP2P/LeP2P"
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
} from "../generated/schema"

export function handleOrderCancelled(event: OrderCancelledEvent): void {
  let entity = new OrderCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.LeP2P_id = event.params.id
  entity.reason = event.params.reason

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderCompleted(event: OrderCompletedEvent): void {
  let entity = new OrderCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.LeP2P_id = event.params.id
  entity.buyer = event.params.buyer
  entity.paymentProof = event.params.paymentProof

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderCreated(event: OrderCreatedEvent): void {
  let entity = new OrderCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.LeP2P_id = event.params.id
  entity.seller = event.params.seller
  entity.amount = event.params.amount
  entity.fiatToTokenExchangeRate = event.params.fiatToTokenExchangeRate
  entity.iban = event.params.iban

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderPayed(event: OrderPayedEvent): void {
  let entity = new OrderPayed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.LeP2P_id = event.params.id
  entity.buyer = event.params.buyer
  entity.paymentProof = event.params.paymentProof

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderReleased(event: OrderReleasedEvent): void {
  let entity = new OrderReleased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.LeP2P_id = event.params.id
  entity.reason = event.params.reason

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderReserved(event: OrderReservedEvent): void {
  let entity = new OrderReserved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.LeP2P_id = event.params.id
  entity.buyer = event.params.buyer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
