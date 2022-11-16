import { assertEquals } from "https://deno.land/std@0.164.0/testing/asserts.ts";
import { Spreadsheet } from "./spreadsheet.ts";

Deno.test("Getting Avg. Revenue By Brand", async () =>  {
  const spreadsheet = new Spreadsheet({ type: "file", source: "data/test-data.csv" });
  const avgRevenueByBrand = await spreadsheet.getAvgRevenueBrand();
  assertEquals(100,avgRevenueByBrand["Brand1"]["value"]);
});

