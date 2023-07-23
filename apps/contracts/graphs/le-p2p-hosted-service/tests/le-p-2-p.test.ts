import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as";
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { OrderCancelled } from "../generated/schema";
import { OrderCancelled as OrderCancelledEvent } from "../generated/LeP2P/LeP2P";
import { handleOrderCancelled } from "../src/le-p-2-p";
import { createOrderCancelledEvent } from "./le-p-2-p-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = BigInt.fromI32(234);
    let reason = "Example string value";
    let newOrderCancelledEvent = createOrderCancelledEvent(id, reason);
    handleOrderCancelled(newOrderCancelledEvent);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("OrderCancelled created and stored", () => {
    assert.entityCount("OrderCancelled", 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "OrderCancelled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "reason",
      "Example string value"
    );

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  });
});
