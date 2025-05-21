import EquipamentoRepository from '../repositories/EquipamentoRepository.js';
import { CustomError, HttpStatusCodes, messages } from '../utils/helpers/index.js';

class EquipamentoService {
  constructor() {
    this.repository = new EquipamentoRepository();
  }

  async criarEquipamento(dados, usuarioId) {
    return await this.repository.criar({
      ...dados,
      usuario: usuarioId,
      status: false,
    });
  }

  async buscarEquipamentos(filtros) {
    const pagina = parseInt(filtros.page) || 1;
    const limite = parseInt(filtros.limit) || 10;

    const filtrosQuery = { ...filtros };
    delete filtrosQuery.page;
    delete filtrosQuery.limit;

    const query = {};

    if (filtrosQuery.categoria) query.categoria = filtrosQuery.categoria;
    if (filtrosQuery.status) {
      query.status = filtrosQuery.status === 'ativo';
    }
    if (filtrosQuery.minValor || filtrosQuery.maxValor) {
      query.valorDiaria = {};
      if (filtrosQuery.minValor) query.valorDiaria.$gte = Number(filtrosQuery.minValor);
      if (filtrosQuery.maxValor) query.valorDiaria.$lte = Number(filtrosQuery.maxValor);
    }

    return await this.repository.buscarComFiltros(query, pagina, limite);
  }

  async detalharEquipamento(id, usuarioId) {
    const equipamento = await this.repository.buscarPorId(id);

    if (!equipamento) {
      throw new CustomError({
        statusCode: HttpStatusCodes.NOT_FOUND.code,
        customMessage: messages.error.resourceNotFound('Equipamento'),
      });
    }

    if (
      !equipamento.status &&
      equipamento.usuario &&
      equipamento.usuario.toString() !== usuarioId
    ) {
      throw new CustomError({
        statusCode: HttpStatusCodes.FORBIDDEN.code,
        customMessage: 'Equipamento não disponível para visualização.',
      });
    }
    

    return equipamento;
  }

  async atualizarEquipamento(id, usuarioId, dadosAtualizados) {
    const equipamento = await this.repository.buscarPorId(id);

    if (!equipamento) {
      throw new CustomError({
        statusCode: HttpStatusCodes.NOT_FOUND.code,
        customMessage: messages.error.resourceNotFound('Equipamento'),
      });
    }

    // if (!equipamento.usuario || equipamento.usuario.toString() !== usuarioId) {
    //   throw new CustomError({
    //     statusCode: HttpStatusCodes.FORBIDDEN.code,
    //     customMessage: 'Somente o locador pode atualizar o equipamento.',
    //   });
    // }    

    const camposCriticos = ['nome', 'descricao', 'valorDiaria', 'categoria'];
    const mudouCampoCritico = camposCriticos.some(
      (campo) => campo in dadosAtualizados && dadosAtualizados[campo] !== equipamento[campo]
    );

    if (mudouCampoCritico) {
      dadosAtualizados.status = false;
    }

    return await this.repository.atualizarPorId(id, dadosAtualizados);
  }

  async inativarEquipamento(id, usuarioId) {
    const equipamento = await this.repository.buscarPorId(id);

    if (!equipamento) {
      throw new CustomError({
        statusCode: HttpStatusCodes.NOT_FOUND.code,
        customMessage: messages.error.resourceNotFound('Equipamento'),
      });
    }

    // if (!equipamento.usuario || equipamento.usuario.toString() !== usuarioId) {
    //   throw new CustomError({
    //     statusCode: HttpStatusCodes.FORBIDDEN.code,
    //     customMessage: 'Somente o locador pode inativar o equipamento.',
    //   });
    // }
    
    const temLocacoesAtivas = false;

    if (temLocacoesAtivas) {
      throw new CustomError({
        statusCode: HttpStatusCodes.CONFLICT.code,
        customMessage: 'Não é possível inativar equipamento com locações ativas.',
      });
    }

    return await this.repository.inativarPorId(id);
  }
}

export default EquipamentoService;
