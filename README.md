# NestJS MongoDB Module

Core features:

- Based on [official MongoDB client for NodeJS](https://github.com/mongodb/node-mongodb-native);
- Supports multiple instances;
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
import { MongodbModule } from '@quazex/nestjs-mongodb';

@Module({
  imports: [
    MongodbModule.forRoot({
        name: 'my-mongodb', // optional
        url: 'mongodb://localhost:27017',
    }),
  ],
})
export class AppModule {}
```

### Using MongoDB Service

Once the module is registered, you can inject instance of the `MongodbClient` into your providers:

```typescript
import { Injectable } from '@nestjs/common';
import { Collection, Document, MongoClient, ObjectId, WithId } from '@mongodb-project/mongodb';
import { InjectMongodb } from '@quazex/nestjs-mongodb';

@Injectable()
export class CollectionService {
    private readonly collection: Collection;

    constructor(@InjectMongodb() mongodbClient: MongoClient) {
        this.collection = mongodbClient.db().collection('collection_name');
    }

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
@Module({
    imports: [
        MongodbModule.forRootAsync({
            useFactory: async () => ({
                url: process.env.MONGODB_URL,
            }),
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

app.useLogger(logger);
app.enableShutdownHooks(); // <<<

app.setGlobalPrefix('api');
app.enableVersioning({
    type: VersioningType.URI,
});

await app.listen(appConfig.port, '0.0.0.0');
```

```typescript
// app.bootstrap.ts
import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Client } from '@mongodb-project/mongodb';
import { InjectMongodb } from '@quazex/nestjs-mongodb';

@Injectable()
export class AppBootstrap implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(@InjectMongodb() private readonly mongodbClient: Client) {}

    public async onApplicationBootstrap(): Promise<void> {
        await this.mongodbClient.connect();
    }

    public async onApplicationShutdown(): Promise<void> {
        await this.mongodbClient.close();
    }
}
```

## License

MIT

