import * as mod from "https://deno.land/std@0.164.0/collections/mod.ts";
import { Brand } from "./brand.ts";
import { Conversion } from "./conversion.ts";
import { Customer } from "./customer.ts";
import { parse as parseCsv } from "https://deno.land/std@0.164.0/encoding/csv.ts";
import { format, parse, weekOfYear } from "https://deno.land/std@0.164.0/datetime/mod.ts";
export interface DataSourceOptions {
  type: "file" | "googlesheet";
  source: string;
}

export class Spreadsheet {
  dataType: string;
  source: string;
  data?: any;
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
          "eventTime",
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
    const result: any = {};
    const brands: any = {};

    this.data = await this.readSpreadsheet();

    this.data.forEach((element) => {
      if (element.eventType === "purchase") {
        if (!brands[element.brand]) {
          let brand = new Brand(element.brand);
          brands[element.brand] = brand;
        }

        brands[element.brand].addPurchase(parseFloat(element.price));
        result[element.brand] = {
          "value": brands[element.brand].getAvgRevenue(),
        }; /** @todo Move this line out of this loop */
      }
    });
    return result;
  }

  public async getWeeklySessions() {
    const result = {};
    const weeks = {};
    const sessions = {};

    await this.readSpreadsheet();

    this.data.forEach((element) => {
      let day = parse(element.eventTime, "d/M/yyyy H:mm:ss");
      let week = weekOfYear(day);

      if (!weeks[week]) {
        let conversion = new Conversion(week);
        weeks[week] = conversion;
      }

      if (!sessions[element.sessions]) {
        sessions[element.session];
        weeks[week].addSession();
      }

   

      result[week] = {
        "sessions": weeks[week].getSessions()
      };
      
    });
    return result;

  }

  public async getDailyConversion() {
    const result = {};
    const days = {};
    const sessions = {};

    await this.readSpreadsheet();

    this.data.forEach((element) => {
      let day = parse(element.eventTime, "d/M/yyyy H:mm:ss");
      day = format(day, "dd-MM-yyyy");

      if (!days[day]) {
        let conversion = new Conversion(day);
        days[day] = conversion;
      }

      if (!sessions[element.sessions]) {
        sessions[element.session];
        days[day].addSession();
      }

      if (element.eventType === "purchase") {
        days[day].addPurchase();
      }

      result[day] = {
        "sessions": days[day].getSessions(),
        "purchases": days[day].getPurchases(),
        "value": days[day].getSuccessRate(),
      };
    });
    return result;
  }

  public async getRevenueListOfCustomer(from: string, end: string) {
    const fromDate = new Date(from);
    const endDate = new Date(end);
    const result = {};
    const customers = {};
  

    await this.readSpreadsheet();

    this.data.forEach((element) => {
      let day = parse(element.eventTime, "d/M/yyyy H:mm:ss");
      const dateDay = new Date(format(day, "yyyy-MM-dd"));
     
   
      if( dateDay >= fromDate &&  dateDay <= endDate && (element.eventType === 'purchase' || element.eventType === 'refund')){
        if(!customers[element.user]){

      
        let customer = new Customer(element.user);
        customers[element.user] = customer;
        }

        if(element.eventType === 'purchase'){
          customers[element.user].addRevenue(parseFloat(element.price));
        }
        
    
        if(element.eventType === 'refund'){
          customers[element.user].addRefund(parseFloat(element.price));
        }
      
        result[element.user] = {
          "value": customers[element.user].getNetRevenue()
        };

        
      }
      
  
 
    });
    return result;
  }
}
