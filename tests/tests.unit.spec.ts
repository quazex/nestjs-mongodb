import { Faker, faker } from '@faker-js/faker';
import { describe, expect, jest, test } from '@jest/globals';
import { Injectable, Module, ValueProvider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongodbOptionsFactory } from '../source/mongodb.interfaces';
import { MongodbModule } from '../source/mongodb.module';
import { MongodbOptions } from '../source/mongodb.types';

jest.mock('mongodb', () => ({
    MongoClient: jest.fn(),
}));

describe('Mongodb > Unit', () => {
    test('forRoot()', async() => {
        const tBuilder = Test.createTestingModule({
            imports: [
                MongodbModule.forRoot({
                    url: faker.internet.url(),
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(MongodbModule);
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
                MongodbModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: (f: Faker) => ({
                        url: f.internet.url(),
                    }),
                    inject: [configToken],
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(MongodbModule);
        expect(oModule).toBeInstanceOf(MongodbModule);

        await tFixture.close();
    });

    test('forRootAsync with useExisting()', async() => {
        @Injectable()
        class MongodbConfig implements MongodbOptionsFactory {
            public createMongodbOptions(): MongodbOptions {
                return {
                    url: faker.internet.url(),
                };
            }
        }

        @Module({
            providers: [MongodbConfig],
            exports: [MongodbConfig],
        })
        class ConfigModule {}

        const tBuilder = Test.createTestingModule({
            imports: [
                MongodbModule.forRootAsync({
                    imports: [ConfigModule],
                    useExisting: MongodbConfig,
                    name: faker.string.alpha({ length: 10 }),
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(MongodbModule);
        expect(oModule).toBeInstanceOf(MongodbModule);

        await tFixture.close();
    });
});
