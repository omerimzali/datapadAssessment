import { assertEquals } from "https://deno.land/std@0.164.0/testing/asserts.ts";
import { Spreadsheet } from "./spreadsheet.ts";

Deno.test("Getting Avg. Revenue By Brand", async () =>  {
  const spreadsheet = new Spreadsheet({ type: "file", source: "file" });
  const avgRevenueByBrand = await spreadsheet.getAvgRevenueBrand();
  assertEquals(100,avgRevenueByBrand["Brand1"]["value"]);
});

Deno.test("Weekly Sessions", async () =>  {
  const spreadsheet = new Spreadsheet({ type: "file", source: "file" });
  const weeklySessions = await spreadsheet.getWeeklySessions();
  assertEquals(2,weeklySessions[2]["value"]);
});

Deno.test("Daily Conversion Date", async () =>  {
  const spreadsheet = new Spreadsheet({ type: "file", source: "file" });
  const dailyConversions = await spreadsheet.getDailyConversion();
  assertEquals(2,dailyConversions["2020-10-09"]["sessions"]);
  assertEquals(2,dailyConversions["2020-10-09"]["purchases"]);
  assertEquals("100",dailyConversions["2020-10-09"]["value"]);
});

Deno.test("Net Revenue of Each Customer", async () =>  {
  const spreadsheet = new Spreadsheet({ type: "file", source: "file" });
  const netRevenueList = await spreadsheet.getRevenueListOfCustomer();
  assertEquals(100,netRevenueList["Omer"]["value"]);
});
