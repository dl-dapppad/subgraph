import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { afterEach, assert, clearStore, describe, test } from "matchstick-as";
import {
    createPayed,
    createPaymentTokenAdded,
    createPaymentTokenRemoved,
    getBlock,
    getNextBlock,
    getNextTx,
    getTransaction
} from "./_helpers";
import { onPayed, onPaymentTokenAdded, onPaymentTokenRemoved } from "../src/mappings/Payment";

let block = getBlock(BigInt.fromI32(1), BigInt.fromI32(1));
let tx = getTransaction(Bytes.fromI32(1));

describe("Payment", () => {
    describe("onPayed()", () => {
        afterEach(() => {
            block = getNextBlock(block);
            tx = getNextTx(tx);

            clearStore();
        });
        test("should handle `Payed` event", () => {
            const sender = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181600");
            const payer = Address.fromString("0x0711BE4a30a2BE3b7902F4E19F9CDB530b34c6F6");
            const paymentToken = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181670");
            const alias = Bytes.fromHexString("0x8ae85d849167ff996c04040c44924fd364217285e4cad818292c7ac37c0a345b");
            const priceInPaymentToken = BigInt.fromI32(10).pow(18);
            const cashbackInPaymentToken = BigInt.fromI32(5).pow(18);

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
            
            const utpId = payer.concat(alias).toHexString();
            const psId = alias.concatI32(0).toHexString();

            assert.fieldEquals("UserToProduct", utpId, "totalPoints", cashbackInPaymentToken.toString());      
            assert.fieldEquals("UserToProduct", utpId, "user", payer.toHexString());
            assert.fieldEquals("UserToProduct", utpId, "product", alias.toHexString());
            assert.fieldEquals("ProductSale", psId, "points", cashbackInPaymentToken.toString());
            assert.fieldEquals("ProductSale", psId, "paymentPrice", priceInPaymentToken.toString());
            assert.fieldEquals("ProductCounter", alias.toHexString(), "usersBought", "1");
            assert.fieldEquals("ProductCounter", alias.toHexString(), "productSalesCount", "0");
        });
    });
    describe("onPaymentTokenAdded()", () => {
        test("should handle `PaymentTokenAdded` event", () => {
            const token1 = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181600");
            const token2 = Address.fromString("0xd633c1029ce7268f2c019ba7a85cf5eb9071f814");

            const event1 = createPaymentTokenAdded(token1);
            const event2 = createPaymentTokenAdded(token2);

            onPaymentTokenAdded(event1);
            onPaymentTokenAdded(event2);

            assert.fieldEquals("PaymentToken", token1.toHexString(), "id", token1.toHexString());
            assert.fieldEquals("PaymentToken", token2.toHexString(), "id", token2.toHexString());
        });
        test("should handle `PaymentTokenRemoved` event", () => {
            const token1 = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181600");

            const event1 = createPaymentTokenAdded(token1);
            const event2 = createPaymentTokenRemoved(token1);

            onPaymentTokenAdded(event1);
            onPaymentTokenRemoved(event2);

            assert.notInStore("PaymentToken", token1.toHexString());
        });
    });
    describe("onPaymentTokenRemoved()", () => {
        test("should handle `PaymentTokenRemoved` event, when token not in store", () => {
            const token1 = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181600");

            const event1 = createPaymentTokenRemoved(token1);

            onPaymentTokenRemoved(event1);

            assert.notInStore("PaymentToken", token1.toHexString());
        });
    });
});