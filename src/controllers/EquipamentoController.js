import mongoose from "mongoose";
import { equipamentoSchema, equipamentoUpdateSchema } from "../utils/validators/schemas/zod/EquipamentoSchema.js";
import { EquipamentoQuerySchema, EquipamentoIdSchema } from "../utils/validators/schemas/zod/querys/EquipamentoQuerySchema.js";
import EquipamentoService from "../services/EquipamentoService.js";
import { CommonResponse } from "../utils/helpers/index.js";

class EquipamentoController {
  constructor() {
    this.service = new EquipamentoService();
  }

  async listar(req, res) {
    const filtros = EquipamentoQuerySchema.parse(req.query);
    const resultado = await this.service.buscarEquipamentos(filtros);
    return CommonResponse.success(res, resultado);
  }

  async obterPorId(req, res) {
    const id = EquipamentoIdSchema.parse(req.params.id);

    const usuarioId = req.user?.id || "64f50c786bfa9c0012345678";

    const equipamento = await this.service.detalharEquipamento(id, usuarioId);
    return CommonResponse.success(res, equipamento);
  }

  async criar(req, res) {
    const dados = equipamentoSchema.parse(req.body);

    const usuarioId = req.user?.id || "64f50c786bfa9c0012345678";

    const equipamento = await this.service.criarEquipamento(dados, usuarioId);
    return CommonResponse.created(res, {
      mensagem: "Equipamento cadastrado. Aguardando aprovação.",
      equipamento,
    });
  }

  async atualizar(req, res) {
    const id = EquipamentoIdSchema.parse(req.params.id);
    const dadosAtualizados = equipamentoUpdateSchema.parse(req.body);

    const usuarioId = req.user?.id || "64f50c786bfa9c0012345678";

    const equipamento = await this.service.atualizarEquipamento(id, usuarioId, dadosAtualizados);
    return CommonResponse.success(res, {
      mensagem: "Equipamento atualizado.",
      equipamento,
    });
  }

  async deletar(req, res) {
    const id = EquipamentoIdSchema.parse(req.params.id);

    const usuarioId = req.user?.id || "64f50c786bfa9c0012345678";

    await this.service.inativarEquipamento(id, usuarioId);
    return CommonResponse.success(res, { mensagem: "Equipamento inativado." });
  }
}

export default EquipamentoController;

