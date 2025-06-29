import dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from 'express';
import { router } from "./Routes"
import { ResponseBuilder } from "./Util"


const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes config
app.use("/api/v1", router);


// Api Health Check
app.get("/health", (req: Request, res: Response) => {
    let message: string;
    try {
        message = "API is working very fine fire on!!!";
        const successResponse = new ResponseBuilder(ResponseBuilder.SUCCESS_MESSAGE, 200, message);
        res.status(200).json(successResponse.toJson());
    } catch (err) {
        message = "API is not working";
        res.status(400).json(new ResponseBuilder(message, 400, err).toJson());
    }
});

export { app }
