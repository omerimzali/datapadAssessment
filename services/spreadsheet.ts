
import * as mod from "https://deno.land/std@0.164.0/collections/mod.ts";

export interface DataSourceOptions {
  type: "file" | "googlesheet";
  source: string;
}




export class Spreadsheet {
  dataType: string;
  source: string;
  constructor(
    options: DataSourceOptions = {
      type: "googlesheet",
      source: "goooglesheetURL",
    },
  ) {
    this.dataType = options.type;
    this.source = options.source;
  }

  public async getAvgRevenueBrand(){

    
  }

  public async getWeeklySessions(){
  
  }

  public async getDailyConversion(){
   
  }

  public async getRevenueListOfCustomer(from_date: string, end_date: string){

  }

}
