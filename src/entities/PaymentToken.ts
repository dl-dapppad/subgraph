import { Bytes } from "@graphprotocol/graph-ts";
import { PaymentToken } from "../../generated/schema";

export function getPaymentToken(token: Bytes): PaymentToken {
    let paymentToken = PaymentToken.load(token);

    if (paymentToken == null) {
        paymentToken = new PaymentToken(token);
    }

    return paymentToken;
}

export function getPaymentTokenWithoutCreate(token: Bytes): PaymentToken | null {
    return PaymentToken.load(token);
}
