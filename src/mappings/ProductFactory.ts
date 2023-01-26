import { Deployed } from "../../generated/ProductFactory/ProductFactory";
import { getSale } from "../entities/Sale";
import { getUser } from "../entities/User";
import { getUserToProduct } from "../entities/UserToProduct";

export function onDeployed(event: Deployed): void {
    const user = getUser(event.params.payer);
    const userToProduct = getUserToProduct(user, event.params.productAlias);
    const sale = getSale(userToProduct);

    sale.productProxyAddress = event.params.proxy;
    sale.timestamp = event.block.timestamp;

    sale.save();
    userToProduct.save();
    user.save();
}