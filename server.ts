import dotenv from 'dotenv';

dotenv.config();
import express, { Request, Response } from 'express';
import  { redis,router } from "./src"


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes config
app.use("/api/v1", router);

// Redis connection check
redis.on('connect', () => {
    console.log('Connected to Redis');
}).on('error', (err) => {
    console.error('Redis connection error:', err);
});


// Database connection check
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.$connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));

// Api Health Check
app.get("/health", (req: Request, res: Response) => {
    let message:string;
    try {
        message = "API is working very fine fire on!!!";
        res.status(200).json({message});
    } catch (err) {
        message = "API is not working";
        console.error("Error during health check:", err);
        res
            .status(400)
            .json({ message });
    }
});

const PORT = process.env.PORT ?? 3005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
