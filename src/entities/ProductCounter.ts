import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { ProductCounter } from "../../generated/schema";

export function getProductCounter(
    alias: Bytes,
    ): ProductCounter {
    let counter = ProductCounter.load(alias);

    if (counter == null) {
        counter = new ProductCounter(alias);

        counter.productSalesCount = BigInt.zero();
        counter.usersBought = BigInt.zero();
    }

    return counter;
}