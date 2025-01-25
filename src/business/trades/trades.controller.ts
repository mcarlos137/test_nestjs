import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Trade } from './trade.entity';
import { TradesService } from './trades.service';
import { CreateTradeDto, createTradeSchema } from './create-trade.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { ZodValidationPipe } from 'src/tools/pipes/zod-validation.pipe';
import { from, Observable } from 'rxjs';

@Controller('trades')
@CacheTTL(10)
export class TradesController {

  constructor(private readonly tradesService: TradesService) { }

  @Get('findAll')
  @CacheKey('trades_findAll')
  findAll(): Observable<Trade[]> {
    return this.tradesService.findAll();
  }

  @Get('findAllByBotId')
  findAllByBotId(@Query('botId') botId): Observable<Trade[]> {
    return this.tradesService.findAllByBotId(botId);
  }

  @Get('findAllByBaseAssetAndQuoteAsset')
  findAllByBaseAssetAndQuoteAsset(@Query('baseAsset') baseAsset, @Query('quoteAsset') quoteAsset): Observable<Trade[]> {
    return this.tradesService.findAllByBaseAssetAndQuoteAsset(baseAsset, quoteAsset);
  }

  @Post('create')
  @Roles(Role.User)
  @UsePipes(new ZodValidationPipe(createTradeSchema))
  create(@Body() createTradeDto: CreateTradeDto): Observable<Trade> {
    return from(this.tradesService.create({ ...createTradeDto }))
  }

}
