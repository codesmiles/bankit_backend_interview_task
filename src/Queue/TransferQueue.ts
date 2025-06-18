import { Queue } from 'bullmq';
import { redis } from '../Config';

export const transferQueue = new Queue('transferQueue', {
    connection: redis,
});
