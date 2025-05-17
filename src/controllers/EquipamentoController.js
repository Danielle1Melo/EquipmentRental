import { CommonResponse, CustomError, HttpStatusCodes } from "../utils/helpers/index.js";
import { equipamentoSchema, equipamentoUpdateSchema } from "../utils/validators/schemas/zod/EquipamentoSchema.js";
import { EquipamentoQuerySchema, EquipamentoIdSchema } from "../utils/validators/schemas/zod/querys/EquipamentoQuerySchema.js";

class EquipamentoController {
  constructor() {
    this.equipamentos = [
      {
        id: "1",
        nome: "Furadeira",
        descricao: "Furadeira potente",
        categoria: "Ferramentas",
        valorDiaria: 30,
        valorSemanal: 180,
        valorMensal: 600,
        disponibilidade: true,
        status: "ativo",
        proprietarioId: "user1"
      },
      {
        id: "2",
        nome: "Serra Elétrica",
        descricao: "Serra para cortes rápidos",
        categoria: "Ferramentas",
        valorDiaria: 40,
        valorSemanal: 220,
        valorMensal: 750,
        disponibilidade: true,
        status: "inativo",
        proprietarioId: "user2"
      },
    ];
  }

  // // POST /equipamentos
  // async criar(req, res) {
  //   try {
  //     const data = equipamentoSchema.parse(req.body);

  //     const novoEquipamento = {
  //       id: (this.equipamentos.length + 1).toString(),
  //       ...data,
  //       status: "inativo", 
  //       proprietarioId: req.usuario?.id || "userSimulado",
  //     };

  //     this.equipamentos.push(novoEquipamento);

  //     return CommonResponse.created(res, novoEquipamento, "Equipamento cadastrado. Aguardando aprovação.");
  //   } catch (error) {
  //     return CommonResponse.error(res, error);
  //   }
  // }

  // GET /equipamentos
  async listar(req, res) {
    try {
      await EquipamentoQuerySchema.parseAsync(req.query);

      let { categoria, status, valorMin, valorMax, pagina = 1, limite = 10 } = req.query;
      pagina = Number(pagina);
      limite = Number(limite);

      let resultados = [...this.equipamentos];

      if (categoria) {
        resultados = resultados.filter(eq => eq.categoria === categoria);
      }
      if (status) {
        resultados = resultados.filter(eq => eq.status === status);
      }
      if (valorMin) {
        resultados = resultados.filter(eq => eq.valorDiaria >= Number(valorMin));
      }
      if (valorMax) {
        resultados = resultados.filter(eq => eq.valorDiaria <= Number(valorMax));
      }

      const total = resultados.length;
      const totalPaginas = Math.ceil(total / limite);
      resultados = resultados.slice((pagina - 1) * limite, pagina * limite);

      const metadados = {
        pagina,
        limite,
        total,
        totalPaginas,
      };

      return CommonResponse.success(res, { equipamentos: resultados, metadados });
    } catch (error) {
      return CommonResponse.error(res, error);
    }
  }

//   // GET /equipamentos/:id
// async obterPorId(req, res) {
//   try {
//     const { id } = req.params;
//     EquipamentoIdSchema.parse(id);

//     const equipamento = this.equipamentos.find(eq => eq.id === id);
//     if (!equipamento) {
//       return CommonResponse.error(res, {
//         statusCode: HttpStatusCodes.NOT_FOUND.code,
//         message: "Equipamento não encontrado.",
//         details: null,
//       });
//     }

//     const usuarioId = req.usuario?.id || "userSimulado";

//     if (equipamento.status !== "ativo" && equipamento.proprietarioId !== usuarioId) {
//       return CommonResponse.error(res, {
//         statusCode: HttpStatusCodes.FORBIDDEN.code,
//         message: "Equipamento não disponível.",
//         details: null,
//       });
//     }

//     return CommonResponse.success(res, equipamento);
//   } catch (error) {
//     if (error.name === "ZodError") {
//       return CommonResponse.error(res, {
//         statusCode: HttpStatusCodes.BAD_REQUEST.code,
//         message: "ID inválido.",
//         details: error.errors,
//       });
//     }
//     return CommonResponse.error(res, {
//       statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
//       message: error.message || "Erro interno",
//       details: null,
//     });
//   }
// }

//   // PATCH /equipamentos/:id
//   async atualizar(req, res) {
//     try {
//       const { id } = req.params;
//       EquipamentoIdSchema.parse(id);
//       const dadosAtualizados = equipamentoUpdateSchema.parse(req.body);

//       const index = this.equipamentos.findIndex(eq => eq.id === id);
//       if (index === -1) {
//         return CommonResponse.error(res, new CustomError({
//           statusCode: HttpStatusCodes.NOT_FOUND.code,
//           errorType: "notFound",
//           customMessage: "Equipamento não encontrado."
//         }));
//       }

//       const usuarioId = req.usuario?.id || "userSimulado";
//       if (this.equipamentos[index].proprietarioId !== usuarioId) {
//         return CommonResponse.error(res, new CustomError({
//           statusCode: HttpStatusCodes.FORBIDDEN.code,
//           errorType: "forbidden",
//           customMessage: "Você não tem permissão para editar este equipamento."
//         }));
//       }

//       this.equipamentos[index] = {
//         ...this.equipamentos[index],
//         ...dadosAtualizados,
//         status: "inativo" 
//       };

//       return CommonResponse.success(res, this.equipamentos[index], 200, "Equipamento atualizado. Aguardando aprovação.");
//     } catch (error) {
//       return CommonResponse.error(res, error);
//     }
//   }

//   // DELETE /equipamentos/:id
//   async deletar(req, res) {
//     try {
//       const { id } = req.params;
//       EquipamentoIdSchema.parse(id);

//       const index = this.equipamentos.findIndex(eq => eq.id === id);
//       if (index === -1) {
//         return CommonResponse.error(res, new CustomError({
//           statusCode: HttpStatusCodes.NOT_FOUND.code,
//           errorType: "notFound",
//           customMessage: "Equipamento não encontrado."
//         }));
//       }
//       const temLocacoesAtivas = false;
//       if (temLocacoesAtivas) {
//         return CommonResponse.error(res, new CustomError({
//           statusCode: HttpStatusCodes.BAD_REQUEST.code,
//           errorType: "businessRule",
//           customMessage: "Equipamento com locações ativas não pode ser inativado."
//         }));
//       }

//       this.equipamentos[index].status = "inativo";

//       return CommonResponse.success(res, this.equipamentos[index], 200, "Equipamento inativado.");
//     } catch (error) {
//       return CommonResponse.error(res, error);
//     }
//   }
}

export default EquipamentoController;
