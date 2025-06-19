# TASK

## Bankit Interview Task

## ENDPOINTS
- POST /transfer/initiate
  - Request Body:
    - `from_user_id`: ID of the user initiating the transfer
    - `amount`: Amount to be transferred
    - `Currency`: Currency of the transfer (e.g., USD, EUR)
    - `destination_account`: ID of the user receiving the transfer
  - Job Queue:
    - `status`: Status of the transfer (e.g., pending, completed, failed)
    - `attempt count`: Number of attempts to process the transfer
    - `provider index`: Index of the provider used for the transfer
    - If the transfer is successful, the provider will send a webhook to this endpoint to update the status of the transfer.
- GET /transfer/status/:user_id

- In an interaction that provides a webhook who provides the webhook

- prisma commands:
```
    sudo npx prisma generate
    sudo npx prisma migrate dev --name init 
```

## WHAT TO DO
- use prisma studio instead of pgAdmin
- Update the readme documentation
- write tests for the implementation


```
    // if (provider.fn()) {
    //     console.log("event successful")
    //     await prisma.transfer.update({
    //         where: { id },
    //         data: { status: 'completed', provider: provider.name },
    //     });
    // } else if (attempt < (process.env.MAX_ATTEMPTS ?? 2)) {
    //     console.log("event failed, retrying...")
    //     await transferQueue.add('retry-transfer', {
    //         ...jobData,
    //         attempt: attempt + 1
    //     });

    //     await prisma.transfer.update({
    //         where: { id },
    //         data: { attempt_count: { increment: 1 } },
    //     });
    // }

    // else if (providerIndex < providers.length - 1) {
    //     console.log("event failed, trying next provider")
    //     await transferQueue.add('retry-transfer', {
    //         ...jobData,
    //         attempt: 0,
    //         providerIndex: providerIndex + 1,
    //     });

    //     await prisma.transfer.update({
    //         where: { id },
    //         data: { attempt_count: { increment: 1 }, provider: provider.name },
    //     });
    // }
    // else {
    //     console.log("event failed")
    //     await prisma.transfer.update({
    //         where: { id },
    //         data: { status: 'failed', attempt_count: { increment: 1 } },
    //     });
    // }
    ```

    ```
// // Redis connection check
// redis.on('connect', () => {
//     console.log('Connected to Redis');
//     redis.disconnect();
// }).on('error', (err) => {
//     console.error('Redis connection error:', err);
// });


// // Database connection check
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// prisma.$connect()
//     .then(() => {
//         console.log('Connected to the database')
//         prisma.$disconnect()
//     })
//     .catch(err => console.error('Database connection error:', err));
    ```