import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
require('dotenv').config({ path: '.env' })

const RedisCModule = ClientsModule.register([
    {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD
        }
    },
])

@Module({
    imports: [RedisCModule],
    exports: [RedisCModule],
})

export class RedisClientModule { }