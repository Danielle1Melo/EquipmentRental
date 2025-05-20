import Equipamento from '../models/Equipamento.js';
import { CustomError, HttpStatusCodes, messages } from '../utils/helpers/index.js';

class EquipamentoService {
  constructor() {
    // nada aqui
  }

  async criarEquipamento(dados, usuarioId) {
    const novoEquipamento = new Equipamento({
      ...dados,
      usuario: usuarioId,
      status: false, // inativo até aprovação
    });
    return await novoEquipamento.save();
  }

  async buscarEquipamentos(filtros) {
    const pagina = parseInt(filtros.page) || 1;
    const limite = parseInt(filtros.limit) || 10;

    // Remove page e limit para usar no filtro
    const filtrosQuery = { ...filtros };
    delete filtrosQuery.page;
    delete filtrosQuery.limit;

    // Construir query conforme filtrosQuery (exemplo simples)
    const query = {};

    if (filtrosQuery.categoria) query.categoria = filtrosQuery.categoria;
    if (filtrosQuery.status) {
      if (filtrosQuery.status === 'ativo') query.status = true;
      else if (filtrosQuery.status === 'inativo') query.status = false;
    }
    if (filtrosQuery.minValor || filtrosQuery.maxValor) {
      query.valorDiaria = {};
      if (filtrosQuery.minValor) query.valorDiaria.$gte = Number(filtrosQuery.minValor);
      if (filtrosQuery.maxValor) query.valorDiaria.$lte = Number(filtrosQuery.maxValor);
    }

    const equipamentos = await Equipamento.find(query)
      .skip((pagina - 1) * limite)
      .limit(limite)
      .exec();

    const total = await Equipamento.countDocuments(query);

    return {
      total,
      pagina,
      limite,
      equipamentos,
    };
  }

  async detalharEquipamento(id, usuarioId) {
    const equipamento = await Equipamento.findById(id).exec();

    if (!equipamento) {
      throw new CustomError({
        statusCode: HttpStatusCodes.NOT_FOUND.code,
        customMessage: messages.error.resourceNotFound('Equipamento'),
      });
    }

    if (!equipamento.status && equipamento.usuario.toString() !== usuarioId) {
      throw new CustomError({
        statusCode: HttpStatusCodes.FORBIDDEN.code,
        customMessage: 'Equipamento não disponível para visualização.',
      });
    }

    return equipamento;
  }

  async atualizarEquipamento(id, usuarioId, dadosAtualizados) {
    const equipamento = await Equipamento.findById(id).exec();

    if (!equipamento) {
      throw new CustomError({
        statusCode: HttpStatusCodes.NOT_FOUND.code,
        customMessage: messages.error.resourceNotFound('Equipamento'),
      });
    }

    if (equipamento.usuario.toString() !== usuarioId) {
      throw new CustomError({
        statusCode: HttpStatusCodes.FORBIDDEN.code,
        customMessage: 'Somente o locador pode atualizar o equipamento.',
      });
    }

    const camposCriticos = ['nome', 'descricao', 'valorDiaria', 'categoria'];
    const mudouCampoCritico = camposCriticos.some(
      (campo) => campo in dadosAtualizados && dadosAtualizados[campo] !== equipamento[campo]
    );

    if (mudouCampoCritico) {
      dadosAtualizados.status = false;
    }

    // Atualiza e retorna o novo documento
    const equipamentoAtualizado = await Equipamento.findByIdAndUpdate(id, dadosAtualizados, { new: true }).exec();

    return equipamentoAtualizado;
  }

  async inativarEquipamento(id, usuarioId) {
    const equipamento = await Equipamento.findById(id).exec();

    if (!equipamento) {
      throw new CustomError({
        statusCode: HttpStatusCodes.NOT_FOUND.code,
        customMessage: messages.error.resourceNotFound('Equipamento'),
      });
    }

    if (equipamento.usuario.toString() !== usuarioId) {
      throw new CustomError({
        statusCode: HttpStatusCodes.FORBIDDEN.code,
        customMessage: 'Somente o locador pode inativar o equipamento.',
      });
    }

    // TODO: implementar lógica para verificar locações ativas, se tiver
    // Por enquanto assume que não tem locações ativas
    const temLocacoesAtivas = false;

    if (temLocacoesAtivas) {
      throw new CustomError({
        statusCode: HttpStatusCodes.CONFLICT.code,
        customMessage: 'Não é possível inativar equipamento com locações ativas.',
      });
    }

    equipamento.status = false;
    await equipamento.save();

    return equipamento;
  }
}

export default EquipamentoService;
