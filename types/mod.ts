export type Metrics = {
  metric: "revenue" | "net-revenue" | "sessions" | "conversion";
  dimensions: string[];
  aggregation: "sum" | "distinct" | "avg";
  filters?: { "date": { "from": string; "to": string };
  data: {
    [key: string]: { value: string; sessions?: string; purchases?: string }[]; };
  };
};


