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
      populate: [
        {
          path: 'equiAvaliacoes',
          populate: {
            path: 'usuario',
            select: 'nome',
          },
        },
        {
          path: 'equiUsuario',
          select: 'nome',
        },
      ],
    };
    return await this.model.paginate(query, options);
  }

  async listarPorId(id) {
    return await this.model
      .findById(id)
      .populate({
        path: 'equiAvaliacoes',
        populate: {
          path: 'usuario',
          select: 'nome',
        },
      })
      .populate({
        path: 'equiUsuario',
        select: 'nome',
      });
  }

  async listarPendentes() {
    return await this.model
      .find({ equiStatus: 'pendente' })
      .populate({
        path: 'equiUsuario',
        select: 'nome',
      })
      .sort({ createdAt: -1 });
  }

  async criar(dadosEquipamentos) {
    const novoEquipamento = new this.model(dadosEquipamentos);
    return await novoEquipamento.save();
  }

  async atualizar(id, dados) {
    return await this.model.findByIdAndUpdate(id, dados, { new: true });
  }
}

export default EquipamentoRepository;