
export class OrderBook {

  time: number;
  exchange: string;
  baseAsset: string
  quoteAsset: string
  asks: string[][]
  bids: string[][]

  constructor(time: number, exchange: string, baseAsset: string, quoteAsset: string, asks: string[][], bids: string[][]) {
    this.time = time
    this.exchange = exchange
    this.baseAsset = baseAsset
    this.quoteAsset = quoteAsset
    this.asks = asks
    this.bids = bids
  }

  getPair = (): string => {
    return this.baseAsset + "-" + this.quoteAsset;
  }

  getChannel = (): string => {
    return this.exchange + "." + this.getPair();
  }

}
