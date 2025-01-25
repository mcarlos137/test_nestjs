export enum OrderStatus {
  CREATED = 0, CANCELED = 1, PARTIALLY_FILLED = 2, FILLED = 3, PENDING_TO_CREATE = 4, PENDING_TO_CANCEL = 5, FAILED = 6
}

export enum OrderSide {
  ASK = 0, BID = 1
}

export enum OrderType {
  LIMIT = 0, MARKET = 1
}