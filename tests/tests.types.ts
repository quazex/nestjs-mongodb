import { Document, InferIdType, InsertOneResult, WithId } from 'mongodb';

export type TestingDocument = WithId<Document>;

export interface TestingMongoService {
    write: (data: TestingDocument) => Promise<InsertOneResult>;
    read: (id: InferIdType<TestingDocument>) => Promise<TestingDocument | null>;
    ping: () => Promise<boolean>;
}
