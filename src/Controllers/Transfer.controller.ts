import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import { transferQueue } from '../Queue';
import { ResponseBuilder, QueueNames } from '../Util';

const prisma = new PrismaClient();
export const initiate_transfer = async (req: Request, res: Response) => { 
    let successResponse: ResponseBuilder<Object>;
    let errorResponse: ResponseBuilder<unknown>;
    try {
        const { user_id, amount, currency, destination_account } = await req.body;

        if (!user_id || !amount || !currency || !destination_account) {
            errorResponse = new ResponseBuilder(ResponseBuilder.ERROR_MESSAGE, 400, 'Missing required fields');
            return res.status(400).json(errorResponse.toJson());
        }

        const create_transfer = await prisma.transfer.create({
            data: {
                user_id,
                amount,
                currency,
                destination_account,
            },
        });

        const transfer_queue = await transferQueue.add(QueueNames.TRANSFER, {
            id: create_transfer.id,
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
    let successResponse: ResponseBuilder<Object[]>;
    let errorResponse: ResponseBuilder<unknown>;
    try {
        const transfer = await prisma.transfer.findMany({
            where: { user_id: req.params.user_id },
        });
        
        if (!transfer || transfer.length === 0) {
            errorResponse = new ResponseBuilder(ResponseBuilder.ERROR_MESSAGE, 404, 'Transfer not found');
            return res.status(404).json(errorResponse.toJson());
        }

        successResponse = new ResponseBuilder(ResponseBuilder.SUCCESS_MESSAGE, 200, transfer);
        res.status(200).json(successResponse.toJson());
    } catch (error) {
        console.error(error);
        errorResponse = new ResponseBuilder(ResponseBuilder.ERROR_MESSAGE, 500, error);
        res.status(500).json(errorResponse.toJson());
    }
}