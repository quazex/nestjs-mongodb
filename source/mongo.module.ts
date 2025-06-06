import { DynamicModule } from '@nestjs/common';
import { MongoAsyncOptions } from './mongo.interfaces';
import { MongoProviders } from './mongo.providers';
import { MongoOptions } from './mongo.types';

export class MongoModule {
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
