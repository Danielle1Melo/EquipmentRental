import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

class Equipamento {
  constructor() {
    const equipamentoSchema = new mongoose.Schema({
      equiNome: { type: String, required: true },
      equiDescricao: { type: String, required: true },
      equiValorDiaria: { type: Number, required: true },
      equiCategoria: { type: String, required: true },
      equiFoto: { type: String, required: false },
      equiQuantidadeDisponivel: { type: Number, required: true },
      equiStatus: { type: Boolean, default: false },
      equiUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
      },
      equiNotaMediaAvaliacao: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'avaliacao', 
        required: false 
      },
       equiEndereco: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'endereco',
        required: false
      }
    }, {
      timestamps: true,
      versionKey: false
    });

    equipamentoSchema.plugin(mongoosePaginate);
    this.model = mongoose.model('equipamentos', equipamentoSchema);
  }
}

export default new Equipamento().model;
