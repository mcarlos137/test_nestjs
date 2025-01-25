/*import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Order } from '../../graphql/graphql.schema';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './create-order.dto';
import { Observable } from 'rxjs';

const pubSub = new PubSub();

@Resolver('Order')
export class OrdersResolver {
    constructor(private readonly ordersService: OrdersService) { }

    @Query('orders')
    @UseGuards(OrdersGuard)
    async getOrders() {
        return this.ordersService.findAll();
    }

    @Query('order')
    findOneById(
        @Args('id', ParseUUIDPipe)
        id: string,
    ): Observable<Order | null> {
        return this.ordersService.findOne(id);
    }

    @Mutation('createOrder')
    async create(@Args('createOrderInput') args: CreateOrderDto): Promise<Order> {
        const createdOrder = this.ordersService.create(args);
        pubSub.publish('orderCreated', { orderCreated: createdOrder });
        return createdOrder;
    }

    @Subscription('orderCreated')
    orderCreated() {
        return pubSub.asyncIterableIterator('orderCreated');
    }

}*/

import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from "@nestjs/graphql";
import { ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { OrdersGuard } from './orders.guard';
import { OrdersService } from "./orders.service";
import { from, Observable, tap } from "rxjs";
import { Order } from "./order.entity";
import { PubSub } from "graphql-subscriptions";
import { OrderSide, OrderType } from "./order.enum";
import { TradesService } from "../trades/trades.service";

const pubSub = new PubSub();

@Resolver(() => Order)
@UseGuards(OrdersGuard)
export class OrdersResolver {

    constructor(
        private readonly ordersService: OrdersService,
        private readonly tradesService: TradesService,
    ) { }

    @Query(() => [Order], { name: 'orders' })
    getOrders(): Observable<Order[]> {
        return this.ordersService.findAll();
    }

    @Query(() => Order, { name: 'orderById' })
    getOrderById(@Args('id', { type: () => String }, ParseUUIDPipe) id: string): Observable<Order | null> {
        return this.ordersService.findOne(id);
    }

    @Query(() => [Order], { name: 'ordersByBotId' })
    getOrdersByBotId(@Args('botId', { type: () => String }) botId: string): Observable<Order[]> {
        return this.ordersService.findAllByBotId(botId);
    }

    @ResolveField()
    async trades(@Parent() order: Order) {
      //const { exchangeId } = order;
      return this.tradesService.findAllByOrderId(order.exchangeId)
    }

    @Mutation(() => Order, { name: 'createOrder' })
    createOrder(
        @Args('exchange', { type: () => String }) exchange: string,
        @Args('baseAsset', { type: () => String }) baseAsset: string,
        @Args('quoteAsset', { type: () => String }) quoteAsset: string,
        @Args('botId', { type: () => String }) botId: string,
        @Args('strategy', { type: () => String }) strategy: string,
        @Args('type', { type: () => String }) type: string,
        @Args('side', { type: () => String }) side: string,
        @Args('amount', { type: () => Int }) amount: number,
        @Args('price', { type: () => Int }) price: number,
        @Args('exchangeId', { type: () => String }) exchangeId: string,
    ): Observable<Order> {
        return from(this.ordersService.create({
            exchange: exchange,
            baseAsset: baseAsset,
            quoteAsset: quoteAsset,
            botId: botId,
            strategy: strategy,
            type: OrderType[type],
            side: OrderSide[side],
            amount: amount,
            price: price,
            exchangeId: exchangeId
        })).pipe(
            tap(order => {
                pubSub.publish('orderCreated', { orderCreated: order });
            })
        )
    }

    @Mutation(() => Order, { name: 'cancelOrder' })
    cancelOrder(@Args('id', { type: () => String }) id: string): Observable<Order> {
        return from(this.ordersService.cancel(id))
            .pipe(
                tap(order => {
                    pubSub.publish('orderCanceled', { orderCanceled: order });
                })
            )
    }

    @Subscription(() => Order, { name: 'orderCreated' })
    orderCreated() {
        return pubSub.asyncIterableIterator('orderCreated');
    }

    @Subscription(() => Order, { name: 'orderCanceled' })
    orderCanceled() {
        return pubSub.asyncIterableIterator('orderCanceled');
    }

}
