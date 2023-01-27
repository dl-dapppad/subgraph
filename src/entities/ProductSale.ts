import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserToProduct, ProductSale, ProductCounter } from "../../generated/schema";

export function getProductSale(
    productCounter: ProductCounter,
    userToProduct: UserToProduct
    ): ProductSale {
    const id = userToProduct.product.concatI32(productCounter.productSalesCount.toI32());
    let sale = ProductSale.load(id);

    if (sale == null) {
        sale = new ProductSale(id);

        sale.productProxyAddress = Bytes.empty();
        sale.points = BigInt.zero();
        sale.timestamp = BigInt.zero();

        sale.paymentToken = Bytes.empty();
        sale.initialPrice = BigInt.zero();
        sale.paymentPrice = BigInt.zero();

        sale.userToProduct = userToProduct.id;
    }

    return sale;
}