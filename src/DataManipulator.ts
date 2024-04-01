import { ServerRespond } from "./DataStreamer";

export interface Row {
  // update row to match new schema in graph.tsx
  price_abc: number;
  price_def: number;
  ratio: number;
  timestamp: Date;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  // data that is returned is in the Row structure
  static generateRow(serverResponds: ServerRespond[]) {
    // get averages of prices
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;

    const ratio = priceABC / priceDEF;
    // 10% bounds
    const upper_bound = 1.05;
    const lower_bound = 0.95;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp:
        serverResponds[0].timestamp > serverResponds[1].timestamp
          ? serverResponds[0].timestamp
          : serverResponds[1].timestamp,
      upper_bound,
      lower_bound,
      trigger_alert: ratio > upper_bound || ratio < lower_bound ? ratio : undefined,
    };
  }
}
