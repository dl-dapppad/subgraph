import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserToProduct } from "../../generated/schema";

export function getUserToProduct(userAddress: Address, product: Bytes): UserToProduct {
    const id = userAddress.concat(product);
    let userToProduct = UserToProduct.load(id);

    if (userToProduct == null) {
        userToProduct = new UserToProduct(id);

        userToProduct.product = product;
        userToProduct.user = userAddress;
        userToProduct.totalPoints = BigInt.zero();
    }

    return userToProduct;
}