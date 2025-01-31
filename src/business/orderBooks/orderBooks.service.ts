import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderBook } from "./orderBook.pojo";
import { OrderBooksWSSyncEvent } from "./orderBooks-ws-sync.event";
import { OrderBookTB } from "./orderBook-tb.pojo";
import Redis from "ioredis";


@Injectable()
export class OrderBooksService {

    private sender: Redis;

    constructor(
        @Inject('REDIS_CLIENT') private redisClient: ClientProxy,
        private eventEmitter: EventEmitter2
    ) {
        this.redisClient.connect()
        const [sender] = this.redisClient.unwrap<[import('ioredis').Redis]>();
        this.sender = sender
    }

    sendToEventEmitter(orderBook: OrderBook): string {
        this.eventEmitter.emit('orderBook.wssync', new OrderBooksWSSyncEvent(orderBook))
        return 'Order Book SENT to Event Emitter'
    }

    sendToRedis(orderBookTB: OrderBookTB): string {
        console.log('orderBookTB', orderBookTB)
        this.sender.hset(orderBookTB.time.toString(), orderBookTB)
        return 'Order Book TB SENT to Redis Hash'
    }

    sendToRedisPubSub(orderBook: OrderBook): string {
        this.sender.emit('order_book_transformation_basic', orderBook)
        return 'Order Book SENT to Redis PUB/SUB'
    }

    sendToRedisStream(orderBook: OrderBook): string {
        this.sender.xadd("order_book", "*", "payload", JSON.stringify(orderBook));
        return 'Order Book SENT to Redis Stream'
    }

}