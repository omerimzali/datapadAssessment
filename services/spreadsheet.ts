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

import { Row, RowList, ReturnData, BrandList, WeekList, CustomerList, DayList, SessionList   } from "../types/mod.ts";

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
 * EnumValues for Spreadsheet Data-DatasourceTypes
 */
enum DataTypes {
  File = "file",
  GoogleSheet = "googlesheet",
}
/**
 * Enum Values for EventTypes
 */

enum EvenTypes {
  Purchase = "purchase",
  Refund = "refund",
}

/**
 * Spreadsheet Class
 * To get read and calculate metrics with csv files or googlespreadsheets.
 */
export class Spreadsheet {
  dataType: string;
  source: string;
  data:RowList;
  constructor(
    options: DataSourceOptions = {
      type: DataTypes.GoogleSheet,
      source: "goooglesheetURL",
    },
  ) {
    this.dataType = options.type;
    this.source = options.source;
    this.data = [];
  }

  /**
   * SpreadSheet.readSpreadsheet
   * A Private function to decide which reading function to use.
   */
  private async readSpreadsheet() {
    switch (this.dataType) {
      case DataTypes.GoogleSheet:
        return await this.readGoogleSheet(); 
      case DataTypes.File:
        return await this.readFile();
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

    this.data = this.data.slice(1, this.data.length).map((value:any) =>
      <Row> {
        eventTime: value[0],
        eventType: value[1],
        product: value[2],
        category: value[3],
        categoryCode: value[4],
        brand: value[5],
        price: value[6],
        user: value[7],
        session: value[8]
      }
    );
    return this.data;
  }

  /**
   * SpreadSheet.readFile
   * A Private function to read csv files
   */
  private async readFile() {
    const content:any = await parseCsv(
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
    return this.data
  }

  /**
   * SpreadSheet.readFile
   * A function to get read data.
   * @return {object} this.data
   */
  public  getData() {
    return this.data;
  }
  /**
   * Spreadsheet.getAvgRevenueBrand()
   * A function to get Average Revenue of Brand
   * @return {object}
   */

  public async getAvgRevenueBrand() {
    const result: ReturnData = {};
    const brands:BrandList = {};

    await this.readSpreadsheet();

    this.data.forEach((element: Row) => {
      if (element.eventType === EvenTypes.Purchase) {
        if (!brands[element.brand]) {
          const brand = new Brand(element.brand);
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
    const result:ReturnData = {};
    const weeks:WeekList = {};
    const sessions:SessionList = {};

    await this.readSpreadsheet();

    this.data.forEach((element: Row) => {
      const day = parse(element.eventTime, "d/M/yyyy H:mm:ss");
      const week= String(weekOfYear(day));

      if (!weeks[week]) {
        weeks[week] = new Conversion(week);
      }

      if (!sessions[element.session]) {
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
    const result:ReturnData = {};
    const days:DayList = {};
    const sessions:SessionList = {};

    await this.readSpreadsheet();

    this.data.forEach((element: Row) => {
      
      const day:string = format(parse(element.eventTime, "M/d/yyyy H:mm:ss"), "yyyy-MM-dd");

      if (!days[day]) {
        days[day] = new Conversion(day);
      }

      if (!sessions[element.session]) {
        sessions[element.session] = element.session;
        days[day].addSession();
      }

      if (element.eventType === EvenTypes.Purchase) {
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
    const result:ReturnData = {};
    const customers:CustomerList = {};

    await this.readSpreadsheet();

    this.data.forEach((element: Row) => {
      const dateDay = new Date(element.eventTime);
      if (
        dateDay >= fromDate && dateDay <= endDate &&
        (element.eventType === EvenTypes.Purchase || element.eventType === EvenTypes.Refund)
      ) {
        if (!customers[element.user]) {
          customers[element.user] = new Customer(element.user);
  
        }

        if (element.eventType === EvenTypes.Purchase) {
          customers[element.user].addRevenue(parseFloat(element.price));
        }

        if (element.eventType === EvenTypes.Refund) {
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
