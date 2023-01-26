import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserToProduct, Sale } from "../../generated/schema";

export function getSale(
    userToProduct: UserToProduct,
    ): Sale {
    const id = userToProduct.id.concatI32(userToProduct.counterOfSales.toI32());
    let sale = Sale.load(id);

    if (sale == null) {
        sale = new Sale(id);

        sale.productProxyAddress = Bytes.empty();
        sale.price = BigInt.zero();
        sale.points = BigInt.zero();
        sale.timestamp = BigInt.zero();

        sale.userToProduct = userToProduct.id;
    }

    return sale;
}