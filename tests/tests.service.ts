import { Injectable } from '@nestjs/common'
import { Collection, Db, InsertOneResult } from 'mongodb'
import { InjectMongoCollection, InjectMongoDatabase } from '../source/mongo.decorators'
import { TTestingDocument } from './tests.types'

export const COLLECTION_NAME = 'testing'

@Injectable()
export class TestingMongoService {
  constructor(
    @InjectMongoDatabase() private readonly database: Db,
    @InjectMongoCollection(COLLECTION_NAME) private readonly collection: Collection,
  ) {}

  public async write(document: TTestingDocument): Promise<InsertOneResult> {
    return this.collection.insertOne(document)
  }

  public async read(id: TTestingDocument['_id']): Promise<TTestingDocument | null> {
    return this.collection.findOne({ _id: id }) as Promise<TTestingDocument | null>
  }

  public async ping(): Promise<boolean> {
    const reply = await this.database.admin().ping()
    return reply.ok === 1
  }
}
