import express from "express";
//import AuthMiddleware from "../middlewares/AuthMiddleware.js";
//import authPermission from '../middlewares/AuthPermission.js';
import ReservaController from '../controllers/ReservaController.js';
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const reservaController = new ReservaController(); 


export default router;

