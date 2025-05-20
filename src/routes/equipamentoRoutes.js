import express from "express";
import { asyncWrapper } from '../utils/helpers/index.js';
import EquipamentoController from "../controllers/EquipamentoController.js";


const router = express.Router();
const equipamentoController = new EquipamentoController();

router
    //lista todos os equipamentos cadastrados
    .get("/equipamentos", asyncWrapper(equipamentoController.listar.bind(equipamentoController)))

    //lista um equipamento especifico
    .get("/equipamentos/:id", asyncWrapper(equipamentoController.obterPorId.bind(equipamentoController)))

    //cadastrar um equipamento
    .post("/equipamentos", asyncWrapper(equipamentoController.criar.bind(equipamentoController)))

    //atualizar dados do equipamento (que esteja ativo)
    .patch("/equipamentos/:id", asyncWrapper(equipamentoController.atualizar.bind(equipamentoController)))
    
    //INATIVA o equipamento
    .delete("/equipamentos/:id", asyncWrapper(equipamentoController.deletar.bind(equipamentoController)));

export default router;
