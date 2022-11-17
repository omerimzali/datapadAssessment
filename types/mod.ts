export type Metrics = {
  metric: "revenue" | "net-revenue" | "sessions" | "conversion";
  dimensions: string[];
  aggregation: "sum" | "distinct" | "avg";
  filters?: { "date": { "from": string; "to": string }};
  data: {[key: string]: { value: string; sessions?: string; purchases?: string }[]; };
};

export type Row = {
  eventTime: string
  eventType: string
  product: string
  category: string
  categoryCode: string
  brand: string
  price: string
  user: string
  session: string
}

export type RowList = [
  Row
]