import { Queue } from 'bullmq';
import { redis } from '../Config';
import { QueueNames } from '../Util';

export const transferQueue = new Queue(QueueNames.TRANSFER, {
    connection: redis,
});
