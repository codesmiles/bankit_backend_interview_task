import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import { transferQueue } from '../Queue';

const prisma = new PrismaClient();
export const initiate_transfer = async (req: Request, res: Response) => { 

    try {
        const { user_id, amount, currency, destination_account } = req.body;

        await prisma.transfer.create({
            data: {
                user_id,
                amount,
                currency,
                destination_account,
            },
        });

        await transferQueue.add('new-transfer', {
            user_id,
            amount,
            currency,
            destination_account,
            attempt: 0,
            providerIndex: 0,
        });

        res.status(200).json({ message: 'Transfer initiated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not initiate transfer' });
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