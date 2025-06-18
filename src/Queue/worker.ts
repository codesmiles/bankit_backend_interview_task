import { Worker } from 'bullmq';
import { redis } from '../Config';
import { processTransferJob } from '../Services';

export const transferWorker = new Worker(
    'transferQueue',
    async job => {
        await processTransferJob(job.data);
    },
    { connection: redis, concurrency: 5 }
);
