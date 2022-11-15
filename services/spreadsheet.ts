import * as mod from "https://deno.land/std@0.164.0/collections/mod.ts";
import { Brand } from "./brand.ts";
import { parse as parseCsv } from "https://deno.land/std@0.82.0/encoding/csv.ts";

export interface DataSourceOptions {
  type: "file" | "googlesheet";
  source: string;
}

export class Spreadsheet {
  dataType: string;
  source: string;
  data?:any;
  constructor(
    options: DataSourceOptions = {
      type: "googlesheet",
      source: "goooglesheetURL",
    },
  ) {
    console.log(options);
    this.dataType = options.type;
    this.source = options.source;

  }

  private async readSpreadsheet() {
    switch (this.dataType) {
      case "googlesheet":
        return await this.readGoogleSheet();
        break;
      case "file":
        return await this.readFile();
        break;
    }
  }

  private async readGoogleSheet() {
    /** @todo */
    this.readFile();
  }

  private async readFile() {
    const content = await parseCsv(
      await Deno.readTextFileSync(this.source),
      {
        skipFirstRow: true,
        columns: [
          "evenTime",
          "eventType",
          "product",
          "category",
          "categoryCode",
          "brand",
          "price",
          "user",
          "session",
        ],
      },
    );
    return content;
  }

  public async getData() {
    return this.data;
  }

  public async getAvgRevenueBrand() {
    const result:any = {};
    const brands:any = {};
    this.data = await this.readSpreadsheet();

    this.data.forEach((element) => {
      if(element.eventType === 'purchase'){

        if(!brands[element.brand]){
          let brand = new Brand(element.brand);
          brands[element.brand] = brand;
        }
    
        brands[element.brand].addPurchase(parseFloat(element.price));
        result[element.brand] = {"value":brands[element.brand].getAvgRevenue()};
      }
    });
    return result;
  }

  public async getWeeklySessions() {
  }

  public async getDailyConversion() {
  }

  public async getRevenueListOfCustomer(from_date: string, end_date: string) {
  }
}
