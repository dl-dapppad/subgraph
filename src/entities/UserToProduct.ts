import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { User, UserToProduct } from "../../generated/schema";

export function getUserToProduct(user: User, product: Bytes): UserToProduct {
    const id = user.id.concat(product);
    let userToProduct = UserToProduct.load(id);

    if (userToProduct == null) {
        userToProduct = new UserToProduct(id);

        userToProduct.product = product;
        userToProduct.totalPoints = BigInt.zero();
        userToProduct.counterOfSales = BigInt.zero();

        userToProduct.user = user.id; 
    }

    return userToProduct;
}