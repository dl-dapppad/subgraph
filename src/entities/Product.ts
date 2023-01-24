import { Bytes } from "@graphprotocol/graph-ts";
import { Product } from "../../generated/schema";

export function getProduct(alias: Bytes): Product {
    let product = Product.load(alias);

    if (product == null) {
        product = new Product(alias);
    }

    return product;
}