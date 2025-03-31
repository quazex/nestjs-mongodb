import { faker } from '@faker-js/faker';
import { FactoryProvider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { InsertOneResult, MongoClient } from 'mongodb';
import { MongodbModule } from '../source/mongodb.module';
import { MongodbUtilities } from '../source/mongodb.utilities';
import { TestingDocument, TestingMongodbService } from './tests.types';

export class TestingMongodbFactory {
    private _testing: TestingModule;
    private _container: StartedMongoDBContainer;

    private _token = faker.string.alpha({ length: 10 });
    private _table = faker.string.alpha({ length: 10, casing: 'lower' });

    public async init(): Promise<void> {
        const tContainer = new MongoDBContainer();

        this._container = await tContainer.withReuse().start();

        const tProvider: FactoryProvider<TestingMongodbService> = {
            provide: this._token,
            useFactory: (client: MongoClient) => ({
                onApplicationBootstrap: async(): Promise<void> => {
                    await client.connect();
                },
                onApplicationShutdown: async(): Promise<void> => {
                    await client.close();
                },
                write: async(document): Promise<InsertOneResult> => {
                    const collection = client.db().collection(this._table);
                    const result = await collection.insertOne(document);
                    return result;
                },
                read: async(id): Promise<TestingDocument | null> => {
                    const collection = client.db().collection(this._table);
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
                MongodbUtilities.getClientToken(),
            ],
        };

        const tModule = Test.createTestingModule({
            imports: [
                MongodbModule.forRoot({
                    url: this._container.getConnectionString(),
                    directConnection: true,
                }),
            ],
            providers: [
                tProvider,
            ],
        });

        this._testing = await tModule.compile();
        this._testing.enableShutdownHooks();
    }

    public async close(): Promise<void> {
        await this._testing.close();
        await this._container.stop();
    }

    public getService(): TestingMongodbService {
        return this._testing.get<TestingMongodbService>(this._token);
    }
}
