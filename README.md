# test_nestjs
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

Project to share a test implementation of [Nest](https://github.com/nestjs/nest) framework on TypeScript.

## Prerequisites

### Docker Containers
```bash
# PostgreSQL
$ docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=12345678 -d postgres

# RabbitMQ
$ docker run -it -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management

# REDIS
$ docker run -d --name redis -p 6379:6379 -p 8001:8001 -e REDIS_ARGS="--requirepass 12345678" redis/redis-stack:latest
```

### PostgreSQL database 
Connect to PostgreSQL and create database with name 'test'


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Business case

Connecting to external WS to collect crypto order books information to transform and store in different formats

### Components implemented

- Microservices: REDIS (PUB/SUB, Hashs & Streams) and RabbitMQ
- Filters: Exceptions (HTTP & Query)
- Guards: Auth, Roles and Graphql (entities)
- Pipes: Zod validation for  entities and UUID validation
- Interceptors: Serilizer and Logging
- Controllers (REST) & resolvers (Graphql)
- Websockets
- Event handlers
- Cache (Redis)
- TypeORM (PostgreSQL)


## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

