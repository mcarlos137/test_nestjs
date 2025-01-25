import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheableMemory } from 'cacheable';
require('dotenv').config({ path: '.env' })

const RedisCacheClientModule = CacheModule.registerAsync({
    useFactory: async () => {
        return {
            stores: [
                new Keyv({
                    store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
                }),
                new KeyvRedis({
                    url: process.env.REDIS_URL, // The Redis server URL (use 'rediss' for TLS)
                    password: process.env.REDIS_PASSWORD, // Optional password if Redis has authentication enabled
                    socket: {
                        reconnectStrategy: (retries) => Math.min(retries * 50, 2000), // Custom reconnect logic
                        tls: false, // Enable TLS if you need to connect over SSL
                        keepAlive: 30000, // Keep-alive timeout (in milliseconds)
                    }
                }),
            ],
        };
    },
    isGlobal: true,
})

@Module({
    imports: [RedisCacheClientModule],
    exports: [RedisCacheClientModule],
})

export class RedisCacheModule { }