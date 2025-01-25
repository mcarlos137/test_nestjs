import { OrderBook } from './orderBook.pojo';

//@Injectable({ scope: Scope.DEFAULT })
export class OrderBooksSingleton {

    private static instance: OrderBooksSingleton;

    private constructor() { }

    static getInstance(): OrderBooksSingleton {
        if (!OrderBooksSingleton.instance) {
            OrderBooksSingleton.instance = new OrderBooksSingleton();
        }
        return OrderBooksSingleton.instance;
    }

    private orderBooks: Map<string, Map<string, OrderBook | undefined> | undefined> = new Map()

    getOrderBook = (type: string, exchangePair: string) => {
        if (!this.orderBooks.has(type)) {
            this.orderBooks.set(type, undefined);
        }
        if (!this.orderBooks.get(type)?.has(exchangePair)) {
            this.orderBooks.get(type)?.set(exchangePair, undefined);
        }
        return this.orderBooks.get(type)?.get(exchangePair);
    }

    syncOrderBook = (type: string, orderBook: OrderBook): OrderBook | undefined => {
        const exchangePairOrderBook: Map<string, OrderBook> = new Map()
        exchangePairOrderBook.set(orderBook.getChannel(), orderBook)
        this.orderBooks.set(type, exchangePairOrderBook);
        return this.mergeOrderBooks(orderBook.getChannel())
    }

    private mergeOrderBooks = (exchangePair: string): OrderBook | undefined => {
        return this.orderBooks.get("public")?.get(exchangePair);
    }

}