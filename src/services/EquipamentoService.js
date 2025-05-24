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

    if (filtrosQuery.categoria) query.equiCategoria = filtrosQuery.categoria;


    if (filtrosQuery.status !== undefined) {
      if (filtrosQuery.status === 'true') query.equiStatus = true;
      else if (filtrosQuery.status === 'false') query.equiStatus = false;
    } else {
      query.equiStatus = true;
    }

    if (filtrosQuery.minValor || filtrosQuery.maxValor) {
      query.equiValorDiaria = {};
      if (filtrosQuery.minValor) query.equiValorDiaria.$gte = Number(filtrosQuery.minValor);
      if (filtrosQuery.maxValor) query.equiValorDiaria.$lte = Number(filtrosQuery.maxValor);
    }

    return await this.repository.buscarComFiltros(query, pagina, limite);
  }

  async criarEquipamento(dados) {
    // usuario fixo para simular
    const usuario = { _id: "682520e98e38a049ac2ac569" };

    // id de avaliação para teste
    const avaliacaoIdTeste = "682520e98e38a049ac2ac570";

    return await this.repository.criar({
      ...dados,
      equiUsuario: usuario._id,
      equiNotaMediaAvaliacao: avaliacaoIdTeste,
      equiStatus: false, // equipamento fica inativo até a aprovação do ADM
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
      !equipamento.equiStatus &&
      equipamento.equiUsuario &&
      equipamento.equiUsuario.toString() !== usuarioId
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

    // verifica alterações criticas e retorna para a aprovação
    const alteracaoCritica =
      (dadosAtualizados.equiNome && dadosAtualizados.equiNome !== equipamento.equiNome) ||
      (dadosAtualizados.equiCategoria && dadosAtualizados.equiCategoria !== equipamento.equiCategoria);

    if (alteracaoCritica) {
      dadosAtualizados.equiStatus = false; // volta para aguardando aprovação
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
