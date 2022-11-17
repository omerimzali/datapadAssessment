import { Context, helpers } from "https://deno.land/x/oak/mod.ts";
import { Spreadsheet } from "../services/spreadsheet.ts";
import type { Metrics } from "../types/mod.ts";

enum AggregateOptions {
  Avg = "avg",
  Distinct = "distinct",
  Sum = "sum"
}

enum IdOptions {
  Revenue="revenue",
  Sessions="sessions",
  NetRevenue="net-revenue",
  Conversion="conversion"
}

enum DimensionOptions {
  Brand = "brand",
  Date = "date",
  Week = "date.weeknum",
  Customer = "customer"
}
export const getMetrics = async (ctx: Context) => {
  const params = helpers.getQuery(ctx, { mergeParams: true });

  const { id, dimensions, aggregate } = params;

  const request = {
    id,
    dimensions,
    aggregate,
  };

  const responseBody: Metrics = {};


  const spreadsheet = await new Spreadsheet({
    type: "googlesheet",
  });

  const CASES = [{
    id:    IdOptions.Revenue,
    dimensions: DimensionOptions.Brand,
    aggregate:  AggregateOptions.Avg,
    func: spreadsheet.getAvgRevenueBrand(),
  }, {
    id:    IdOptions.Sessions,
    dimensions:  DimensionOptions.Week,
    aggregate: AggregateOptions.Distinct,
    func: spreadsheet.getWeeklySessions(),
  }, {
    id:    IdOptions.Conversion,
    dimensions: DimensionOptions.Date,
    aggregate: AggregateOptions.Distinct,
    func: spreadsheet.getDailyConversion(),
  }, {
    id:   IdOptions.NetRevenue,
    dimensions: DimensionOptions.Customer,
    aggregate: AggregateOptions.Sum,
    func: spreadsheet.getRevenueListOfCustomer(
      params["filter.date.from"],
      params["filter.date.to"],
    ),
  }];

  responseBody.metric = id;
  responseBody.dimensions = [dimensions];
  responseBody.aggregation = aggregate;


  if (params["filter.date.from"]) {
    responseBody["filter"] = {};
    responseBody["filter"]["date"] = {};
    responseBody["filter"]["date"]["from"] = params["filter.date.from"];
    responseBody["filter"]["date"]["to"] = params["filter.date.to"];
  }


    responseBody.data = await CASES.find((CASE) =>
      CASE.aggregate === request.aggregate &&
      CASE.dimensions === request.dimensions && CASE.id === request.id
    ).func;
  

  ctx.response.body = responseBody;
  return ctx.response.body;
};
