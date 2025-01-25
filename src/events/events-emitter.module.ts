import { Module } from "@nestjs/common";
import { EventEmitterModule as EEM } from '@nestjs/event-emitter';

@Module({
    imports: [EEM.forRoot({
        maxListeners: 10,
    })],
})
export class EventsEmitterModule { }