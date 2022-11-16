import { Context, helpers } from "https://deno.land/x/oak/mod.ts";
import { Spreadsheet } from "../services/spreadsheet.ts";

export const getMetrics = async (ctx: Context) => {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const responseBody = {};
  let values = {};
  const spreadsheet = await new Spreadsheet({
    type: "googlesheet"
  });

  if (
    params.id === "revenue" && params.dimensions === "brand" &&
    params.aggregate === "avg"
  ) {
    responseBody["values"] =  await spreadsheet.getAvgRevenueBrand();
  } else if (
    params.id === "sessions" &&
    params.dimensions === "date.weeknum" &&
    params.aggregate === "distinct"
  ) {
    responseBody["values"]  = await spreadsheet.getWeeklySessions();
  } else if (
    params.id === "conversion" &&
    params.dimensions === "date" &&
    params.aggregate === "distinct"
  ) {
    responseBody["values"] = await spreadsheet.getDailyConversion();
  } else if (
    params.id === "net-revenue" &&
    params.dimensions === "customer" &&
    params.aggregate === "sum"
  ) {
    responseBody["values"] = await spreadsheet.getRevenueListOfCustomer(
      params["filter.date.from"],
      params["filter.date.to"],
    );
  }

 
  responseBody["metric"] = params.id;
  responseBody["dimensions"] = [params.dimensions];
  responseBody["aggregation"] = params.aggregate;
  if (params["filter.date.from"]) {
    responseBody["date"] = {};
    responseBody["date"]["from"] = params["filter.date.from"];
    responseBody["date"]["to"] = params["filter.date.to"];
  }

   ctx.response.body = responseBody;
  return  ctx.response.body
};
