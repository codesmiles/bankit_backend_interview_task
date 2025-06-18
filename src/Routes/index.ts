import transferRoute from "./Transfer.route";
import { Router } from "express";

const router = Router();

router.use("/transfer", transferRoute);


export { router };