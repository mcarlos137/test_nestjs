import { z } from 'zod';
import { OrderSide, OrderType } from './order.enum';

export const createOrderSchema = z.object({
    botId: z.string({
        required_error: 'botId is required'
    }).min(1, 'botId is required'),
    strategy: z.string().min(1, 'strategy is required'),
    baseAsset: z.string({
        required_error: 'baseAsset is required'
    }).min(2, 'valid baseAsset is required'),
    quoteAsset: z.string({
        required_error: 'quoteAsset is required'
    }).min(2, 'valid quoteAsset is required'),
    side: z.enum(['ASK', 'BID'], {
        required_error: 'side is required'
    }).transform(value => {
        return OrderSide[value as keyof typeof OrderSide];
    }),
    type: z.enum(['LIMIT', 'MARKET'], {
        required_error: 'type is required'
    }).transform(value => {
        return OrderType[value as keyof typeof OrderType];
    }),
    amount: z.number({
        required_error: 'amount is required'
    }).positive('amount must be positive'),
    price: z.number({
        required_error: 'price is required'
    }).positive('price must be positive'),
    exchangeId: z.string({
        required_error: 'exchangeId is required'
    }).min(1, 'exchangeId is required'),
    exchange: z.string({
        required_error: 'exchange is required'
    }).min(4, 'valid exchange is required'),
}).required();

export type CreateOrderDto = z.infer<typeof createOrderSchema>;