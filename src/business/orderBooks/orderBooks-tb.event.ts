import { OrderBook } from "./orderBook.pojo";

export class OrderBooksTBEvent {
    
    orderBook: OrderBook;

    constructor(orderBook: OrderBook){
        this.orderBook = orderBook
    }

}