import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade } from './trade.entity';
import { from, Observable } from 'rxjs';

@Injectable()
export class TradesService {

  constructor(@InjectRepository(Trade) private tradesRepository: Repository<Trade>) { }

  findAll(): Observable<Trade[]> {
    return from(this.tradesRepository.find());
  }

  findAllByBotId(botId: string): Observable<Trade[]> {
    return from(this.tradesRepository.find({ where: [{ botId: botId }] }));
  }

  findAllByOrderId(orderId: string): Observable<Trade[]> {
    return from(this.tradesRepository.find({ where: [{ orderId: orderId }] }));
  }

  findAllByBaseAssetAndQuoteAsset(baseAsset: string, quoteAsset: string): Observable<Trade[]> {
    return from(this.tradesRepository.find({ where: [{ baseAsset: baseAsset, quoteAsset: quoteAsset }] }));
  }

  findById(id: number): Observable<Trade | null> {
    return from(this.tradesRepository.findOneBy({ id }));
  }

  async create(trade: Trade): Promise<Trade> {
    const result = await this.tradesRepository
      .query("SELECT NEXTVAL('trades_seq') AS id")
    const newTrade = this.tradesRepository.create({
      ...trade,
      id: result[0].id,
      timestamp: new Date().getTime(),
    });
    await this.tradesRepository.insert(newTrade)
    console.log('----------- new trade', newTrade)
    return newTrade;
  }

}
