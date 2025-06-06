import { FactoryProvider, Provider, ValueProvider } from '@nestjs/common';
import { Collection, Db, MongoClient } from 'mongodb';
import { MongoAsyncOptions, MongoOptionsFactory } from './mongo.interfaces';
import { MongoTokens } from './mongo.tokens';
import { MongoOptions } from './mongo.types';

export class MongoProviders {
    public static getOptions(options: MongoOptions): ValueProvider<MongoOptions> {
        const optionsToken = MongoTokens.getOptions();
        return {
            provide: optionsToken,
            useValue: options,
        };
    }

    public static getAsyncOptions(options: MongoAsyncOptions): Provider<MongoOptions> {
        const optionsToken = MongoTokens.getOptions();
        if (options.useFactory) {
            return {
                provide: optionsToken,
                useFactory: options.useFactory,
                inject: options.inject,
            };
        }
        if (options.useExisting) {
            return {
                provide: optionsToken,
                useFactory: async(factory: MongoOptionsFactory): Promise<MongoOptions> => {
                    const client = await factory.createMongoOptions();
                    return client;
                },
                inject: [options.useExisting],
            };
        }
        throw new Error('Must provide useFactory or useClass');
    }

    public static getClient(): FactoryProvider<MongoClient> {
        const optionsToken = MongoTokens.getOptions();
        const clientToken = MongoTokens.getClient();
        return {
            provide: clientToken,
            useFactory: ({ url, ...options }: MongoOptions) => new MongoClient(url, options),
            inject: [optionsToken],
        };
    }

    public static getDatabase(): FactoryProvider<Db> {
        const clientToken = MongoTokens.getClient();
        const databaseToken = MongoTokens.getDatabase();
        return {
            provide: databaseToken,
            useFactory: (client: MongoClient) => client.db(),
            inject: [clientToken],
        };
    }

    public static getCollection(collection: string): FactoryProvider<Collection> {
        const databaseToken = MongoTokens.getDatabase();
        const collectionToken = MongoTokens.getCollection(collection);
        return {
            provide: collectionToken,
            useFactory: (database: Db) => database.collection(collection),
            inject: [databaseToken],
        };
    }
}
