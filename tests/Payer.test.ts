import { Address, BigInt, Bytes, store } from "@graphprotocol/graph-ts";
import { getBlock, getNextBlock, getNextTx, getTransaction } from "./utils";
import { createPayed } from "./_helpers";
import { afterEach, assert, clearStore, describe, test } from "matchstick-as";
import { onPayed } from "../src/mappings/Payment";

let block = getBlock(BigInt.fromI32(1), BigInt.fromI32(1));
let tx = getTransaction(Bytes.fromI32(1));
const sender = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181600");

describe("Payer", () => {
    describe("onPayed()", () => {
        afterEach(() => {
            block = getNextBlock(block);
            tx = getNextTx(tx);
            clearStore();
        });

        test("should handle Payed event", () => {
            const payer = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181679");
            const paymentToken = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181670");
            const alias = Bytes.fromHexString("0x8ae85d849167ff996c04040c44924fd364217285e4cad818292c7ac37c0a345b");
            const priceInPaymentToken = BigInt.fromI32(10).pow(18);
            const cashbackInPaymentToken = BigInt.fromI32(10).pow(18).times(BigInt.fromI32(5));

            const event = createPayed(
                payer, 
                paymentToken,
                alias,
                priceInPaymentToken,
                cashbackInPaymentToken,
                sender,
                block,
                tx
            );

            onPayed(event);
            
            assert.fieldEquals(
                "UserToProduct",
                payer.concat(alias).toHexString(),
                "totalPoints",
                cashbackInPaymentToken.toString()
            );
            assert.fieldEquals(
                "UserToProduct",
                payer.concat(alias).toHexString(),
                "counterOfSales",
                "1"
            );

            assert.fieldEquals(
                "Sale",
                payer.concat(alias).concatI32(0).toHexString(),
                "points",
                cashbackInPaymentToken.toString()
            );
            assert.fieldEquals(
                "Sale",
                payer.concat(alias).concatI32(0).toHexString(),
                "price",
                priceInPaymentToken.toString()
            );
            
            assert.assertNotNull(store.get("User", payer.toHexString()));
        });

        test("should handle Payed event twice in one tx", () => {
            const payer = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181679");
            const paymentToken = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181670");
            const alias = Bytes.fromHexString("0x8ae85d849167ff996c04040c44924fd364217285e4cad818292c7ac37c0a345b");
            const priceInPaymentToken = BigInt.fromI32(10).pow(18);
            const cashbackInPaymentToken = BigInt.fromI32(10).pow(18).times(BigInt.fromI32(5));

            const event = createPayed(
                payer,
                paymentToken,
                alias,
                priceInPaymentToken,
                cashbackInPaymentToken,
                sender,
                block,
                tx
            );

            onPayed(event);

            onPayed(event);

            assert.fieldEquals(
                "UserToProduct",
                payer.concat(alias).toHexString(),
                "totalPoints",
                cashbackInPaymentToken.plus(cashbackInPaymentToken).toString()
            );
            assert.fieldEquals(
                "UserToProduct",
                payer.concat(alias).toHexString(),
                "counterOfSales",
                "2"
            );

            assert.fieldEquals(
                "Sale",
                payer.concat(alias).concatI32(0).toHexString(),
                "points",
                cashbackInPaymentToken.toString()
            );
            assert.fieldEquals(
                "Sale",
                payer.concat(alias).concatI32(0).toHexString(),
                "price",
                priceInPaymentToken.toString()
            );
     
            assert.fieldEquals(
                "Sale",
                payer.concat(alias).concatI32(1).toHexString(),
                "points",
                cashbackInPaymentToken.toString()
            );
            assert.fieldEquals(
                "Sale",
                payer.concat(alias).concatI32(1).toHexString(),
                "price",
                priceInPaymentToken.toString()
            );
            
            assert.assertNotNull(store.get("User", payer.toHexString()));
        });
    });
});