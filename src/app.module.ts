import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './business/orders/orders.module';
import { TradesModule } from './business/trades/trades.module';
import { RedisCacheModule } from './connectors/redis-cache.module';
import { GraphqlModule } from './graphql/graphql.module';
import { OrderBooksModule } from './business/orderBooks/orderBooks.module';
import { WSModule } from './ws/ws.module';

const infrastructureModules = [
  RedisCacheModule,
  WSModule,
  //AuthModule,
  GraphqlModule,
]

const businessModules = [
  OrdersModule,
  TradesModule,
  OrderBooksModule,
]

@Module({
  imports: [
    ...infrastructureModules,
    ...businessModules
  ],
  providers: [],
})
export class AppModule { }
