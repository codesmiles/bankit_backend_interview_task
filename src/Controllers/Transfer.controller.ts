import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import { transferQueue } from '../Queue';
import { ResponseBuilder } from '../Util';

const prisma = new PrismaClient();
export const initiate_transfer = async (req: Request, res: Response) => { 
    let successResponse: ResponseBuilder<Object>;
    let errorResponse: ResponseBuilder<unknown>;
    try {
        const { user_id, amount, currency, destination_account } = req.body;

        const create_transfer = await prisma.transfer.create({
            data: {
                user_id,
                amount,
                currency,
                destination_account,
            },
        });

        const transfer_queue = await transferQueue.add('new-transfer', {
            user_id,
            amount,
            currency,
            destination_account,
            attempt: 0,
            providerIndex: 0,
        });
        successResponse = new ResponseBuilder(ResponseBuilder.SUCCESS_MESSAGE, 200, { transfer: create_transfer, queueId: transfer_queue.id });
        res.status(200).json(successResponse.toJson());
    } catch (error) {
        console.error(error);
        errorResponse = new ResponseBuilder(ResponseBuilder.ERROR_MESSAGE, 500, error);
        res.status(500).json(errorResponse.toJson());
    }
}
export const get_transfer = async (req: Request, res: Response) => {
    try {
        const transfer = await prisma.transfer.findUnique({
            where: { user_id: req.params.user_id },
        });
        if (!transfer) {
            return res.status(404).json({ message: 'Transfer not found' });
        }
        res.status(200).json({ transfer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not retrieve transfer' });
    }
}