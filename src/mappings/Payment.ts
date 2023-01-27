import { BigInt } from "@graphprotocol/graph-ts";
import { Payed } from "../../generated/Payment/Payment";
import { getProductSale } from "../entities/ProductSale";
import { getUserToProduct } from "../entities/UserToProduct";
import { getProductCounter } from "../entities/ProductCounter";

export function onPayed(event: Payed): void {
    const userToProduct = getUserToProduct(event.params.payer, event.params.productAlias);
    const counter = getProductCounter(event.params.productAlias);
    const sale = getProductSale(counter, userToProduct);

    sale.points = event.params.cashbackInPaymentToken;
    sale.paymentPrice = event.params.priceInPaymentToken;
    
    if (userToProduct.totalPoints.equals(BigInt.zero())) {
        counter.usersBought = counter.usersBought.plus(BigInt.fromI32(1));
    }

    userToProduct.totalPoints = userToProduct.totalPoints.plus(event.params.cashbackInPaymentToken);

    counter.productSalesCount = counter.productSalesCount.plus(BigInt.fromI32(1));

    sale.save();
    counter.save();
    userToProduct.save();
}