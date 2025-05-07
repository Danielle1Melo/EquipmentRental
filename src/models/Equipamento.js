import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

class Equipamento {
  constructor() {
    const equipamentoSchema = new mongoose.Schema({
      nome: { type: String, required: true },
      descricao: { type: String, required: true },
      valor: { type: Number, required: true },
      categoria: { type: String, required: true },
      foto: { type: String, required: false },
      quantidade: { type: Number, required: true },
      notaMedia: { type: Number, default: 0 },
      aprovado: { type: Boolean, default: false },
      fkUsuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario', required: true },
      avaliacaoPkAvalId: { type: mongoose.Schema.Types.ObjectId, ref: 'avaliacao', required: false }
    }, {
      timestamps: true,
      versionKey: false
    });

    equipamentoSchema.plugin(mongoosePaginate);
    this.model = mongoose.model('equipamento', equipamentoSchema);
  }
}

export default new Equipamento().model;
