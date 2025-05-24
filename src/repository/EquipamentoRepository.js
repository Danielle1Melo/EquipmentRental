import EquipamentoModel from '../models/Equipamento.js';

class EquipamentoRepository {
  constructor({
    equipamentoModel = EquipamentoModel
  } = {}) {
    this.model = equipamentoModel;
  }

  async criar(dadosEquipamentos) {
    const novoEquipamento = new this.model(dadosEquipamentos);
    return await novoEquipamento.save();
  }

  async buscarPorId(id) {
    const data = await this.model.findById(id);
    return data;
  }

  async atualizarPorId(id, dados) {
    const equipamento = await this.model.findByIdAndUpdate(id, dados, { new: true });

    return equipamento;
  }

async excluirPorId(id) {
  const equipamento = await this.model.findByIdAndDelete(id);
  return equipamento;
}

  async buscarComFiltros(query, pagina = 1, limite = 10) {
    const equipamentos = await this.model.find(query)
      .skip((pagina - 1) * limite)
      .limit(limite)
      .exec();

    const total = await this.model.countDocuments(query);
    return { equipamentos, total };
  }
}

export default EquipamentoRepository;