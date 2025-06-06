import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Document, InferIdType, InsertOneResult, WithId } from 'mongodb';

export type TestingDocument = WithId<Document>;

export interface TestingMongoService extends OnApplicationBootstrap, OnApplicationShutdown {
    write: (data: TestingDocument) => Promise<InsertOneResult>;
    read: (id: InferIdType<TestingDocument>) => Promise<TestingDocument | null>;
    ping: () => Promise<boolean>;
}
