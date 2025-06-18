// src/queue/transferQueue.ts
import Queue from 'bull';
import { processTransfer } from '../Services';

export const transferQueue = new Queue('transfer-queue', {
    redis: { port: 6379, host: '127.0.0.1' }
});

transferQueue.process(processTransfer);