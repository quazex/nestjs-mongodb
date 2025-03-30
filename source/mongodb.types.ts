import { MongoClientOptions } from 'mongodb';

export interface MongodbOptions extends MongoClientOptions {
    url: string;
}
