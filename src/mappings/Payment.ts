import { Payed } from "../../generated/Payment/Payment";
import { getProduct } from "../entities/Product";
import { getSale } from "../entities/Sale";

export function onPayed(event: Payed): void {
    const product = getProduct(event.params.productAlias);
    getSale(event.transaction.hash, event.params.payer, event.params.cashbackInPaymentToken, event.block.timestamp, product).save();
    
    product.save();
}