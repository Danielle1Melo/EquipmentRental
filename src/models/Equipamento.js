import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Equipamento {
  constructor() {
    const equipamentoSchema = new mongoose.Schema({
      equiNome: { type: String, required: true },
      equiDescricao: { type: String, required: true },
      equiValorDiaria: { type: Number, required: true },
      equiCategoria: { type: String, required: true },
      equiFoto: {
        type: [String],
        required: true,
        validate: {
          validator: (arr) => Array.isArray(arr) && arr.length > 0,
          message: 'O equipamento deve ter pelo menos uma foto',
        },
      },
      equiQuantidadeDisponivel: { type: Number, required: true },
      equiStatus: { 
        type: String, 
        enum: ['pendente', 'aprovado', 'reprovado'], 
        default: 'pendente' 
      },
      equiUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
      },
      equiNotaMediaAvaliacao: {
        type: Number,
        default: 0,
      },
      equiAvaliacoes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'avaliacoes',
      }],
      equiMotivoReprovacaoPublicacao: { type: String, default: null },
      equiDataAprovacaoPublicacao: { type: Date, default: null },
    }, {
      timestamps: true,
      versionKey: false,
    });

    equipamentoSchema.plugin(mongoosePaginate);
    this.model = mongoose.model('equipamentos', equipamentoSchema);
  }
}

export default new Equipamento().model;