import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';
import { MongoOptions } from './mongo.types';

export interface MongoOptionsFactory {
    createMongoOptions(): Promise<MongoOptions> | MongoOptions;
}

export interface MongoAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useExisting?: Type<MongoOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<MongoOptions> | MongoOptions;
}
