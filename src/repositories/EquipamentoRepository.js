import EquipamentoModel from '../models/Equipamento.js';

class EquipamentoRepository {
  constructor({ equipamentoModel = EquipamentoModel } = {}) {
    this.model = equipamentoModel;
  }

  async listar(query, pagina, limite) {
    return await this.model.find(query)
      .skip((pagina - 1) * limite)
      .limit(limite);
  }

  async listarPorId(id) {
    return await this.model.findById(id);
  }

  async criar(dadosEquipamentos) {
    const novoEquipamento = new this.model(dadosEquipamentos);
    return await novoEquipamento.save();
  }

  async atualizar(id, dados) {
    return await this.model.findByIdAndUpdate(id, dados, { new: true });
  }

  async deletar(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

export default EquipamentoRepository;
