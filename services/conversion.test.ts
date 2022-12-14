import { assertEquals } from "https://deno.land/std@0.164.0/testing/asserts.ts";
import { Conversion } from "./conversion.ts";

Deno.test("Conversion Purchased Number", ()=> {
  const conversion = new Conversion("Daily");
  conversion.addPurchase();
  assertEquals("1", conversion.getPurchases());
});

Deno.test("Conversion Sessions", () => {
  const conversion = new Conversion("Daily");
  conversion.addSession();
  assertEquals("1", conversion.getSessions());
});

Deno.test("Conversion Sessions - Multiple",  () => {
  const conversion = new Conversion("Daily");
  conversion.addSession();
  conversion.addSession();
  assertEquals("2", conversion.getSessions());
});

Deno.test("Conversion Type", () => {
  const conversion = new Conversion("Daily");
  conversion.addPurchase();
  assertEquals("Daily", conversion.getType());
});



Deno.test("Conversion Success Rate", () =>{
    const conversion = new Conversion("Daily");
    conversion.addPurchase();
    conversion.addSession();
    conversion.addSession();
    conversion.addSession();
    conversion.addSession();
    assertEquals(25, parseFloat(conversion.getSuccessRate()));
});