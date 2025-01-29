import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { WsSessionsSingleton } from 'src/ws/ws-sessions.singleton';
import { Server } from 'ws';

@WebSocketGateway({
    path: 'data'
})
export class WSGateway implements OnGatewayDisconnect {

    constructor() { }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('SUBSCRIBE')
    onEventSubscribe(client: any, data: { method: string; operation: string, channel: string }): Observable<string> {
        WsSessionsSingleton.getInstance().addSession(data.operation, data.channel, client)
        return of('SUBSCRIBED TO ORDERBOOK CHANNEL ' + data.channel).pipe();
    }

    @SubscribeMessage('UNSUBSCRIBE')
    onEventUnsubscribe(client: any, data: { method: string; operation: string, channel: string }): Observable<string> {
        WsSessionsSingleton.getInstance().addSession(data.operation, data.channel, client)
        WsSessionsSingleton.getInstance().removeSessions(data.operation, data.channel)
        return of('UNSUBSCRIBED TO ORDERBOOK CHANNEL ' + data.channel).pipe();
    }

    handleDisconnect(client: any) {
        client.send('UNSUBSCRIBED TO ORDERBOOK CHANNELS')
        WsSessionsSingleton.getInstance().removeSessions('orderBook')
    }

}