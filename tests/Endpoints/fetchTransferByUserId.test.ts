import dotenv from 'dotenv';
dotenv.config();
import {app} from '../../src';
import request from 'supertest';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const endpoint = (user_id:string) => `/api/v1/transfer/${user_id}`;
const prisma = new PrismaClient();

describe('Fetch Transfer', () => {
    beforeAll(async () => {
        // connect to a new test database
        execSync('npx prisma migrate reset --force --skip-seed', {
            env: {
                ...process.env,
                DATABASE_URL: process.env.TEST_DATABASE_URL,
            },
        });
    });

    beforeEach(async () => {
        await prisma.transfer.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('checks for transfer transaction not found', async () => {
        const response = await request(app).get(endpoint('non_existent_user'));

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: "Operation failed",
            status: 404,
            data: "Transfer not found"
        });
    });

    it('checks for transfer transaction successful', async () => { 
        // create a transaction
        const transfer = await prisma.transfer.create({
            data: {
                user_id: 'test_user',
                amount: 1000,
                currency: 'NGN',
                destination_account: '0123456789',
            },
        });
        const response = await request(app).get(endpoint(transfer.user_id));
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Operation succeeded",
            status: 200,
            data: [{ ...transfer, amount:expect.any(String), created_at: expect.any(String), updated_at: expect.any(String) },]
        });
    })
})