import EquipamentoRepository from '../repositories/EquipamentoRepository.js';
import EquipamentoFilterBuilder from '../repositories/filters/EquipamentoFilterBuilder.js';
import { CustomError, HttpStatusCodes, messages } from '../utils/helpers/index.js';
import Avaliacao from '../models/Avaliacao.js';

class EquipamentoService {
  constructor() {
    this.repository = new EquipamentoRepository();
  }

  async buscarEquipamentos(filtros) {
    const { query, pagina, limite } = await this._processarFiltros(filtros);
    return await this.repository.buscarComFiltros(query, pagina, limite);
  }

  async criarEquipamento(dados) {
    const usuario = { _id: "682520e98e38a049ac2ac569" };
    const avaliacaoIdTeste = "682520e98e38a049ac2ac570";

    this._validarCamposObrigatorios(dados);

    return await this.repository.criar({
      ...dados,
      equiUsuario: usuario._id,
      equiNotaMediaAvaliacao: avaliacaoIdTeste,
      equiStatus: false,
    });
  }

  async detalharEquipamento(id, usuarioId) {
    const equipamento = await this._buscarEquipamentoExistente(id);

    if (!equipamento.equiStatus && equipamento.equiUsuario.toString() !== usuarioId) {
      throw new CustomError({
        statusCode: HttpStatusCodes.FORBIDDEN.code,
        customMessage: 'Equipamento não disponível para visualização.',
      });
    }

    return equipamento;
  }

  async atualizarEquipamento(id, dadosAtualizados) {
    const equipamento = await this._buscarEquipamentoExistente(id);

    this._verificarAtualizacaoPermitida(equipamento, dadosAtualizados);

    const data = await this.repository.atualizarPorId(id, dadosAtualizados);
    return data;
  }

  async excluirEquipamento(id) {
    const equipamento = await this._buscarEquipamentoExistente(id);
    const temLocacoesAtivas = false;

    if (temLocacoesAtivas) {
      throw new CustomError({
        statusCode: HttpStatusCodes.CONFLICT.code,
        customMessage: 'Não é possível excluir equipamento com locações ativas.',
      });
    }

    return await this.repository.excluirPorId(id);
  }

  _processarFiltros(filtros) {
    const pagina = parseInt(filtros.page) || 1;
    const limite = parseInt(filtros.limit) || 10;

    const builder = new EquipamentoFilterBuilder();

    builder
      .comCategoria(filtros.categoria)
      .comStatus(status)
      .comFaixaDeValor(filtros.minValor, filtros.maxValor);

    const query = builder.build();
    return { query, pagina, limite };
  }

  async _buscarEquipamentoExistente(id) {
    const equipamento = await this.repository.buscarPorId(id);
    if (!equipamento) {
      throw new CustomError({
        statusCode: HttpStatusCodes.NOT_FOUND.code,
        customMessage: messages.error.resourceNotFound('Equipamento'),
      });
    }
    return equipamento;
  }

_processarFiltros(filtros) {
  const pagina = parseInt(filtros.page) || 1;
  const limite = parseInt(filtros.limit) || 10;

  const builder = new EquipamentoFilterBuilder();

  const status = (typeof filtros.status === 'boolean')
    ? filtros.status
    : (filtros.status === 'true' ? true : (filtros.status === 'false' ? false : true));

  builder
    .comCategoria(filtros.categoria)
    .comStatus(status)
    .comFaixaDeValor(filtros.minValor, filtros.maxValor);

  const query = builder.build();

  return { query, pagina, limite };
}

  async _buscarEquipamentoExistente(id) {
    const equipamento = await this.repository.buscarPorId(id);
    if (!equipamento) {
      throw new CustomError({
        statusCode: HttpStatusCodes.NOT_FOUND.code,
        customMessage: messages.error.resourceNotFound('Equipamento'),
      });
    }
    return equipamento;
  }

  _verificarAtualizacaoPermitida(equipamento, dadosAtualizados) {
    const camposPermitidos = ['equiValorDiaria', 'equiQuantidadeDisponivel', 'equiStatus'];
    const camposAtualizados = Object.keys(dadosAtualizados);

    if (!equipamento.equiStatus) {
      if (
        camposAtualizados.length === 1 &&
        'equiStatus' in dadosAtualizados &&
        dadosAtualizados.equiStatus === true
      ) {
        return;
      } else {
        throw new CustomError({
          statusCode: HttpStatusCodes.FORBIDDEN.code,
          customMessage: 'Equipamento inativo. Não é possível atualizar.',
        });
      }
    }

    const camposInvalidos = camposAtualizados.filter(campo => !camposPermitidos.includes(campo));
    if (camposInvalidos.length > 0) {
      throw new CustomError({
        statusCode: HttpStatusCodes.BAD_REQUEST.code,
        customMessage: `Não é permitido alterar os seguintes campos: ${camposInvalidos.join(', ')}`,
      });
    }
  }

  _validarCamposObrigatorios(dados) {
    if (!dados.equiNome || !dados.equiCategoria) {
      throw new CustomError({
        statusCode: HttpStatusCodes.BAD_REQUEST.code,
        customMessage: 'Campos obrigatórios não preenchidos.',
      });
    }
  }

}

export default EquipamentoService;
