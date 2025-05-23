import EquipamentoRepository from '../repositories/EquipamentoRepository.js';
import { CustomError, HttpStatusCodes, messages } from '../utils/helpers/index.js';
import Avaliacao from '../models/Avaliacao.js';

class EquipamentoService {
  constructor() {
    this.repository = new EquipamentoRepository();
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

  
  async criarEquipamento(dados) {

    // usuario fixo para simular
    const usuario = { _id: "682520e98e38a049ac2ac569" };

    //id de avaliação para teste
    const avaliacaoIdTeste = "682520e98e38a049ac2ac570";

    const statusAleatorio = Math.random() < 0.5;


    return await this.repository.criar({
      ...dados,
      usuario,
      avaliacao: avaliacaoIdTeste,
      status: statusAleatorio,
    });
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

  async atualizarEquipamento(id, dadosAtualizados) {
    const equipamento = await this.repository.buscarPorId(id);


    if (!equipamento) {
      throw new CustomError({
        statusCode: HttpStatusCodes.FORBIDDEN.code,
        customMessage: messages.error.resourceNotFound('Equipamento'),
      });
    }

    const data = await this.repository.atualizarPorId(id, dadosAtualizados);
    return data;
  }

  async excluirEquipamento(id) {
    const equipamento = await this.repository.buscarPorId(id);

    if (!equipamento) {
      throw new CustomError({
        statusCode: HttpStatusCodes.NOT_FOUND.code,
        customMessage: messages.error.resourceNotFound('Equipamento'),
      });
    }

    const temLocacoesAtivas = false;

    if (temLocacoesAtivas) {
      throw new CustomError({
        statusCode: HttpStatusCodes.CONFLICT.code,
        customMessage: 'Não é possível excluir equipamento com locações ativas.',
      });
    }

    return await this.repository.excluirPorId(id);
  }
}

export default EquipamentoService;
