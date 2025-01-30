//@Injectable({ scope: Scope.DEFAULT })
export class WsSessionsSingleton {

    private static instance: WsSessionsSingleton;

    private constructor() { }

    static getInstance(): WsSessionsSingleton {
        if (!WsSessionsSingleton.instance) {
            WsSessionsSingleton.instance = new WsSessionsSingleton();
        }
        return WsSessionsSingleton.instance;
    }

    private sessions: any = new Map()

    getSessions = <T>(operation: string, channel: string | undefined = undefined): T => {
        if (!channel) {
            if (!this.sessions.has(operation)) {
                this.sessions.set(operation, new Map());
            }
            return this.sessions.get(operation);
        } else {
            if (!this.sessions.has(operation)) {
                this.sessions.set(operation, new Map());
            }
            if (!this.sessions.get(operation)?.has(channel)) {
                this.sessions.get(operation)?.set(channel, new Set());
            }
            return this.sessions.get(operation)?.get(channel);
        }
    }

    addSession = (operation: string, channel: string, webSocketSession: any): void => {
        this.getSessions<Set<unknown>>(operation, channel).add(webSocketSession);
    }

    removeSessions = (operation: string, channel: string | undefined = undefined) => {
        if(channel){
            this.getSessions<Map<string, Set<unknown>>>(operation, channel).clear();
        } else {
            this.getSessions<Map<string, Set<unknown>>>(operation).clear();
        }
    }

}