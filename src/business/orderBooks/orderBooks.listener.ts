import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderBooksSingleton } from 'src/business/orderBooks/orderBooks.singleton';
import { OrderBook } from 'src/business/orderBooks/orderBook.pojo';
import { WsSessionsSingleton } from 'src/ws/ws-sessions.singleton';
import { OrderBooksWSSyncEvent } from './orderBooks-ws-sync.event';

@Injectable()
export class OrderBooksListener {

  @OnEvent('orderBook.wssync')
  handleOrderBookWSSyncEvent(event: OrderBooksWSSyncEvent) {
    const orderBook: OrderBook | undefined = OrderBooksSingleton.getInstance().syncOrderBook('public', event.orderBook)
    if (orderBook) {
      WsSessionsSingleton.getInstance().getSessions<Set<any>>('orderBook', orderBook.getChannel())
        .forEach(client => client.send(JSON.stringify(orderBook)))
    }
  }

}