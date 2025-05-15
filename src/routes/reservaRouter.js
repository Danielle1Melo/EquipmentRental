import express from "express";
//import AuthMiddleware from "../middlewares/AuthMiddleware.js";
//import authPermission from '../middlewares/AuthPermission.js';
import ReservaController from '../controllers/ReservaController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const reservaController = new ReservaController(); 

router
.get("/reservas", asyncWrapper(reservaController.listar.bind(reservaController)))
.get("/reservas/:id", asyncWrapper(reservaController.listar.bind(reservaController)))
.post("/reservas", asyncWrapper(reservaController.criar.bind(reservaController)))
.patch("/reservas/:id", asyncWrapper(reservaController.atualizar.bind(reservaController)))

export default router;

