import { config } from "./deps.ts";
await config({export: true});
export const APP_HOST = Deno.env.get("APP_HOST") || "127.0.0.1";
export const APP_PORT = Deno.env.get("APP_PORT") || 3002;
export const GOOGLE_SHEET_API_URL = Deno.env.get("GOOGLE_SHEET_API_URL");
export const SPREADSHEET_ID = Deno.env.get("SPREADSHEET_ID");
export const API_KEY = Deno.env.get("API_KEY");
export const SHEET_NAME = Deno.env.get("SHEET_NAME");
