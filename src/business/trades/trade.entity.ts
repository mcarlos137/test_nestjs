import { Transform } from 'class-transformer';
import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { TradeSide } from './trade.enum';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity('trades')
@ObjectType()
export class Trade {

  @PrimaryColumn()
  @Field(type => Int)
  id?: number;

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

  @Column({ nullable: false })
  @Field(type => String)
  timestamp?: number;

  @Column({ name: 'order_id', nullable: false })
  @Field(type => String)
  orderId: string;

  @Transform(({ value }) => TradeSide[value])
  @Column({ type: 'enum', enum: TradeSide, default: TradeSide.BUY })
  @Field(type => String)
  side: TradeSide;

  @Column({ nullable: false })
  @Field(type => Int)
  amount: number;

  @Column({ nullable: false })
  @Field(type => Int)
  price: number;

  @Column({ nullable: false })
  @Field(type => String)
  fee: string;

  @Column({ name: 'exchange_id', nullable: false })
  @Field(type => String)
  exchangeId: string;

  @Column({ nullable: false })
  @Field(type => String)
  exchange: string;

  @BeforeInsert()
  async setId?() {
    //this.id = 4342;
  }

}
