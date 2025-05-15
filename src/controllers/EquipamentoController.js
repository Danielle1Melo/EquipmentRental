// controllers/EquipamentoController.js
import EquipamentoService from "../services/EquipamentoService.js";

export default class EquipamentoController {
  constructor() {
    this.equipamentoService = new EquipamentoService();
  }

  async criar(req, res) {
    const { nome, descricao, categoria, valorDiaria, valorSemanal, valorMensal, disponibilidade } = req.body;
    
    if (!nome || !descricao || !categoria || (!valorDiaria && !valorSemanal && !valorMensal) || disponibilidade === undefined) {
      return res.status(400).json({ mensagem: "Campos obrigatórios ausentes." });
    }

    const dados = {
      nome,
      descricao,
      categoria,
      valorDiaria,
      valorSemanal,
      valorMensal,
      disponibilidade,
      status: "pendente", 
      locadorId: req.user.id 
    };

    const equipamentoCriado = await this.equipamentoService.criar(dados);
    return res.status(201).json({
      mensagem: "Equipamento cadastrado. Aguardando aprovação.",
      equipamento: equipamentoCriado
    });
  }

  async listar(req, res) {
    const filtros = {
      categoria: req.query.categoria,
      status: req.query.status,
      valorMin: req.query.valorMin,
      valorMax: req.query.valorMax,
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };

    const resultado = await this.equipamentoService.listar(filtros);
    return res.status(200).json(resultado);
  }

  async obterPorId(req, res) {
    const id = req.params.id;
    const userId = req.user?.id;

    const equipamento = await this.equipamentoService.obterPorId(id);

    if (!equipamento) {
      return res.status(404).json({ mensagem: "Equipamento não encontrado." });
    }

    if (equipamento.status !== "ativo" && equipamento.locadorId !== userId) {
      return res.status(403).json({ mensagem: "Acesso negado ao equipamento." });
    }

    return res.status(200).json(equipamento);
  }

  async atualizar(req, res) {
    const id = req.params.id;
    const userId = req.user?.id;
    const dadosAtualizados = req.body;

    const equipamento = await this.equipamentoService.obterPorId(id);

    if (!equipamento) {
      return res.status(404).json({ mensagem: "Equipamento não encontrado." });
    }

    if (equipamento.locadorId !== userId) {
      return res.status(403).json({ mensagem: "Você não tem permissão para editar este equipamento." });
    }

    const camposCriticos = ['nome', 'descricao', 'categoria', 'valorDiaria', 'valorSemanal', 'valorMensal'];
    const alteracoesCriticas = camposCriticos.some(campo => campo in dadosAtualizados);

    if (alteracoesCriticas) {
      dadosAtualizados.status = 'pendente';
    }

    const equipamentoAtualizado = await this.equipamentoService.atualizar(id, dadosAtualizados);
    return res.status(200).json({
      mensagem: "Equipamento atualizado.",
      equipamento: equipamentoAtualizado
    });
  }

  async deletar(req, res) {
    const id = req.params.id;
    const userId = req.user?.id;

    const equipamento = await this.equipamentoService.obterPorId(id);

    if (!equipamento) {
      return res.status(404).json({ mensagem: "Equipamento não encontrado." });
    }

    if (equipamento.locadorId !== userId) {
      return res.status(403).json({ mensagem: "Você não tem permissão para inativar este equipamento." });
    }

    const possuiLocacoesAtivas = await this.equipamentoService.temLocacoesAtivas(id);
    if (possuiLocacoesAtivas) {
      return res.status(400).json({ mensagem: "Equipamento não pode ser inativado com locações ativas." });
    }

    await this.equipamentoService.inativar(id);
    return res.status(200).json({ mensagem: "Equipamento inativado." });
  }
}
