import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import Usuario from './Usuario.js';
import { type } from 'os';

class Avaliacao {
    constructor(){
        const avaliacaoSchema = new mongoose.Schema({
            nota: {type:Number},
            descricao: {type: String},
            dataAvaliacao: {type: Date},

            usuario: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'usuario'
            }
        })
        avaliacaoSchema.plugin(mongoosePaginate)
        this.model = mongoose.model('avaliacoes', avaliacaoSchema)
    }
}

export default new Avaliacao().model;