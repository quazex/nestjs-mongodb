import { DynamicModule, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { InjectMongoClient } from './mongo.decorators';
import { MongoAsyncOptions } from './mongo.interfaces';
import { MongoProviders } from './mongo.providers';
import { MongoOptions } from './mongo.types';

export class MongoModule implements OnModuleInit, OnModuleDestroy {
    constructor(@InjectMongoClient() private readonly client: MongoClient) {}

    public async onModuleInit(): Promise<void> {
        await this.client.connect();
    }

    public async onModuleDestroy(): Promise<void> {
        await this.client.close();
    }

    public static forRoot(options: MongoOptions): DynamicModule {
        const optionsProvider = MongoProviders.getOptions(options);
        const clientProvider = MongoProviders.getClient();
        const databaseProvider = MongoProviders.getDatabase();

        const dynamicModule: DynamicModule = {
            global: true,
            module: MongoModule,
            providers: [
                optionsProvider,
                clientProvider,
                databaseProvider,
            ],
            exports: [
                clientProvider,
                databaseProvider,
            ],
        };
        return dynamicModule;
    }


    public static forRootAsync(asyncOptions: MongoAsyncOptions): DynamicModule {
        const optionsProvider = MongoProviders.getAsyncOptions(asyncOptions);
        const clientProvider = MongoProviders.getClient();
        const databaseProvider = MongoProviders.getDatabase();

        const dynamicModule: DynamicModule = {
            global: true,
            module: MongoModule,
            imports: asyncOptions.imports,
            providers: [
                optionsProvider,
                clientProvider,
                databaseProvider,
            ],
            exports: [
                clientProvider,
                databaseProvider,
            ],
        };

        return dynamicModule;
    }

    public static forCollection(collection: string): DynamicModule {
        const collectionProvider = MongoProviders.getCollection(collection);
        return {
            module: MongoModule,
            providers: [collectionProvider],
            exports: [collectionProvider],
        };
    }
}
