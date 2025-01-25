import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext, RmqContext, Transport } from '@nestjs/microservices';
import { OrderBook } from './orderBook.pojo';
import { OrderBooksService } from './orderBooks.service';
import { OrderBookTB } from './orderBook-tb.pojo';
import { from } from 'rxjs';
import { join } from 'path';
import { mkdir, writeFile } from 'fs';
require('dotenv').config({ path: '.env' })

@Controller('orderBooks')
export class OrderBooksController {

    constructor(private readonly orderBooksService: OrderBooksService) { }

    @MessagePattern('order_book', Transport.RMQ)
    receiveOrderBook(@Payload() data: any, @Ctx() context: RmqContext) {
        const orderBook: OrderBook = new OrderBook(data.time, data.exchange, data.baseAsset, data.quoteAsset, data.asks, data.bids)
        from([
            this.orderBooksService.sendToEventEmitter(orderBook),
            this.orderBooksService.sendToRedisPubSub(orderBook),
            this.orderBooksService.sendToRedisStream(orderBook),
        ])
            .pipe()
            .subscribe(response => console.log(response))
    }

    @MessagePattern('order_book_transformation_basic', Transport.REDIS)
    receiveOrderBookTB(@Payload() orderBook: OrderBook, @Ctx() context: RedisContext) {
        const orderBookTB: OrderBookTB = new OrderBookTB(orderBook)
        console.log(orderBookTB)
        this.orderBooksService.sendToRedis(orderBookTB)
        const dataFolder = join(
            String(process.env.BASE_FOLDER),
            'data',
            'orderBookTransformationBasic',
            orderBookTB.exchange,
            orderBookTB.baseAsset + '-' + orderBookTB.quoteAsset
        )
        /*mkdir(dataFolder, { recursive: true }, (err) => {
            if (err) throw err;
        });*/
        const dataFile = join(dataFolder, orderBookTB.time.toString() + ".json")
        writeFile(dataFile, JSON.stringify(orderBookTB), (err) => {
            if (err) throw err;
        })
    }

}