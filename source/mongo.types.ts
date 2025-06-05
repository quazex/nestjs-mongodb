import { MongoClientOptions } from 'mongodb';

export interface MongoOptions extends MongoClientOptions {
    url: string;
}
