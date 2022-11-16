import * as mod from "https://deno.land/std@0.164.0/collections/mod.ts";
import { parse as parseCsv } from "https://deno.land/std@0.164.0/encoding/csv.ts";
import {
  format,
  parse,
  weekOfYear,
} from "https://deno.land/std@0.164.0/datetime/mod.ts";
import {
  API_KEY,
  GOOGLE_SHEET_API_URL,
  SHEET_NAME,
  SPREADSHEET_ID,
} from "../config.ts";
import { Brand } from "./brand.ts";
import { Conversion } from "./conversion.ts";
import { Customer } from "./customer.ts";
/**
 * DataSourceOption Interface
 * It's using to define datasource for Spreadsheet class.
 * @param {string}  type
 * @param {string} source
 */
export interface DataSourceOptions {
  type: "file" | "googlesheet";
  source: string;
}

/**
 * Spreadsheet Class
 * To get read and calculate metrics with csv files or googlespreadsheets.
 */
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
    this.dataType = options.type;
    this.source = options.source;
  }

  /**
   * SpreadSheet.readSpreadsheet
   * A Private function to decide which reading function to use.
   */
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

  /**
   * SpreadSheet.readSpreadsheet
   * A Private function to read Google spread sheet data
   */
  private async readGoogleSheet() {
    this.data = await fetch(
      `${GOOGLE_SHEET_API_URL}/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`,
    )
      .then((res) => res.json())
      .then((res) => res.values);

    this.data = this.data.map((value) => ({
      ["eventTime"]: value[0],
      ["eventType"]: value[1],
      ["product"]: value[2],
      ["category"]: value[3],
      ["categoryCode"]: value[4],
      ["brand"]: value[5],
      ["price"]: value[6],
      ["user"]: value[7],
      ["session"]: value[8],
    }));
    this.data.shift();
    return this.data;
  }

    /**
   * SpreadSheet.readFile
   * A Private function to read csv files
   */
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

    /**
   * SpreadSheet.readFile
   * A function to get read data.
   * @return {object} this.data
   */
  public async getData() {
    return this.data;
  }
  /**
   * Spreadsheet.getAvgRevenueBrand() 
   * A function to get Average Revenue of Brand
   * @return {object} 
   */

  public async getAvgRevenueBrand() {
    let result: any = {};
    const brands: any = {};

    this.data = await this.readSpreadsheet();

    this.data.forEach((element) => {
      if (element.eventType === "purchase") {
        if (!brands[element.brand]) {
          let brand = new Brand(element.brand);
          brands[element.brand] = brand;
        }

        brands[element.brand].addPurchase(parseFloat(element.price));
      }
    });

    Object.entries(brands).forEach(([brand]) => {
      result[brand] = { "value": brands[brand].getAvgRevenue() };
    });
    return result;
  }
  /**
   * SpreadSheet.getWeeklySessions
   * A function to get Weekly Session numbers.
   * @return {object} 
   */
  public async getWeeklySessions() {
    let result = {};
    const weeks: any = {};
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
    });

    Object.entries(weeks).forEach(([week]) => {
      result[week] = { "value": weeks[week].getSessions() };
    });

    return result;
  }
  /**
   * SpreadSheet.getDailyConversion
   * A function to get daily sessions, purchased sessions and session/purchased session ratio
   * @return {object} 
   */
  public async getDailyConversion() {
    let result = {};
    const days: any = {};
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
    });

    Object.entries(days).forEach(([day]) => {
      result[day] = {
        "sessions": days[day].getSessions(),
        "purchases": days[day].getPurchases(),
        "value": days[day].getSuccessRate(),
      };
    });
    return result;
  }

   /**
   * SpreadSheet.getDailyConversion
   * A function to get total revenue of customers.
   * @return {object} 
   */
  public async getRevenueListOfCustomer(from: string, end: string) {
    const fromDate = new Date(from);
    const endDate = new Date(end);
    let result = {};
    const customers = {};

    await this.readSpreadsheet();

    this.data.forEach((element) => {
      const dateDay = new Date(element.eventTime);
      if (
        dateDay >= fromDate && dateDay <= endDate &&
        (element.eventType === "purchase" || element.eventType === "refund")
      ) {
        if (!customers[element.user]) {
          let customer = new Customer(element.user);
          customers[element.user] = customer;
        }

        if (element.eventType === "purchase") {
          customers[element.user].addRevenue(parseFloat(element.price));
        }

        if (element.eventType === "refund") {
          customers[element.user].addRefund(parseFloat(element.price));
        }
      }
    });

    Object.entries(customers).forEach(([customer]) => {
      result[customer] = { "value": customers[customer].getNetRevenue() };
    });
    return result;
  }
}
