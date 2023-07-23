import {
  OrderCancelled as OrderCancelledEvent,
  OrderCompleted as OrderCompletedEvent,
  OrderCreated as OrderCreatedEvent,
  OrderPayed as OrderPayedEvent,
  OrderReleased as OrderReleasedEvent,
  OrderReserved as OrderReservedEvent,
} from "../generated/LeP2P/LeP2P";
import { Order } from "../generated/schema";
import { sendPushNotification } from "./PushNotification";

export const subgraphID = "reynaldoquintero/le-p2p";

export function handleOrderCreated(event: OrderCreatedEvent): void {
  let entity = new Order(event.params.id.toString());
  entity.seller = event.params.seller;
  entity.amount = event.params.amount;
  entity.fiatToTokenExchangeRate = event.params.fiatToTokenExchangeRate;
  entity.iban = event.params.iban;
  entity.status = "STANDBY";
  entity.save();
}

export function handleOrderCancelled(event: OrderCancelledEvent): void {
  let entity = Order.load(event.params.id.toString());
  if (entity == null) {
    return;
  }
  entity.reason = event.params.reason;
  entity.status = "CANCELLED";
  entity.save();
}

export function handleOrderCompleted(event: OrderCompletedEvent): void {
  let entity = Order.load(event.params.id.toString());
  if (entity == null) {
    return;
  }
  entity.status = "COMPLETED";
  entity.save();

  // Notification
  if (!event.params.buyer) return;

  let recipient = event.params.buyer.toHexString(),
    type = "3",
    title = "Transaction Completed!",
    body = `${entity.seller} has approved your transaction of ${entity.amount} USDC`,
    subject = "Transaction Completed!",
    message = `${entity.seller} has approved your transaction of ${entity.amount} USDC`,
    image = "https://cdn-icons-png.flaticon.com/512/3146/3146600.png",
    secret = "null";

  let notification = `{
    \"type\": \"${type}\", 
    \"title\": \"${title}\", 
    \"body\": \"${body}\", 
    \"subject\": \"${subject}\", 
    \"message\": \"${message}\", 
    \"image\": \"${image}\", 
    \"secret\": \"${secret}\"
  }`;

  sendPushNotification(recipient, notification);
}

export function handleOrderPayed(event: OrderPayedEvent): void {
  let entity = Order.load(event.params.id.toString());
  if (entity == null) {
    return;
  }
  entity.paymentProof = event.params.paymentProof;
  entity.status = "PAID";
  entity.save();
}

export function handleOrderReleased(event: OrderReleasedEvent): void {
  let entity = Order.load(event.params.id.toString());
  if (entity == null) {
    return;
  }
  entity.reason = event.params.reason;
  entity.status = "STANDBY";
  entity.buyer = null;
  entity.save();
}

export function handleOrderReserved(event: OrderReservedEvent): void {
  let entity = Order.load(event.params.id.toString());
  if (entity == null) {
    return;
  }
  entity.buyer = event.params.buyer;
  entity.status = "RESERVED";
  entity.save();
}
