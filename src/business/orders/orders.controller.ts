import { Body, Controller, Get, ParseUUIDPipe, Post, Query, UseInterceptors, UsePipes } from '@nestjs/common';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { CreateOrderDto, createOrderSchema } from './create-order.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { ZodValidationPipe } from 'src/tools/pipes/zod-validation.pipe';
import { from, Observable } from 'rxjs';
import { HttpCacheInterceptor } from 'src/tools/interceptors/http-cache.interceptor';

@Controller('orders')
@UseInterceptors(HttpCacheInterceptor)
@CacheTTL(100)
export class OrdersController {

  constructor(private readonly ordersService: OrdersService) { }

  @Get('findById')
  @CacheKey('orders_findAllByBotId')
  findById(@Query('id', ParseUUIDPipe) id: string): Observable<Order | null> {
    return from(this.ordersService.findOne(id)).pipe();
  }

  @Get('findAllByBotId')
  @CacheKey('orders_findAllByBotId')
  findAllByBotId(@Query('botId') botId): Observable<Order[]> {
    return this.ordersService.findAllByBotId(botId);
  }

  @Get('findAllByBaseAssetAndQuoteAsset')
  findAllByBaseAssetAndQuoteAsset(@Query('baseAsset') baseAsset, @Query('quoteAsset') quoteAsset): Observable<Order[]> {
    return this.ordersService.findAllByBaseAssetAndQuoteAsset(baseAsset, quoteAsset);
  }

  @Get('findAll')
  @CacheKey('orders_findAll')
  findAll(): Observable<Order[]> {
    return this.ordersService.findAll();
  }

  @Post('create')
  @Roles(Role.Admin)
  @UsePipes(new ZodValidationPipe(createOrderSchema))
  create(@Body() createOrderDto: CreateOrderDto): Observable<Order | unknown> {
    return from(this.ordersService.create({ ...createOrderDto }))
  }

  @Post('cancel')
  @Roles(Role.Admin)
  cancel(@Body('id', ParseUUIDPipe) id: string): Observable<Order> {
    return from(this.ordersService.cancel(id))
  }

}
