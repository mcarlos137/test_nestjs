import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderStatus } from './order.enum';
import { from, Observable } from 'rxjs';

@Injectable()
export class OrdersService {

  constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>) { }

  findAll(): Observable<Order[]> {
    this.ordersRepository.find().then(result => console.log(result))
    return from(this.ordersRepository.find());
  }

  findAllByBotId(botId: string): Observable<Order[]> {
    return from(this.ordersRepository.find({ where: [{ botId: botId }] }));
  }

  findAllByBaseAssetAndQuoteAsset(baseAsset: string, quoteAsset: string): Observable<Order[]> {
    return from(this.ordersRepository.find({ where: [{ baseAsset: baseAsset, quoteAsset: quoteAsset }] }));
  }

  findOne(id: string): Observable<Order | null> {
    return from(this.ordersRepository.findOneBy({ id }));
  }

  async create(order: Order): Promise<Order> {
    const currentTime: number = new Date().getTime()
    const newOrder = this.ordersRepository.create({
      ...order,
      creationTimestamp: currentTime,
      lastStatus: OrderStatus.CREATED,
      lastUpdateTimestamp: currentTime
    });
    await this.ordersRepository.insert(newOrder)
    return newOrder
  }

  async cancel(id: string): Promise<Order> {
    var order: Order | null = await this.ordersRepository.findOneBy({ id })
    if (order === null) throw new Error("Order not found")
    order.lastStatus = OrderStatus.CANCELED
    order.lastUpdateTimestamp = new Date().getTime()
    await this.ordersRepository.save(order)
    return order
  }

}