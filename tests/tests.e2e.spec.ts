import { faker } from '@faker-js/faker';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { ObjectId } from 'mongodb';
import { TestingMongodbFactory } from './tests.factory';
import { TestingDocument } from './tests.types';

describe('Mongodb > E2E', () => {
    const tModule = new TestingMongodbFactory();

    beforeAll(tModule.init.bind(tModule));
    afterAll(tModule.close.bind(tModule));

    test('Check connection', async() => {
        const service = tModule.getService();
        const isHealth = await service.ping();

        expect(isHealth).toBe(true);
    });

    test('Check write/read operations', async() => {
        const service = tModule.getService();

        const document: TestingDocument = {
            _id: new ObjectId(),
            name: faker.person.firstName(),
            updated_at: new Date(),
        };

        const result = await service.write(document);
        const reply = await service.read(document._id);

        expect(reply).toBeDefined();
        expect(reply?.name).toBe(document.name);
        expect(result.acknowledged).toBeTruthy();
    });
});
