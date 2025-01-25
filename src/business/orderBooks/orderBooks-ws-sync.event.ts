import { OrderBook } from "./orderBook.pojo";

export class OrderBooksWSSyncEvent {
    
    orderBook: OrderBook;

    constructor(orderBook: OrderBook){
        this.orderBook = orderBook
    }

}