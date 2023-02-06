
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { assert, describe, test } from "matchstick-as";
import { createDeployed, createPayed, getBlock, getTransaction } from "./_helpers";
import { onDeployed } from "../src/mappings/ProductFactory";
import { onPayed } from "../src/mappings/Payment";

const block = getBlock(BigInt.fromI32(1), BigInt.fromI32(1));
const tx = getTransaction(Bytes.fromI32(1));
const sender = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181600");

describe("deploy()", () => {
    test("should handle full deploy() sequence", () => {
        const proxy = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181678");
        const payer = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181679");
        const paymentToken = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181670");
        const alias = Bytes.fromHexString("0x8ae85d849167ff996c04040c44924fd364217285e4cad818292c7ac37c0a345b");
        const price = BigInt.fromI32(10).pow(18);
        const cashback = BigInt.fromI32(10).pow(18).times(BigInt.fromI32(5));
        const priceInPaymentToken = BigInt.fromI32(10).pow(5);
        const cashbackInPaymentToken = BigInt.fromI32(10).pow(6);

        const payed = createPayed(
            payer, 
            paymentToken, 
            alias, 
            priceInPaymentToken, 
            cashbackInPaymentToken, 
            sender, 
            block, 
            tx
        );

        onPayed(payed);

        const deploy = createDeployed(alias, payer, proxy, paymentToken, price, cashback, sender, block, tx);
        
        onDeployed(deploy);
        
        const utpId = payer.concat(alias).toHexString();
        const psId = alias.concatI32(0).toHexString();

        assert.fieldEquals("UserToProduct", utpId, "totalPoints", cashbackInPaymentToken.toString());      
        assert.fieldEquals("UserToProduct", utpId, "user", payer.toHexString());
        assert.fieldEquals("UserToProduct", utpId, "product", alias.toHexString());
        assert.fieldEquals("ProductSale", psId, "points", cashbackInPaymentToken.toString());
        assert.fieldEquals("ProductSale", psId, "paymentPrice", priceInPaymentToken.toString());
        assert.fieldEquals("ProductCounter", alias.toHexString(), "usersBought", "1");
        assert.fieldEquals("ProductCounter", alias.toHexString(), "productSalesCount", "1");
        assert.fieldEquals("ProductSale", psId, "productProxyAddress", proxy.toHexString());
        assert.fieldEquals("ProductSale", psId, "timestamp", block.timestamp.toString());
        assert.fieldEquals("ProductSale", psId, "paymentToken", paymentToken.toHexString());
        assert.fieldEquals("ProductSale", psId, "initialPrice", price.toString());
    });
});