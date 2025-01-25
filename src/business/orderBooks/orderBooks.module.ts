import { Module } from '@nestjs/common';
import { OrderBooksService } from './orderBooks.service';
import { OrderBooksController } from './orderBooks.controller';
import { RedisClientModule } from 'src/connectors/redis-client.module';
import { EventsEmitterModule } from 'src/events/events-emitter.module';
import { OrderBooksListener } from './orderBooks.listener';

@Module({
  imports: [
    RedisClientModule,
    EventsEmitterModule
  ],
  providers: [OrderBooksService, OrderBooksListener],
  controllers: [OrderBooksController],
})
export class OrderBooksModule { }