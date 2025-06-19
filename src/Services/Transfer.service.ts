import { PrismaClient } from '@prisma/client';
import { providers } from '../Providers';
import { transferQueue } from '../Queue';
import { logToFile, QueueNames } from '../Util';

const prisma = new PrismaClient();

export const processTransferJob = async (jobData: any) => {
    const { id, user_id, attempt = 0, providerIndex = 0 } = jobData;
    const provider = providers[providerIndex];
    const provider_called = provider.fn()

    const logEntry = {
        user_id,
        provider: provider.name,
        success: provider_called,
        timestamp: new Date().toISOString(),
    };

    // find or create the directory and file
    logToFile(logEntry);

    // Check if the transfer already exists and its attempt count is less than the maximum allowed  
    switch (true) {
        case provider_called:
            // event successful
            await prisma.transfer.update({
                where: { id },
                data: { status: 'completed', provider: provider.name, attempt_count: { increment: 1 },},
            });

            //TODO dont forget the webhook
            // fetch(`${process.env.WEBHOOK_URL}/transfer`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         user_id,
            //         transfer_id: id,
            //         status: 'completed',
            //         provider: provider.name,
            //         timestamp: new Date().toISOString(),
            //     }),
            // })
            // .catch((error) => {
            //     console.error("Webhook error:", error);
            // })
            
            break;

        case attempt < parseInt(process.env.MAX_ATTEMPTS as string, 10):
            // event failed, retrying...
            await transferQueue.add(QueueNames.TRANSFER, {
                ...jobData,
                attempt: attempt + 1
            });

            await prisma.transfer.update({
                where: { id },
                data: { attempt_count: { increment: 1 } },
            });
            break;

        case providerIndex < providers.length - 1:
            // event failed, trying next provider
            await transferQueue.add(QueueNames.TRANSFER, {
                ...jobData,
                attempt: 0,
                providerIndex: providerIndex + 1,
            });

            await prisma.transfer.update({
                where: { id },
                data: { attempt_count: 1, provider: provider.name },
            });
            break;

        default:
            console.log("event failed")
            await prisma.transfer.update({
                where: { id },
                data: { status: 'failed', provider: provider.name },
            });
            break;
    }

}