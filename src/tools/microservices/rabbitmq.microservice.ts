import { MicroserviceOptions, Transport } from "@nestjs/microservices";
require('dotenv').config({ path: '.env' })

export const rabbitmqMicroserviceConfig1 = <MicroserviceOptions>{
    transport: Transport.RMQ,
    options: {
        urls: [String(process.env.RABBITMQ_URL)],
        queue: 'order_book.binance.ETH-USDT',
        routingKey: 'order_book.binance.ETH-USDT',
        consumerTag: 'order_book.binance.ETH-USDT',
        queueOptions: {
            durable: false,
            maxLength: 1
        },
    },
}
