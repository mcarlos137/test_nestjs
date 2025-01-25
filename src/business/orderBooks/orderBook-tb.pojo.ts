import { OrderBook } from "./orderBook.pojo";

export class OrderBookTB {

  time: number;
  exchange: string;
  baseAsset: string
  quoteAsset: string

  asksLowestPrice: number
  asksHighestPrice: number
  asksVolume: number = 0

  bidsLowestPrice: number
  bidsHighestPrice: number
  bidsVolume: number = 0

  spread: number = 0

  constructor(orderBook: OrderBook) {
    this.time = orderBook.time
    this.exchange = orderBook.exchange
    this.baseAsset = orderBook.baseAsset
    this.quoteAsset = orderBook.quoteAsset
    for (let ask of orderBook.asks) {
      const price = Number(ask[0])
      const amount = Number(ask[1])
      if (!this.asksLowestPrice) {
        this.asksLowestPrice = price;
      }
      if (!this.asksHighestPrice || price > this.asksHighestPrice) {
        this.asksHighestPrice = price;
      }
      this.asksVolume += amount;
    }
    for (let bid of orderBook.bids) {
      const price = Number(bid[0])
      const amount = Number(bid[1])
      if (!this.bidsLowestPrice || price < this.bidsLowestPrice) {
        this.bidsLowestPrice = price;
      }
      if (!this.bidsHighestPrice) {
        this.bidsHighestPrice = price;
      }
      this.bidsVolume += amount;
    }
    if (!this.asksLowestPrice || !this.bidsHighestPrice) {
      return;
    }
    this.spread = (this.asksLowestPrice - this.bidsHighestPrice) / this.asksLowestPrice * 10000;
  }

}