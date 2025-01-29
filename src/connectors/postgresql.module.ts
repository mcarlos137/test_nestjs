import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../business/orders/order.entity';
import { Trade } from '../business/trades/trade.entity';
require('dotenv').config({path: '.env'})

const PostgresqlTypeOrmModule = TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DB,
    schema: process.env.POSTGRESQL_SCHEMA,
    entities: [Order, Trade],
    synchronize: false,
    logging: true,
    cache: true,
})

@Module({
    imports: [
        PostgresqlTypeOrmModule,
        TypeOrmModule.forFeature([Order, Trade])
    ],
    exports: [PostgresqlTypeOrmModule],
})

export class PostgresqlModule { }