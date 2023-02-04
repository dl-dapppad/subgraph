/* eslint-disable  @typescript-eslint/ban-types */

import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as/assembly/index";
import { Payed, PaymentTokenAdded, PaymentTokenRemoved } from "../../generated/Payment/Payment";
import { Deployed } from "../../generated/ProductFactory/ProductFactory";

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

export function createPaymentTokenAdded(
  token: Address,
): PaymentTokenAdded {
  const event = changetype<PaymentTokenAdded>(newMockEvent());

  event.parameters.push(new ethereum.EventParam("token", ethereum.Value.fromAddress(token)));

  return event;
}

export function createPaymentTokenRemoved(
  token: Address,
): PaymentTokenRemoved {
  const event = changetype<PaymentTokenRemoved>(newMockEvent());

  event.parameters.push(new ethereum.EventParam("token", ethereum.Value.fromAddress(token)));

  return event;
}

export function createDeployed(
  alias: Bytes,
  payer: Address,
  proxy: Address,
  paymentToken: Address,
  price: BigInt,
  cashback: BigInt,
  sender: Address,
  block: ethereum.Block,
  tx: ethereum.Transaction
): Deployed {
  const event = changetype<Deployed>(newMockEvent());

  event.parameters.push(new ethereum.EventParam("productAlias", ethereum.Value.fromBytes(alias)));
  event.parameters.push(new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer)));
  event.parameters.push(new ethereum.EventParam("proxy", ethereum.Value.fromAddress(proxy)));
  event.parameters.push(new ethereum.EventParam("paymentToken", ethereum.Value.fromAddress(paymentToken)));
  event.parameters.push(new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price)));
  event.parameters.push(new ethereum.EventParam("cashback", ethereum.Value.fromUnsignedBigInt(cashback)));
  
  event.address = sender;
  event.block = block;
  event.transaction = tx;

  return event;
}