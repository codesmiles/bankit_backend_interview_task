import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import { execSync } from 'child_process';
import { QueueNames, transferQueue, app } from '../../src';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const addSpy = jest.spyOn(transferQueue, 'add');
const endpoint = "/api/v1/transfer/initiate";
const payload = {
    user_id: 'test_user',
    amount: 1000,
    currency: 'NGN',
    destination_account: '0123456789',
};


describe('Transfer Flow', () => {
    beforeAll(async () => { 
        // connect to a new test database
        addSpy.mockClear();
        execSync('npx prisma migrate reset --force --skip-seed', {
            env: {
                ...process.env,
                DATABASE_URL: process.env.TEST_DATABASE_URL,
            },
        });
    });

    beforeEach(async () => {
        await transferQueue.drain();
        await prisma.transfer.deleteMany({});

     });

    afterEach(async () => { });

    afterAll(async () => { 
        await transferQueue.close();
        await prisma.$disconnect();
    });


    it('checks for missing fields', async () => {
        const response = await request(app).post(endpoint).send({
            user_id: 'test_user',
            amount: 1000,
            currency: 'NGN'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Operation failed",
            status: 400,
            data: "Missing required fields"
        });
    });
    
    it('checks for saved transfer to the database', async () => {
        const response = await request(app).post(endpoint).send(payload);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('transfer');
        expect(response.body.data.transfer).toHaveProperty('user_id', payload.user_id);
        expect(response.body.data.transfer).toHaveProperty('amount', `${payload.amount}`);
        expect(response.body.data.transfer).toHaveProperty('currency', payload.currency);
        expect(response.body.data.transfer).toHaveProperty('destination_account', payload.destination_account);
    });

    it('checks for transfer transaction was added to the queue', async () => {
        const response = await request(app).post(endpoint).send(payload);
        
        expect(transferQueue.add).toHaveBeenCalledWith(QueueNames.TRANSFER, {
            id: expect.any(Number),
            user_id: payload.user_id,
            amount: payload.amount,
            currency: payload.currency,
            destination_account: payload.destination_account,
            attempt: 0,
            providerIndex: 0
        })
        expect(response.status).toBe(200);
    });

    it('checks for successful response', async () => {
        const response = await request(app).post(endpoint).send(payload);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Operation succeeded",
            status: 200,
            data: {
                transfer: expect.objectContaining({
                    id: expect.any(Number),
                    user_id: payload.user_id,
                    amount: `${payload.amount}`,
                    currency: payload.currency,
                    destination_account: payload.destination_account,
                    attempt_count: 0,
                    status: "pending",
                    provider: null,
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                }),
                queueId: response.body.data.queueId
                }  
            })
        });
});
