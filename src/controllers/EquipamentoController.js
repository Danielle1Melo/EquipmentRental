// import EquipamentoService from "../services/EquipamentoService.js";
import { CommonResponse, CustomError, HttpStatusCodes} from "../utils/helpers/index.js";

import { equipamentoSchema, equipamentoUpdateSchema } from "../utils/validators/schemas/zod/EquipamentoSchema.js";
import { EquipamentoQuerySchema, EquipamentoIdSchema } from "../utils/validators/schemas/zod/querys/EquipamentoQuerySchema.js";

class EquipamentoController {
  constructor() {
    this.service = new EquipamentoService();
  }

  // POST 
  async criar(req, res) {
    try {
      const parsedData = equipamentoSchema.parse(req.body);
      const data = await this.service.criar(parsedData, req.usuario); 
      return CommonResponse.created(res, data, "Equipamento cadastrado. Aguardando aprovação.");
    } catch (error) {
      return CommonResponse.error(res, error);
    }
  }

  // GET 
  async listar(req, res) {
    try {
      const { id } = req.params;

      if (id) {
        EquipamentoIdSchema.parse(id);
        const equipamento = await this.service.obterPorId(id, req.usuario); 
        return CommonResponse.success(res, equipamento);
      }

      const query = req.query || {};
      if (Object.keys(query).length !== 0) {
        await EquipamentoQuerySchema.parseAsync(query);
      }

      const lista = await this.service.listar(req);
      return CommonResponse.success(res, lista);
    } catch (error) {
      return CommonResponse.error(res, error);
    }
  }

  // PATCH 
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      EquipamentoIdSchema.parse(id);
      const parsedData = equipamentoUpdateSchema.parse(req.body);

      const data = await this.service.atualizar(id, parsedData, req.usuario); 
      return CommonResponse.success(res, data, 200, "Equipamento atualizado.");
    } catch (error) {
      return CommonResponse.error(res, error);
    }
  }

  // DELETE 
  async deletar(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new CustomError({
          statusCode: HttpStatusCodes.BAD_REQUEST.code,
          errorType: "validationError",
          field: "id",
          details: [],
          customMessage: "ID do equipamento é obrigatório para deletar.",
        });
      }

      const data = await this.service.deletar(id, req.usuario);
      return CommonResponse.success(res, data, 200, "Equipamento inativado.");
    } catch (error) {
      return CommonResponse.error(res, error);
    }
  }
}

export default EquipamentoController;
