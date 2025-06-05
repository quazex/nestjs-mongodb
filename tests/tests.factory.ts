import { faker } from '@faker-js/faker';
import { FactoryProvider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { Collection, InsertOneResult, MongoClient } from 'mongodb';
import { MongoModule } from '../source/mongo.module';
import { MongoTokens } from '../source/mongo.tokens';
import { TestingDocument, TestingMongoService } from './tests.types';

export class TestingMongoFactory {
    private _testing: TestingModule;
    private _container: StartedMongoDBContainer;

    private _token = faker.string.alpha({ length: 10 });
    private _coll = faker.string.alpha({ length: 10, casing: 'lower' });

    public async init(): Promise<void> {
        const tContainer = new MongoDBContainer();
        this._container = await tContainer.withReuse().start();

        const tProvider: FactoryProvider<TestingMongoService> = {
            provide: this._token,
            useFactory: (
                client: MongoClient,
                collection: Collection,
            ) => ({
                onApplicationBootstrap: async(): Promise<void> => {
                    await client.connect();
                },
                onApplicationShutdown: async(): Promise<void> => {
                    await client.close();
                },
                write: async(document): Promise<InsertOneResult> => {
                    const result = await collection.insertOne(document);
                    return result;
                },
                read: async(id): Promise<TestingDocument | null> => {
                    const reply = await collection.findOne({
                        _id: id,
                    });
                    return reply;
                },
                ping: async(): Promise<boolean> => {
                    const database = client.db();
                    const reply = await database.admin().ping();
                    return reply.ok === 1;
                },
            }),
            inject: [
                MongoTokens.getClient(),
                MongoTokens.getCollection(this._coll),
            ],
        };

        const tModule = Test.createTestingModule({
            imports: [
                MongoModule.forRoot({
                    url: this._container.getConnectionString(),
                    directConnection: true,
                }),
                MongoModule.forCollection(this._coll),
            ],
            providers: [
                tProvider,
            ],
        });

        this._testing = await tModule.compile();
        this._testing = await this._testing.init();

        this._testing.enableShutdownHooks();
    }

    public async close(): Promise<void> {
        await this._testing.close();
        await this._container.stop();
    }

    public get service(): TestingMongoService {
        return this._testing.get<TestingMongoService>(this._token);
    }
}
