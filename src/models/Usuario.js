import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Usuario {
    constructor(){
        const usuarioSchema = new mongoose.Schema({
            nome: {type: String, required:true},
            sobrenome: {type: String, required: true},
            email:{type:String, required:true},
            telefone:{type:String, required:true},
            senha:{type:String, require:true},
            dataNascimento:{type:Date, required: true},
            cpf:{type:String, required:true},
            notaMediaAvaliacao:{type:Number},
            status: {type: String, required: true},
            tipoUsuario:{type:String, required: true}
        })
        usuarioSchema.plugin(mongoosePaginate);
        this.model = mongoose.model('usuario', usuarioSchema);
    }
}
export default new Usuario().model