import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { providers } from '../Providers';
import { transferQueue } from '../Queue';

const prisma = new PrismaClient();
const LOG_PATH = path.resolve('..', '..', 'logs', 'transfer_logs.json');

export const processTransferJob = async(jobData: any) => {
    const { user_id, amount, currency, destination_account, attempt = 0, providerIndex = 0 } = jobData;

    const provider = providers[providerIndex];


    const logEntry = {
        user_id,
        provider: provider.name,
        success: provider.fn(),
        timestamp: new Date().toISOString(),
    };

    fs.appendFileSync(LOG_PATH, JSON.stringify(logEntry) + ',\n');

    // Check if the transfer already exists and its attempt count is less than the maximum allowed
    if (provider.fn()) {
        await prisma.transfer.update({
            where: { user_id },
            data: { status: 'completed', provider: provider.name },
        });
    } else if (attempt < (process.env.MAX_ATTEMPTS ?? 2) && providerIndex < providers.length - 1) {
        await transferQueue.add('retry-transfer', {
            ...jobData,
            attempt: attempt + 1,
            providerIndex: providerIndex + 1,
        });
        await prisma.transfer.update({
            where: { user_id },
            data: { attempt_count: { increment: 1 } },
        });
    } else {
        await prisma.transfer.update({
            where: { user_id },
            data: { status: 'failed', attempt_count: { increment: 1 } },
        });
    }
}