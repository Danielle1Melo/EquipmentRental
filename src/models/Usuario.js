import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Usuario {
    constructor(){
        const usuarioSchema = new mongoose.Schema({
            nome: {type: String, required:true},
            email:{type:String, required:true},
            telefone:{type:String, required:true},
            senha:{type:String, require:true},
            dataNascimento:{type:Date, required: true},
            CPF:{type:String, required:true},
            notaMedia:{type:Number}
        })
        usuarioSchema.plugin(mongoosePaginate);
        this.model = mongoose.model('usuario', usuarioSchema);
    }
}
export default new Usuario().model