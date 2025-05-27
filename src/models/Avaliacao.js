import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'


class Avaliacao {
  constructor() {
    const avaliacaoSchema = new mongoose.Schema({
      nota: { type: Number, required: true },
      descricao: { type: String, required: true },
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
      },
      equipamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'equipamentos',
        required: true
      }
    }, {
      timestamps: true,
      versionKey: false
    })

    avaliacaoSchema.plugin(mongoosePaginate)
    this.model = mongoose.model('avaliacoes', avaliacaoSchema)
  }
}


export default new Avaliacao().model;


