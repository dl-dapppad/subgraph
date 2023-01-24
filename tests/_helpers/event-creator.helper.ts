import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as/assembly/index";
import { Payed } from "../../generated/Payment/Payment";

export function createPayed(
  payer: Address,
  paymentToken: Address,
  alias: Bytes,
  priceInPaymentToken: BigInt,
  cashbackInPaymentToken: BigInt,
  sender: Address,
  block: ethereum.Block,
  tx: ethereum.Transaction
): Payed {
  const event = changetype<Payed>(newMockEvent());
  event.parameters = new Array();

  event.parameters.push(new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer)));
  event.parameters.push(new ethereum.EventParam("paymentToken", ethereum.Value.fromAddress(paymentToken)));
  event.parameters.push(new ethereum.EventParam("productAlias", ethereum.Value.fromBytes(alias)));
  event.parameters.push(new ethereum.EventParam(
    "priceInPaymentToken", ethereum.Value.fromUnsignedBigInt(priceInPaymentToken))
  );
  event.parameters.push(
    new ethereum.EventParam("cashbackInPaymentToken", ethereum.Value.fromUnsignedBigInt(cashbackInPaymentToken))
  );
  
  event.address = sender;
  event.block = block;
  event.transaction = tx;

  return event;
}