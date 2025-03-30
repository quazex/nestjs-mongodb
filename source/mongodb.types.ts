import { MongoClientOptions } from 'mongodb';

export interface MongodbOptions extends MongoClientOptions {
    url: string;
}

export interface MongodbCollection {
    name?: string;
    coll: string;
}
