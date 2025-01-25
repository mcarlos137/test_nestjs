import { MicroserviceOptions, Transport } from "@nestjs/microservices";
require('dotenv').config({ path: '.env' })

export const redisMicroserviceConfig = <MicroserviceOptions>{
    transport: Transport.REDIS,
    options: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    },
}