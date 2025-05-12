import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import Usuario from './Usuario.js';

class Avaliacao {
    constructor(){
        const avaliacaoSchema = new mongoose.Schema({
            nota: {type:Number},
            descricao: {type: String},

            usuario: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'usuario'
            }
        })
        avaliacaoSchema.plugin(mongoosePaginate)
        this.model = mongoose.model('avaliacao', avaliacaoSchema)
    }
}

export default new Avaliacao().model;