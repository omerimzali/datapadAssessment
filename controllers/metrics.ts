import { Context, helpers } from "https://deno.land/x/oak/mod.ts";
import { Spreadsheet } from "../services/spreadsheet.ts";
import type { Metrics } from "../types/mod.ts";

export const getMetrics = async (ctx: Context) => {

  const params = helpers.getQuery(ctx, { mergeParams: true });

  const { id, dimensions, aggregate } = params;
  const responseBody:Metrics = {};
  
  let values = {};
  const spreadsheet = await new Spreadsheet({
    type: "googlesheet",
  });

  if (
    id === "revenue" && dimensions === "brand" &&
    aggregate === "avg"
  ) {
    responseBody["data"] = await spreadsheet.getAvgRevenueBrand();
  } else if (
    id === "sessions" &&
    dimensions === "date.weeknum" &&
    aggregate === "distinct"
  ) {
    responseBody["values"] = await spreadsheet.getWeeklySessions();
  } else if (
    id === "conversion" &&
    dimensions === "date" &&
    aggregate === "distinct"
  ) {
    responseBody["values"] = await spreadsheet.getDailyConversion();
  } else if (
    id === "net-revenue" &&
    dimensions === "customer" &&
    aggregate === "sum"
  ) {
    responseBody["values"] = await spreadsheet.getRevenueListOfCustomer(
      params["filter.date.from"],
      params["filter.date.to"],
    );
  }

  responseBody["metric"] = id;
  responseBody["dimensions"] = [dimensions];
  responseBody["aggregation"] = aggregate;
  if (params["filter.date.from"]) {
    responseBody["date"] = {};
    responseBody["date"]["from"] = params["filter.date.from"];
    responseBody["date"]["to"] = params["filter.date.to"];
  }

  ctx.response.body = responseBody;
  return ctx.response.body;
};
