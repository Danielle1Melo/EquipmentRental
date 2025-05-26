import EquipamentoModel from '../models/Equipamento.js';

class EquipamentoRepository {
  constructor({ equipamentoModel = EquipamentoModel } = {}) {
    this.model = equipamentoModel;
  }

  async listar(query, pagina, limite) {
    const options = {
      page: pagina,
      limit: limite,
      sort: { equiNome: 1 },
    };

    return await this.model.paginate(query, options);
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
