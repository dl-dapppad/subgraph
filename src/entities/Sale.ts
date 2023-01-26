import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserToProduct, Sale } from "../../generated/schema";

export function getSale(
    userToProduct: UserToProduct,
    productProxyAddress:Bytes = Bytes.empty(),
    timestamp:BigInt = BigInt.zero(),
    ): Sale {
    const id = userToProduct.id.concatI32(userToProduct.counterOfSales.toI32());
    let sale = Sale.load(id);

    if (sale == null) {
        sale = new Sale(id);

        sale.productProxyAddress = productProxyAddress;
        sale.price = BigInt.zero();
        sale.points = BigInt.zero();
        sale.timestamp = timestamp;

        sale.userToProduct = userToProduct.id;
    }

    return sale;
}