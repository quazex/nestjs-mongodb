import { Test, TestingModule } from '@nestjs/testing'
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import { MongoModule } from '../source/mongo.module'
import { COLLECTION_NAME, TestingMongoService } from './tests.service'

export class TestingMongoFactory {
  private _testing: TestingModule
  private _container: StartedMongoDBContainer

  public async init(): Promise<void> {
    const tContainer = new MongoDBContainer('mongo:8.2.6')
    this._container = await tContainer.withReuse().start()

    const tModule = Test.createTestingModule({
      imports: [
        MongoModule.forRoot({
          url: this._container.getConnectionString(),
          directConnection: true,
        }),
        MongoModule.forCollection(COLLECTION_NAME),
      ],
      providers: [
        TestingMongoService,
      ],
    })

    this._testing = await tModule.compile()
    this._testing.enableShutdownHooks()

    this._testing = await this._testing.init()
  }

  public async close(): Promise<void> {
    await this._testing.close()
    await this._container.stop()
  }

  public get service(): TestingMongoService {
    return this._testing.get(TestingMongoService)
  }
}
