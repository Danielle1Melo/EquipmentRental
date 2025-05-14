import express from "express";
import { asyncWrapper } from '../utils/helpers/index.js';

const router = express.Router();

const EquipamentoController = new EquipamentoController(); 

router
    .get("/equipamentos", asyncWrapper(EquipamentoController.listar.bind(EquipamentoController)))
    .get("/equipamentos/:id", asyncWrapper(EquipamentoController.listar.bind(EquipamentoController)))
    .post("/equipamentos",  asyncWrapper(EquipamentoController.criar.bind(EquipamentoController)))
    .patch("/equipamentos/:id", asyncWrapper(EquipamentoController.atualizar.bind(EquipamentoController)))
    .delete("/equipamentos/:id", asyncWrapper(EquipamentoController.deletar.bind(EquipamentoController)))

export default router;
