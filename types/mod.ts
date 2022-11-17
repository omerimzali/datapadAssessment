
import { Brand } from "../services/brand.ts";
import { Conversion } from "../services/conversion.ts";
import { Customer } from "../services/customer.ts";
export type Metrics = {
  metric: "revenue" | "net-revenue" | "sessions" | "conversion";
  dimensions: string[];
  aggregation: "sum" | "distinct" | "avg";
  filters?: { "date": { "from": string; "to": string } };
  data: {
    [key: string]: { value: string; sessions?: string; purchases?: string }[];
  };
};

export type Row = {
  eventTime: string;
  eventType: string;
  product: string;
  category: string;
  categoryCode: string;
  brand: string;
  price: string;
  user: string;
  session: string;
};

export type RowList = Row[];

export type ReturnData = {
  [key: string]: { value: string; sessions?: string; purchases?: string };
};
export type DayList = {
  [key: string]: Conversion;
};

export type WeekList = {
  [key: string]: Conversion;
};

export type BrandList = {
  [key: string]: Brand;
};

export type CustomerList = {
  [key: string]: Customer;
};

export type SessionList = {
  [key:string]: string
} ;
