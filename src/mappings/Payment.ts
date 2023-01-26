import { BigInt } from "@graphprotocol/graph-ts";
import { Payed } from "../../generated/Payment/Payment";
import { getSale } from "../entities/Sale";
import { getUser } from "../entities/User";
import { getUserToProduct } from "../entities/UserToProduct";

export function onPayed(event: Payed): void {
    const user = getUser(event.params.payer);
    const userToProduct = getUserToProduct(user, event.params.productAlias);
    const sale = getSale(userToProduct);

    sale.points = event.params.cashbackInPaymentToken;
    sale.price = event.params.priceInPaymentToken;

    userToProduct.totalPoints = userToProduct.totalPoints.plus(event.params.cashbackInPaymentToken);
    userToProduct.counterOfSales = userToProduct.counterOfSales.plus(BigInt.fromI32(1));

    sale.save();
    userToProduct.save();
    user.save();
}