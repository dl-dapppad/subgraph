import { BigInt } from "@graphprotocol/graph-ts";
import { Deployed } from "../../generated/ProductFactory/ProductFactory";
import { getProductSale, getUserToProduct, getProductCounter } from "../entities";

export function onDeployed(event: Deployed): void {
    const userToProduct = getUserToProduct(event.params.payer, event.params.productAlias);
    const counter = getProductCounter(event.params.productAlias);
    const sale = getProductSale(counter, userToProduct);

    sale.productProxyAddress = event.params.proxy;
    sale.timestamp = event.block.timestamp;

    sale.paymentToken = event.params.paymentToken;
    sale.initialPrice = event.params.price;

    counter.productSalesCount = counter.productSalesCount.plus(BigInt.fromI32(1));

    sale.save();
    counter.save();
    userToProduct.save();
}