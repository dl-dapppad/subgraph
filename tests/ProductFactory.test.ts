import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { afterEach, assert, clearStore, describe, test } from "matchstick-as";
import { createDeployed, getBlock, getNextBlock, getNextTx, getTransaction } from "./_helpers";
import { onDeployed } from "../src/mappings/ProductFactory";

let block = getBlock(BigInt.fromI32(1), BigInt.fromI32(1));
let tx = getTransaction(Bytes.fromI32(1));
const sender = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181600");

describe("ProductFactory", () => {
    describe("onDeployed()", () => {
        afterEach(() => {
            block = getNextBlock(block);
            tx = getNextTx(tx);
            clearStore();
        });

        test("should handle `Deployed` event", () => {
            const proxy = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181678");
            const payer = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181679");
            const paymentToken = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181670");
            const alias = Bytes.fromHexString("0x8ae85d849167ff996c04040c44924fd364217285e4cad818292c7ac37c0a345b");
            const price = BigInt.fromI32(10).pow(18);
            const cashback = BigInt.fromI32(10).pow(18).times(BigInt.fromI32(5));

            const event = createDeployed(
                alias,
                payer,
                proxy,
                paymentToken,
                price,
                cashback,
                sender,
                block,
                tx
            );

            onDeployed(event);

            const id = alias.concatI32(0).toHexString();
            assert.fieldEquals("ProductSale", id, "productProxyAddress", proxy.toHexString());
            assert.fieldEquals("ProductSale", id, "timestamp", block.timestamp.toString());
            assert.fieldEquals("ProductSale", id, "paymentToken", paymentToken.toHexString());
            assert.fieldEquals("ProductSale", id, "initialPrice", price.toString());
        });
    });
});