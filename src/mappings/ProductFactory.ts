import { Deployed } from "../../generated/ProductFactory/ProductFactory";
import { getSale } from "../entities/Sale";
import { getUser } from "../entities/User";
import { getUserToProduct } from "../entities/UserToProduct";

export function onDeployed(event: Deployed): void {
    const user = getUser(event.params.payer);
    const userToProduct = getUserToProduct(user, event.params.productAlias);

    getSale(userToProduct, event.params.paymentToken, event.block.timestamp).save();

    userToProduct.save();
    user.save();
}