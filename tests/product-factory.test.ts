import { assert, beforeEach, describe, test, clearStore } from "matchstick-as/assembly/index";
import { handleDeploy } from "../src/product-factory";
import { createDeployedEvent } from "./_helpers";

beforeEach(() => {
  clearStore();
});

describe("handleDeploy()", () => {
  test("should create one new Product", () => {
    const deployer = "0x709ed5721249cd1d7a18914b867958283ad477ab";
    const proxy = "0xb829a11e6e50406aa86606ab37b85939914b9e19";
    const alias = "0x3472c9b670dfbe75af12c1d152ea52c92acc9a30fc73a369ddf0ec39f650b979";

    const event = createDeployedEvent(deployer, proxy, alias, "1", "2");
    handleDeploy(event);

    assert.fieldEquals("Product", proxy, "alias", alias);
    assert.fieldEquals("Product", proxy, "proxy", proxy);
    assert.fieldEquals("Product", proxy, "price", "1");
    assert.fieldEquals("Product", proxy, "cashback", "2");

    assert.fieldEquals("ProductCounter", alias, "count", "1");
  });

  test("should create few new Product", () => {
    const deployer = "0x709ed5721249cd1d7a18914b867958283ad477ab";

    const proxy1 = "0xb829a11e6e50406aa86606ab37b85939914b9e19";
    const alias1 = "0x3472c9b670dfbe75af12c1d152ea52c92acc9a30fc73a369ddf0ec39f650b979";
    const event1 = createDeployedEvent(deployer, proxy1, alias1, "1", "2");
    handleDeploy(event1);

    assert.fieldEquals("Product", proxy1, "alias", alias1);
    assert.fieldEquals("Product", proxy1, "proxy", proxy1);
    assert.fieldEquals("Product", proxy1, "price", "1");
    assert.fieldEquals("Product", proxy1, "cashback", "2");
    assert.fieldEquals("ProductCounter", alias1, "count", "1");


    const proxy2 = "0x1c40ec98ce0ca673a481dcd55bffdc35cb144879";
    const alias2 = "0xe6c3a2737c3418afa96e487f845823ade3241668e2f1c9a93c3b49b124bedd53";
    const event2 = createDeployedEvent(deployer, proxy2, alias2, "3", "4");
    handleDeploy(event2);

    assert.fieldEquals("Product", proxy2, "alias", alias2);
    assert.fieldEquals("Product", proxy2, "proxy", proxy2);
    assert.fieldEquals("Product", proxy2, "price", "3");
    assert.fieldEquals("Product", proxy2, "cashback", "4");
    assert.fieldEquals("ProductCounter", alias2, "count", "1");

    const proxy3 = "0xbe25c1dd013979e10e6628caeb707686dd1f73e3";
    const event3 = createDeployedEvent(deployer, proxy3, alias1, "5", "6");
    handleDeploy(event3);

    assert.fieldEquals("Product", proxy3, "alias", alias1);
    assert.fieldEquals("Product", proxy3, "proxy", proxy3);
    assert.fieldEquals("Product", proxy3, "price", "5");
    assert.fieldEquals("Product", proxy3, "cashback", "6");
    assert.fieldEquals("ProductCounter", alias1, "count", "2");
  });
});