import { Deployed } from "../../generated/ProductFactory/ProductFactory";
import { getProductCounter } from "../entities/ProductCounter";
import { getProductSale } from "../entities/ProductSale";
import { getUserToProduct } from "../entities/UserToProduct";

export function onDeployed(event: Deployed): void {
    const userToProduct = getUserToProduct(event.params.payer, event.params.productAlias);
    const counter = getProductCounter(event.params.productAlias);
    const sale = getProductSale(counter, userToProduct);

    sale.productProxyAddress = event.params.proxy;
    sale.timestamp = event.block.timestamp;

    sale.paymentToken = event.params.paymentToken;
    sale.initialPrice = event.params.price;

    sale.save();
    counter.save();
    userToProduct.save();
}