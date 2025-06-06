import { Inject } from '@nestjs/common';
import { MongoTokens } from './mongo.tokens';

export const InjectMongoClient = (): ReturnType<typeof Inject> => {
    const token = MongoTokens.getClient();
    return Inject(token);
};

export const InjectMongoDatabase = (): ReturnType<typeof Inject> => {
    const token = MongoTokens.getDatabase();
    return Inject(token);
};

export const InjectMongoCollection = (name: string): ReturnType<typeof Inject> => {
    const token = MongoTokens.getCollection(name);
    return Inject(token);
};
