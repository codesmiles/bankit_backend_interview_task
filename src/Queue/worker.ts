import { Worker } from 'bullmq';
import { redis } from '../Config';
import { processTransferJob } from '../Services';
import { QueueNames } from '../Util';

let transferWorker: Worker | null = null;

export const startWorker = () => {
    transferWorker = new Worker(
        QueueNames.TRANSFER,
        async job => {
            await processTransferJob(job.data);
        },
        { connection: redis }
    ).on("error", (error) => console.error("Worker error:", error));

    return transferWorker;
}

export async function stopWorker() {
    if (transferWorker) {
        await transferWorker.close();
        transferWorker = null;
    }
}
