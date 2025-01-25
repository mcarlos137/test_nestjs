import { z } from 'zod';
import { TradeSide } from './trade.enum';

export const createTradeSchema = z.object({
    botId: z.string({
        required_error: 'botId is required'
    }).min(1, 'a valid botId is required'),
    strategy: z.string().min(1, 'strategy is required'),
    baseAsset: z.string({
        required_error: 'baseAsset is required'
    }).min(2, 'a valid valid baseAsset is required'),
    quoteAsset: z.string({
        required_error: 'quoteAsset is required'
    }).min(2, 'a valid valid quoteAsset is required'),
    orderId: z.string({
        required_error: 'orderId is required'
    }).min(1, 'a valid orderId is required'),
    side: z.enum(['BUY', 'SELL'], {
        required_error: 'side is required'
    }).transform(value => {
        return TradeSide[value as keyof typeof TradeSide];
    }),
    amount: z.number({
        required_error: 'amount is required'
    }).positive('amount must be positive'),
    price: z.number({
        required_error: 'price is required'
    }).positive('price must be positive'),
    fee: z.string({
        required_error: 'fee is required'
    }).min(1, 'a valid fee is required'),
    exchangeId: z.string({
        required_error: 'exchangeId is required'
    }).min(1, 'a valid exchangeId is required'),
    exchange: z.string({
        required_error: 'exchange is required'
    }).min(4, 'a valid exchange is required'),
}).required();

export type CreateTradeDto = z.infer<typeof createTradeSchema>;