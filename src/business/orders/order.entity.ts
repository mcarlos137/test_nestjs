import { v4 as uuidv4 } from 'uuid';
import { Transform } from 'class-transformer';
import { Field, Int, ObjectType, } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { OrderSide, OrderStatus, OrderType } from './order.enum';
import { Trade } from '../trades/trade.entity';

@Entity('orders')
@ObjectType()
export class Order {

  @PrimaryColumn()
  @Field(type => String)
  id?: string;

  @Column({ name: 'bot_id', nullable: false })
  @Field(type => String)
  botId: string;

  @Column({ nullable: false })
  @Field(type => String)
  strategy: string;

  @Column({ name: 'base_asset', nullable: false })
  @Field(type => String)
  baseAsset: string;

  @Column({ name: 'quote_asset', nullable: false })
  @Field(type => String)
  quoteAsset: string;

  @Column({ name: 'creation_timestamp', nullable: false })
  @Field(type => String, { nullable: true })
  creationTimestamp?: number;

  @Transform(({ value }) => OrderType[value])
  @Column({ type: 'enum', enum: OrderType, default: OrderType.LIMIT })
  @Field(type => String)
  type: OrderType;

  @Column({ nullable: false })
  @Field(type => Int)
  amount: number;

  @Column({ nullable: false })
  @Field(type => Int)
  price: number;

  @Transform(({ value }) => OrderStatus[value])
  @Column({ name: 'last_status', type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
  @Field(type => String)
  lastStatus?: OrderStatus;

  @Column({ name: 'last_update_timestamp', nullable: false })
  @Field(type => String, { nullable: true })
  lastUpdateTimestamp?: number;

  @Column({ name: 'exchange_id', nullable: false })
  @Field(type => String)
  exchangeId: string;

  @Transform(({ value }) => OrderSide[value])
  @Column({ type: 'enum', enum: OrderSide, default: OrderSide.ASK })
  @Field(type => String)
  side: OrderSide;

  @Column({ nullable: false })
  @Field(type => String)
  exchange: string;
  
  @Field(type => [Trade], { nullable: 'items' })
  trades?: [Trade];

  @BeforeInsert()
  setId?() {
    this.id = uuidv4();
  }

}
