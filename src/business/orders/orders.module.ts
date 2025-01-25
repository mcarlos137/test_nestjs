import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PostgresqlModule } from 'src/connectors/postgresql.module';
import { OrdersResolver } from './orders.resolver';
import { TradesModule } from '../trades/trades.module';

@Module({
  imports: [PostgresqlModule, TradesModule],
  providers: [
    OrdersService,
    OrdersResolver
  ],
  controllers: [OrdersController]
})
export class OrdersModule { }
