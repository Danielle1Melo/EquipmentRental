import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

class Equipamento {
  constructor() {
    const equipamentoSchema = new mongoose.Schema({
      nome: { type: String, required: true },
      descricao: { type: String, required: true },
      valorDiaria: { type: Number, required: true },
      categoria: { type: String, required: true },
      foto: { type: String, required: false },
      quantidadeDisponivel: { type: Number, required: true },
      status: { type: Boolean, default: false },
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
      },
      notaMediaAvaliacao: { type: mongoose.Schema.Types.ObjectId, ref: 'avaliacao', required: false }
    }, {
      timestamps: true,
      versionKey: false
    });

    equipamentoSchema.plugin(mongoosePaginate);
    this.model = mongoose.model('equipamentos', equipamentoSchema);
  }
}

export default new Equipamento().model;
