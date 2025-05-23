import mongoose from "mongoose";
import { equipamentoSchema, equipamentoUpdateSchema } from "../utils/validators/schemas/zod/EquipamentoSchema.js";
import { EquipamentoQuerySchema, EquipamentoIdSchema } from "../utils/validators/schemas/zod/querys/EquipamentoQuerySchema.js";
import EquipamentoService from "../services/EquipamentoService.js";
import { CommonResponse, asyncWrapper } from "../utils/helpers/index.js";

class EquipamentoController {
  constructor() {
    this.service = new EquipamentoService();
  }

  listar = asyncWrapper(async (req, res) => {
    const query = req.query || {};
    if (Object.keys(query).length !== 0) {
      await EquipamentoQuerySchema.parseAsync(query);
    }

    const data = await this.service.buscarEquipamentos(query);
    return CommonResponse.success(res, data);
  });

  obterPorId = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    EquipamentoIdSchema.parse(id);

   const usuarioId = "682520e98e38a049ac569";
    const equipamento = await this.service.detalharEquipamento(id, usuarioId);
    return CommonResponse.success(res, equipamento);
  });

  criar = asyncWrapper(async (req, res) => {
    const dados = equipamentoSchema.parse(req.body);
    const equipamento = await this.service.criarEquipamento(dados);

    return CommonResponse.created(res, {
      mensagem: 'Equipamento cadastrado. Aguardando aprovação.',
      equipamento,
    });
  });

  atualizar = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    EquipamentoIdSchema.parse(id);

    const dadosAtualizados = equipamentoUpdateSchema.parse(req.body);

    const equipamento = await this.service.atualizarEquipamento(id, dadosAtualizados);

    return CommonResponse.success(res, {
      mensagem: 'Equipamento atualizado com sucesso.',
      equipamento,
    });
  });

  deletar = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    EquipamentoIdSchema.parse(id);


    await this.service.excluirEquipamento(id);

    return CommonResponse.success(res, {
      mensagem: 'Equipamento excluído com sucesso.',
    });
  });
}

export default EquipamentoController;