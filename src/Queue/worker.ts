import { Worker } from 'bullmq';
import { redis } from '../Config';
import { processTransferJob } from '../Services';
import { QueueNames } from '../Util';

export const transferWorker = new Worker(
    QueueNames.TRANSFER,
    async job => {
        await processTransferJob(job.data);
    },
    { connection: redis }
);
