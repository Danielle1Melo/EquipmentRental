import Equipamento from '../models/Equipamento.js';

class EquipamentoRepository {
  async criar(dados) {
    const novoEquipamento = new Equipamento(dados);
    return await novoEquipamento.save();
  }

  async buscarPorId(id) {
    return await Equipamento.findById(id).exec();
  }

  async atualizarPorId(id, dados) {
    return await Equipamento.findByIdAndUpdate(id, dados, { new: true }).exec();
  }

  async inativarPorId(id) {
    return await Equipamento.findByIdAndUpdate(id, { status: false }, { new: true }).exec();
  }

  async buscarComFiltros(query, pagina = 1, limite = 10) {
    const equipamentos = await Equipamento.find(query)
      .skip((pagina - 1) * limite)
      .limit(limite)
      .exec();

    const total = await Equipamento.countDocuments(query);
    return { equipamentos, total };
  }
}

export default EquipamentoRepository;
