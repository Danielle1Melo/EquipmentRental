import EquipamentoRepository from '../repositories/EquipamentoRepository.js';
import EquipamentoFilterBuilder from '../repositories/filters/EquipamentoFilterBuilder.js';
import { CustomError, HttpStatusCodes, messages } from '../utils/helpers/index.js';

class EquipamentoService {
  constructor() {
    this.repository = new EquipamentoRepository();
  }

  async listar(filtros) {
    const { query, pagina, limite } = this._processarFiltros(filtros);
    return await this.repository.listar(query, pagina, limite);
  }

  async listarPorId(id, usuarioId) {
    const equipamento = await this._buscarEquipamentoExistente(id);
    if (equipamento.equiStatus !== 'ativo' && equipamento.equiUsuario.toString() !== usuarioId) {
      throw new CustomError({
        statusCode: HttpStatusCodes.FORBIDDEN.code,
        customMessage: 'Equipamento não disponível para visualização.',
      });
    }
    return equipamento;
  }

  async listarPendentes() {
    return await this.repository.listarPendentes();
  }

  async criar(dados, usuarioId) {
    this._validarCamposObrigatorios(dados);
    if (!dados.equiFoto || !Array.isArray(dados.equiFoto) || dados.equiFoto.length === 0) {
      throw new CustomError({
        statusCode: HttpStatusCodes.BAD_REQUEST.code,
        customMessage: 'Pelo menos uma foto é obrigatória',
      });
    }
    return await this.repository.criar({
      ...dados,
      equiUsuario: usuarioId,
      equiAvaliacoes: [],
      equiNotaMediaAvaliacao: 0,
      equiStatus: 'pendente',
      equiMotivoReprovacaoPublicacao: null,
      dataAprovacaoPublicacao: null,
    });
  }

  async atualizar(id, dadosAtualizados) {
    const equipamento = await this._buscarEquipamentoExistente(id);
    this._verificarAtualizacaoPermitida(equipamento, dadosAtualizados);
    return await this.repository.atualizar(id, dadosAtualizados);
  }

  async aprovar(id) {
    const equipamento = await this._buscarEquipamentoExistente(id);
    if (equipamento.equiStatus === 'ativo') {
      throw new CustomError({
        statusCode: HttpStatusCodes.BAD_REQUEST.code,
        customMessage: 'Equipamento já está aprovado.',
      });
    }
    equipamento.equiStatus = 'aprovado';
    equipamento.dataAprovacaoPublicacao = new Date();
    equipamento.equiMotivoReprovacaoPublicacao = null;
    await equipamento.save();
    return equipamento;
  }

  async reprovar(id, motivoReprovacao) {
    const equipamento = await this._buscarEquipamentoExistente(id);
    if (equipamento.equiStatus === 'inativo') {
      throw new CustomError({
        statusCode: HttpStatusCodes.BAD_REQUEST.code,
        customMessage: 'Equipamento já está reprovado.',
      });
    }
    equipamento.equiStatus = 'inativo';
    equipamento.equiMotivoReprovacaoPublicacao = motivoReprovacao;
    equipamento.dataAprovacaoPublicacao = null;
    await equipamento.save();
    return equipamento;
  }

  async deletar(id) {
    const equipamento = await this._buscarEquipamentoExistente(id);
    const temLocacoesAtivas = false; 
    if (temLocacoesAtivas) {
      throw new CustomError({
        statusCode: HttpStatusCodes.CONFLICT.code,
        customMessage: 'Não é possível excluir equipamento com locações ativas.',
      });
    }
    return await this.repository.deletar(id);
  }

  _processarFiltros(filtros) {
    const pagina = parseInt(filtros.page) || 1;
    const limite = parseInt(filtros.limit) || 10;
    const builder = new EquipamentoFilterBuilder();

    const status = filtros.status
      ? filtros.status === 'true'
        ? 'ativo'
        : filtros.status === 'false'
        ? 'pendente'
        : filtros.status
      : 'ativo';

    builder
      .comCategoria(filtros.categoria)
      .comStatus(status)
      .comFaixaDeValor(filtros.minValor, filtros.maxValor);

    const query = builder.build();
    return { query, pagina, limite };
  }

  async _buscarEquipamentoExistente(id) {
    const equipamento = await this.repository.listarPorId(id);
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

    if (equipamento.equiStatus !== 'ativo') {
      if (
        camposAtualizados.length === 1 &&
        'equiStatus' in dadosAtualizados &&
        dadosAtualizados.equiStatus === 'ativo'
      ) {
        return;
      } else {
        throw new CustomError({
          statusCode: HttpStatusCodes.FORBIDDEN.code,
          customMessage: 'Equipamento não aprovado. Não é possível atualizar.',
        });
      }
    }

    const camposInvalidos = camposAtualizados.filter((campo) => !camposPermitidos.includes(campo));
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