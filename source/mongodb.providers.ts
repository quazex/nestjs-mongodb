import { FactoryProvider, Provider, ValueProvider } from '@nestjs/common';
import { MongoClient, MongoClientOptions } from 'mongodb';
import { MongodbAsyncOptions, MongodbOptionsFactory } from './mongodb.interfaces';
import { MongodbOptions } from './mongodb.types';
import { MongodbUtilities } from './mongodb.utilities';

export class MongodbProviders {
    public static getOptions(options: MongoClientOptions & { name?: string }): ValueProvider<MongoClientOptions> {
        const optionsToken = MongodbUtilities.getOptionsToken(options.name);
        return {
            provide: optionsToken,
            useValue: options,
        };
    }

    public static getAsyncOptions(options: MongodbAsyncOptions): Provider<MongoClientOptions> {
        const optionsToken = MongodbUtilities.getOptionsToken(options.name);
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
                useFactory: async(factory: MongodbOptionsFactory): Promise<MongoClientOptions> => {
                    const client = await factory.createMongodbOptions();
                    return client;
                },
                inject: [options.useExisting],
            };
        }
        throw new Error('Must provide useFactory or useClass');
    }

    public static getClient(name?: string): FactoryProvider<MongoClient> {
        const optionsToken = MongodbUtilities.getOptionsToken(name);
        const clientToken = MongodbUtilities.getClientToken(name);
        return {
            provide: clientToken,
            useFactory: ({ url, ...options }: MongodbOptions) => new MongoClient(url, options),
            inject: [optionsToken],
        };
    }
}
