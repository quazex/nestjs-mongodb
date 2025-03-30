import { DynamicModule, Global, Module } from '@nestjs/common';
import { MongodbAsyncOptions } from './mongodb.interfaces';
import { MongodbProviders } from './mongodb.providers';
import { MongodbOptions } from './mongodb.types';

@Global()
@Module({})
export class MongodbModule {
    public static forRoot({ name, ...options }: MongodbOptions & { name?: string }): DynamicModule {
        const optionsProvider = MongodbProviders.getOptions(options);
        const clientProvider = MongodbProviders.getClient(name);

        const dynamicModule: DynamicModule = {
            module: MongodbModule,
            providers: [
                optionsProvider,
                clientProvider,
            ],
            exports: [
                clientProvider,
            ],
        };
        return dynamicModule;
    }


    public static forRootAsync(asyncOptions: MongodbAsyncOptions): DynamicModule {
        const optionsProvider = MongodbProviders.getAsyncOptions(asyncOptions);
        const clientProvider = MongodbProviders.getClient(asyncOptions.name);

        const dynamicModule: DynamicModule = {
            module: MongodbModule,
            imports: asyncOptions.imports,
            providers: [
                optionsProvider,
                clientProvider,
            ],
            exports: [
                clientProvider,
            ],
        };

        return dynamicModule;
    }
}
