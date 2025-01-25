import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { redisMicroserviceConfig } from './tools/microservices/redis.microservice';
import { HttpExceptionFilter } from './tools/filters/http-exception.filter';
import { QueryFailedExceptionFilter } from './tools/filters/query-exception.filter';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { LoggingInterceptor } from './tools/interceptors/logging.interceptor';
import { WsAdapter } from './ws/ws-adapter';
import { MicroserviceOptions } from '@nestjs/microservices';
import { rabbitmqMicroserviceConfig1 } from './tools/microservices/rabbitmq.microservice';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/roles/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { HttpCacheInterceptor } from './tools/interceptors/http-cache.interceptor';
//import { IoAdapter } from '@nestjs/platform-socket.io'
//import { WsAdapter } from '@nestjs/platform-ws';
require('dotenv').config({ path: '.env' })

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(rabbitmqMicroserviceConfig1)
  app.connectMicroservice<MicroserviceOptions>(redisMicroserviceConfig)
  await app.startAllMicroservices(  );

  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalFilters(new QueryFailedExceptionFilter())
  //app.useGlobalGuards(new AuthGuard(app.get(Reflector)))
  //app.useGlobalGuards(new RolesGuard(app.get(Reflector)))
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Listenning on port: ${process.env.PORT}`);
}
bootstrap();
