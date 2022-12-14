import { assertEquals } from "https://deno.land/std@0.164.0/testing/asserts.ts";
import { Customer } from "./customer.ts";

Deno.test("Add Revenue", () => {
  const customer = new Customer("Customer");
  customer.addRevenue(100);
  assertEquals("100.00", customer.getNetRevenue());
});

Deno.test("Add Refund",  () => {
    const customer = new Customer("Customer");
    customer.addRevenue(100);
    customer.addRefund(50);
    assertEquals("50.00", customer.getNetRevenue());
  });

  
Deno.test("Get Customer",  () => {
  const customer = new Customer("CustomerName");
  assertEquals("CustomerName", customer.getName());
});
