# NestJS MongoDB Module

Core features:

- Based on [official MongoDB client for NodeJS](https://github.com/mongodb/node-mongodb-native);
- Covered with unit and e2e tests;
- Basic module without unnecessary boilerplate.

## Installation

To install the package, run:

```sh
npm install @quazex/nestjs-mongodb mongodb
```

## Usage

### Importing the Module

To use the MongoDB module in your NestJS application, import it into your root module (e.g., `AppModule`).

```typescript
import { Module } from '@nestjs/common';
import { MongoModule } from '@quazex/nestjs-mongodb';

@Module({
    imports: [
        MongoModule.forRoot({
            url: 'mongodb://localhost:27017',
        }),
        MongoModule.forCollection('some_col'),
    ],
})
export class AppModule {}
```

### Using Mongo connection

Once the module is registered, you can inject instances of the `MongoClient`, `Db` or `Collection` into your providers:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectMongoClient, InjectMongoDatabase, InjectMongoCollection } from '@quazex/nestjs-mongodb';
import { Collection, Db, Document, MongoClient, ObjectId, WithId } from 'mongodb';

@Injectable()
export class CollectionService {
    constructor(
        @InjectMongoClient() private readonly client: MongoClient,
        @InjectMongoDatabase() private readonly database: Db,
        @InjectMongoCollection('some_col') private readonly collection: Collection,
    ) {}

    async insert(document: WithId<Document>) {
        await this.collection.insertOne(document);
    }

    async findOne(_id: ObjectId) {
        return this.collection.findOne({
            _id,
        });
    }
}
```

### Async Configuration

If you need dynamic configuration, use `forRootAsync`:

```typescript
import { Module } from '@nestjs/common';
import { MongoModule } from '@quazex/nestjs-mongodb';

@Module({
    imports: [
        MongoModule.forRootAsync({
            useFactory: async (config: SomeConfigProvider) => ({
                url: config.MONGODB_URL,
            }),
            inject: [
                SomeConfigProvider,
            ],
        }),
    ],
})
export class AppModule {}
```

### Connection and graceful shutdown

By default, this module doesn't manage client connection on application bootstrap or shutdown. You can read more about lifecycle hooks on the NestJS [documentation page](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown).

```typescript
// main.ts
const app = await NestFactory.create(AppModule);

// Starts listening for shutdown hooks
app.enableShutdownHooks(); // <<<

await app.listen(process.env.PORT ?? 3000);
```

```typescript
// app.bootstrap.ts
import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { InjectMongoClient } from '@quazex/nestjs-mongodb';
import { MongoClient } from 'mongodb';

@Injectable()
export class AppBootstrap implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(@InjectMongoClient() private readonly client: MongoClient) {}

    public async onApplicationBootstrap(): Promise<void> {
        await this.client.connect();
    }

    public async onApplicationShutdown(): Promise<void> {
        await this.client.close();
    }
}
```

## License

MIT

