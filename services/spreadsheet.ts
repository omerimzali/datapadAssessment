import * as mod from "https://deno.land/std@0.164.0/collections/mod.ts";
import { Brand } from "./brand.ts";
import { Conversion } from "./conversion.ts";
import { parse as parseCsv } from "https://deno.land/std@0.164.0/encoding/csv.ts";
import { parse,format } from "https://deno.land/std@0.164.0/datetime/mod.ts";

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
    this.data = content;
    return content;
  }

  public async getData() {
    return this.data;
  }

  public async getAvgRevenueBrand() {
    const result:any = {};
    const brands:any = {};

    this.data =  await this.readSpreadsheet();

    this.data.forEach((element) => {
      if(element.eventType === 'purchase'){

        if(!brands[element.brand]){
          let brand = new Brand(element.brand);
          brands[element.brand] = brand;
        }
    
        brands[element.brand].addPurchase(parseFloat(element.price));
        result[element.brand] = {"value":brands[element.brand].getAvgRevenue()}; /** @todo Move this line out of this loop */
      }
    });
    return result;
  }

  public async getWeeklySessions() {
  }

  public async getDailyConversion() {
    const result = {};
    const days = {};
    const sessions = {};

    await this.readSpreadsheet();

    this.data.forEach((element) => {
    
      let day = parse(element.evenTime, "d/M/yyyy H:mm:ss"); 
      day = format(day, "dd-MM-yyyy"); 

      if(!days[day]){
        let conversion = new Conversion(day);
        days[day] = conversion;
      }

      if(!sessions[element.sessions]){
        sessions[element.session];
        days[day].addSession();
      }
  

      if(element.eventType === 'purchase'){
        days[day].addPurchase();
      }

      result[day] = {"sessions":days[day].getSessions(), "purchases": days[day].getPurchases(),"value":days[day].getSuccessRate()};

    });
    return result;
  }

  public async getRevenueListOfCustomer(from_date: string, end_date: string) {
  }
}
