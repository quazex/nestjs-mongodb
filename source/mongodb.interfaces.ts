import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';
import { MongodbOptions } from './mongodb.types';

export interface MongodbOptionsFactory {
    createMongodbOptions(): Promise<MongodbOptions> | MongodbOptions;
}

export interface MongodbAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useExisting?: Type<MongodbOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<MongodbOptions> | MongodbOptions;
}
