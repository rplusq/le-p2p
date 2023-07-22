import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
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
});
