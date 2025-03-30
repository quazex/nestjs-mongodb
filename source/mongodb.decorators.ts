import { Inject } from '@nestjs/common';
import { MongodbUtilities } from './mongodb.utilities';

export const InjectMongodb = (name?: string): ReturnType<typeof Inject> => {
    const token = MongodbUtilities.getClientToken(name);
    return Inject(token);
};
