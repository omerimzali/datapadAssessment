import { assertEquals } from "https://deno.land/std@0.164.0/testing/asserts.ts";
import { Customer } from "./customer.ts";

Deno.test("Brand Add Revenue", async () => {
  const customer = new Customer("Customer");
  customer.addRevenue(100);
  assertEquals(100, customer.getNetRevenue());
});

Deno.test("Get Customer", async () => {
  const customer = new Customer("CustomerName");
  assertEquals("CustomerName", customer.getName());
});
