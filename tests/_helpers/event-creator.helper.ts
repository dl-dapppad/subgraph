import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as/assembly/index";
import { Deployed } from "../../generated/ProductFactory/ProductFactory";

export function createDeployedEvent(
  deployer: string,
  proxy: string,
  alias: string,
  price: string,
  cahsback: string
): Deployed {
  const paymentAToken = "0x709ed5721249cd1d7a18914b867958283ad477ab";
  const mockEvent = newMockEvent();

  const event = new Deployed(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  mockEvent.transaction.from = Address.fromString(deployer);

  event.parameters.push(new ethereum.EventParam("productAlias", ethereum.Value.fromBytes(Bytes.fromHexString(alias))));
  event.parameters.push(new ethereum.EventParam("proxy", ethereum.Value.fromAddress(Address.fromString(proxy))));
  event.parameters.push(new ethereum.EventParam(
    "paymentToken",
    ethereum.Value.fromAddress(Address.fromString(paymentAToken))
  ));
  event.parameters.push(new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(price))));
  event.parameters.push(new ethereum.EventParam(
    "cahsback",
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(cahsback))
  ));

  return event;
}