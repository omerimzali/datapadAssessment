import { Context, helpers } from "https://deno.land/x/oak/mod.ts";
import { Spreadsheet } from "../services/spreadsheet.ts";
import type { Metrics } from "../types/mod.ts";

export const getMetrics = async (ctx: Context) => {
  const params = helpers.getQuery(ctx, { mergeParams: true });

  const { id, dimensions, aggregate } = params;

  const request = {
    id,
    dimensions,
    aggregate,
  };

  const responseBody: Metrics = {};

  let values = {};
  const spreadsheet = await new Spreadsheet({
    type: "googlesheet",
  });

  const CASES = [{
    id: "revenue",
    dimensions: "brand",
    aggregate: "avg",
    func: spreadsheet.getAvgRevenueBrand(),
  }, {
    id: "sessions",
    dimensions: "date.weeknum",
    aggregate: "distinct",
    func: spreadsheet.getWeeklySessions(),
  }, {
    id: "conversion",
    dimensions: "date",
    aggregate: "distinct",
    func: spreadsheet.getDailyConversion(),
  }, {
    id: "net-revenue",
    dimensions: "customer",
    aggregate: "sum",
    func: spreadsheet.getRevenueListOfCustomer(
      params["filter.date.from"],
      params["filter.date.to"],
    ),
  }];

  responseBody.metric = id;
  responseBody.dimensions = [dimensions];
  responseBody.aggregation = aggregate;


  if (params["filter.date.from"]) {
    responseBody["filter"]["date"] = {};
    responseBody["filter"]["date"]["from"] = params["filter.date.from"];
    responseBody["filter"]["date"]["to"] = params["filter.date.to"];
  }
  
  try {
    responseBody.data = await CASES.find((CASE) =>
      CASE.aggregate === request.aggregate &&
      CASE.dimensions === request.dimensions && CASE.id === request.id
    ).func;
  } catch (e) {
    return ctx.response.body;
  }
 


  ctx.response.body = responseBody;
  return ctx.response.body;
};
