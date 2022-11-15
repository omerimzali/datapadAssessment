import { assertEquals } from "https://deno.land/std@0.164.0/testing/asserts.ts";
import { Brand } from "./brand.ts";

Deno.test("Brand Avg Purchase", async () => {
  const brand = new Brand("BrandName");
  brand.addPurchase(100);
  assertEquals(100, brand.getAvgRevenue());
});

Deno.test("Brand Get Name", async () => {
  const brand = new Brand("BrandName");
  brand.addPurchase(100);
  assertEquals("BrandName", brand.getName());
});
