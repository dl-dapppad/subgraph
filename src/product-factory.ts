import { BigInt } from "@graphprotocol/graph-ts";
import { Deployed } from "../generated/ProductFactory/ProductFactory";
import { Product, ProductCounter } from "../generated/schema";

export function handleDeploy(event: Deployed): void {
  const product = new Product(event.params.proxy);
  const alias = event.params.productAlias;

  product.deployer = event.transaction.from;
  product.alias = alias;
  product.proxy = event.params.proxy;
  product.price = event.params.price;
  product.cashback = event.params.cashback;
  product.timestamp = event.block.timestamp;

  product.save();

  let productCounter = ProductCounter.load(alias.toHexString());
  if (!productCounter) {
    productCounter = new ProductCounter(alias.toHexString());

    productCounter.count = BigInt.fromU32(1);
  } else {
    productCounter.count = productCounter.count.plus(BigInt.fromU32(1));
  }

  productCounter.save();
}
