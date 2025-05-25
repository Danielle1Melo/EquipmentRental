import mongoose from "mongoose";
import { equipamentoSchema, equipamentoUpdateSchema } from "../utils/validators/schemas/zod/EquipamentoSchema.js";
import { EquipamentoQuerySchema, EquipamentoIdSchema } from "../utils/validators/schemas/zod/querys/EquipamentoQuerySchema.js";
import EquipamentoService from "../services/EquipamentoService.js";
import { CommonResponse} from "../utils/helpers/index.js";

class EquipamentoController {
  constructor() {
    this.service = new EquipamentoService();
  }

    async listar(req, res) {
    const query = req.query || {};
    if (Object.keys(query).length !== 0) {
      await EquipamentoQuerySchema.parseAsync(query);
    }

    const data = await this.service.buscarEquipamentos(query);
    return CommonResponse.success(res, data);
  };

  async obterPorId (req, res) {
    const { id } = req.params;
    EquipamentoIdSchema.parse(id);

    const equipamento = await this.service.detalharEquipamento(id);
    return CommonResponse.success(res, equipamento);
  };

  async criar(req, res) {
    const dados = equipamentoSchema.parse(req.body);
    const equipamento = await this.service.criarEquipamento(dados);

    return CommonResponse.created(res, {
      mensagem: 'Equipamento cadastrado. Aguardando aprovação.',
      equipamento,
    });
  };

  async atualizar(req, res) {
    const { id } = req.params;
    EquipamentoIdSchema.parse(id);

    const dadosAtualizados = equipamentoUpdateSchema.parse(req.body);

    const equipamento = await this.service.atualizarEquipamento(id, dadosAtualizados);

    return CommonResponse.success(res, equipamento, 200, 'Equipamento atualizado com sucesso.');
  };

  async deletar(req, res) {
    const { id } = req.params;
    EquipamentoIdSchema.parse(id);

    await this.service.excluirEquipamento(id);

    return CommonResponse.success(res, {
      mensagem: 'Equipamento excluído com sucesso.',
    });
  };

}

export default EquipamentoController;
