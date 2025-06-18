// src/services/transferService.ts
import fs from 'fs';
import path from 'path';
import { providers } from '../Providers';
import { Job } from 'bull';

export const processTransfer = async (job: Job) => {
    const data = job.data;
    const maxAttempts = process.env.MAX_ATTEMPTS || 3;

    while (data.attempt_count < maxAttempts) {
        const provider = providers[data.provider_index];
        const success = provider.fn();

        logAttempt(data.user_id, provider.name, success);

        if (success) {
            data.status = 'success';
            break;
        }

        data.attempt_count++;
        if (data.provider_index < providers.length - 1) {
            data.provider_index++;
        } else if (data.attempt_count >= maxAttempts) {
            data.status = 'failed';
            break;
        }
    }

    // Save status for lookup
    statusStore[data.user_id] = data.status;
};

const statusStore: Record<string, string> = {};

export const getStatus = (userId: string) => {
    return statusStore[userId] || 'pending';
};

const logAttempt = (user_id: string, provider: string, success: boolean) => {
    const log = {
        user_id,
        provider,
        success,
        timestamp: new Date().toISOString()
    };
    const logPath = path.join(__dirname, '../logs/transfer_logs.json');
    fs.appendFileSync(logPath, JSON.stringify(log) + ',\n');
};
