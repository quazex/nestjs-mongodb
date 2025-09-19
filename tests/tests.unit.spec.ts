import { Faker, faker } from '@faker-js/faker';
import { describe, expect, jest, test } from '@jest/globals';
import { Injectable, Module, ValueProvider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoOptionsFactory } from '../source/mongo.interfaces';
import { MongoModule } from '../source/mongo.module';
import { MongoOptions } from '../source/mongo.types';

jest.mock('mongodb', () => ({
    MongoClient: jest.fn().mockReturnValue({
        connect: jest.fn(),
        close: jest.fn(),
        db: jest.fn().mockReturnValue({
            collection: jest.fn(),
        }),
    }),
}));

describe('Mongo > Unit', () => {
    test('forRoot()', async() => {
        const tBuilder = Test.createTestingModule({
            imports: [
                MongoModule.forRoot({
                    url: faker.internet.url(),
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(MongoModule);
        expect(oModule).toBeDefined();

        await tFixture.close();
    });

    test('forRootAsync with useFactory()', async() => {
        const configToken = faker.word.adjective();
        const provider: ValueProvider<Faker> = {
            provide: configToken,
            useValue: faker,
        };

        @Module({
            providers: [provider],
            exports: [provider],
        })
        class ConfigModule {}

        const tBuilder = Test.createTestingModule({
            imports: [
                MongoModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: (f: Faker) => ({
                        url: f.internet.url(),
                    }),
                    inject: [configToken],
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(MongoModule);
        expect(oModule).toBeInstanceOf(MongoModule);

        await tFixture.close();
    });

    test('forRootAsync with useExisting()', async() => {
        @Injectable()
        class MongoConfig implements MongoOptionsFactory {
            public createMongoOptions(): MongoOptions {
                return {
                    url: faker.internet.url(),
                };
            }
        }

        @Module({
            providers: [MongoConfig],
            exports: [MongoConfig],
        })
        class ConfigModule {}

        const tBuilder = Test.createTestingModule({
            imports: [
                MongoModule.forRootAsync({
                    imports: [ConfigModule],
                    useExisting: MongoConfig,
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(MongoModule);
        expect(oModule).toBeInstanceOf(MongoModule);

        await tFixture.close();
    });
});
