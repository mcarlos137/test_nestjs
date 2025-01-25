import { Args, Int, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { ParseIntPipe, UseGuards } from "@nestjs/common";
import { TradesGuard } from './trades.guard';
import { from, Observable, tap } from "rxjs";
import { PubSub } from "graphql-subscriptions";
import { TradesService } from "./trades.service";
import { Trade } from "./trade.entity";
import { TradeSide } from "./trade.enum";

const pubSub = new PubSub();

@Resolver(() => Trade)
@UseGuards(TradesGuard)
export class TradesResolver {

    constructor(
        private readonly tradesService: TradesService,
    ) { }

    @Query(() => [Trade], { name: 'trades' })
    getTrades(): Observable<Trade[]> {
        return this.tradesService.findAll();
    }

    @Query(() => Trade, { name: 'tradeById' })
    getTradeById(@Args('id', { type: () => Int }, ParseIntPipe) id: number): Observable<Trade | null> {
        return this.tradesService.findById(id)
    }

    @Query(() => [Trade], { name: 'tradesByOrderId' })
    getTradesByOrderId(@Args('orderId', { type: () => String }) orderId: string): Observable<Trade[]> {
        return this.tradesService.findAllByOrderId(orderId);
    }

    @Mutation(() => Trade, { name: 'createTrade' })
    createTrade(
        @Args('exchange', { type: () => String }) exchange: string,
        @Args('baseAsset', { type: () => String }) baseAsset: string,
        @Args('quoteAsset', { type: () => String }) quoteAsset: string,
        @Args('botId', { type: () => String }) botId: string,
        @Args('strategy', { type: () => String }) strategy: string,
        @Args('side', { type: () => String }) side: string,
        @Args('amount', { type: () => Int }) amount: number,
        @Args('price', { type: () => Int }) price: number,
        @Args('fee', { type: () => String }) fee: string,
        @Args('orderId', { type: () => String }) orderId: string,
        @Args('exchangeId', { type: () => String }) exchangeId: string,
    ): Observable<Trade> {
        return from(this.tradesService.create({
            exchange: exchange,
            baseAsset: baseAsset,
            quoteAsset: quoteAsset,
            botId: botId,
            strategy: strategy,
            side: TradeSide[side],
            amount: amount,
            price: price,
            fee: fee,
            orderId: orderId,
            exchangeId: exchangeId
        })).pipe(
            tap(trade => {
                pubSub.publish('tradeCreated', { tradeCreated: trade });
            })
        )
    }

    @Subscription(() => Trade, { name: 'tradeCreated' })
    tradeCreated() {
        return pubSub.asyncIterableIterator('tradeCreated');
    }

}
