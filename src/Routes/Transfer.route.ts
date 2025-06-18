
import { Application, Router } from "express";
import { get_transfer, initiate_transfer } from '../Controllers';
const routes = Router();

routes.post('/initiate', initiate_transfer as Application);
routes.get('/:user_id', get_transfer as Application);

export default routes;
