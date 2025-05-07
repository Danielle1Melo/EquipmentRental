import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import Usuario from './Usuario.js';

class Avalicao {
    constructor(){
        const avaliacaoSchema = new mongoose.Schema({
            avalDescricao: {type: String},
            avalNota: {type:Number},
            usuarioId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'usuario'
            }
        })
        avaliacaoSchema.plugin(mongoosePaginate)
        this.model = mongoose.model('avaliacao', avaliacaoSchema)
    }
}

export default new Avalicao().model;