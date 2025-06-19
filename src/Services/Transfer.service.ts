import { PrismaClient } from '@prisma/client';
import { providers } from '../Providers';
import { transferQueue } from '../Queue';
import { logToFile } from '../Util';

const prisma = new PrismaClient();

export const processTransferJob = async(jobData: any) => {
    const { user_id, amount, currency, destination_account, attempt = 0, providerIndex = 0 } = jobData;
    const provider = providers[providerIndex];
    const logEntry = {
        user_id,
        provider: provider.name,
        success: provider.fn(),
        timestamp: new Date().toISOString(),
    };

    // find or create the directory and file
    logToFile(logEntry);

    // Check if the transfer already exists and its attempt count is less than the maximum allowed
    if (provider.fn()) {
        console.log("event successful")
        await prisma.transfer.update({
            where: { user_id },
            data: { status: 'completed', provider: provider.name },
        });
    } else if (attempt < (process.env.MAX_ATTEMPTS ?? 2) && providerIndex < providers.length - 1) {
        console.log("event failed, retrying...")
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
        console.log("event failed")
        await prisma.transfer.update({
            where: { user_id },
            data: { status: 'failed', attempt_count: { increment: 1 } },
        });
    }
}