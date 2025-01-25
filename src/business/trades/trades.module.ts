import { Module } from '@nestjs/common';
import { PostgresqlModule } from 'src/connectors/postgresql.module';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { TradesResolver } from './trades.resolver';

@Module({
  imports: [PostgresqlModule],
  providers: [TradesService, TradesResolver],
  controllers: [TradesController],
  exports: [TradesService]
})
export class TradesModule { }
