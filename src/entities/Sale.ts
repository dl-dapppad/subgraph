import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Product, Sale } from "../../generated/schema";
import { getInteractionCount } from "./InteractionCount";
import { increaseCounter } from "../helpers/IncreaseCounter";

export function getSale(hash: Bytes, buyer: Bytes, points: BigInt, timestamp:BigInt, product: Product): Sale {
    const counter = getInteractionCount(hash);

    const id = hash.concatI32(counter.count.toI32());
    let sale = Sale.load(id);

    if (sale == null) {
        sale = new Sale(id);

        sale.buyer = buyer;
        sale.points = points;

        sale.timestamp = timestamp;

        sale.product = product.id;

        increaseCounter(counter);
    }

    return sale;
}