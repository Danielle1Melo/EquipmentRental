import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Endereco {
  constructor() {
    const enderecoSchema = new mongoose.Schema({
      endeLogradouro: { type: String, required: true },
      endeNumero: { type: Number, required: true },
      endeBairro: { type: String, required: true },
      endeUf: { type: String, required: true },
      endeCep: { type: String, required: true },
      endeCidade: { type: String, required: true },
      endeComplemento: { type: String },
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
      }
    }, {
      timestamps: true,
      versionKey: false
    });

    enderecoSchema.plugin(mongoosePaginate);
    this.model = mongoose.model('enderecos', enderecoSchema);
  }
}

export default new Endereco().model;
