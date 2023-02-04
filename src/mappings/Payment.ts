import { store, BigInt } from "@graphprotocol/graph-ts";
import { Payed, PaymentTokenAdded, PaymentTokenRemoved } from "../../generated/Payment/Payment";
import { 
    getProductSale,
    getUserToProduct,
    getProductCounter,
    getPaymentToken,
    getPaymentTokenWithoutCreate 
} from "../entities";

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

    sale.save();
    counter.save();
    userToProduct.save();
}


export function onPaymentTokenAdded(event: PaymentTokenAdded): void {
    const paymentToken = getPaymentToken(event.params.token);

    paymentToken.save();
}

export function onPaymentTokenRemoved(event: PaymentTokenRemoved): void {
    const id = event.params.token;
    const paymentToken = getPaymentTokenWithoutCreate(id);

    if (paymentToken) {
        store.remove("PaymentToken", id.toHexString());
    }
}