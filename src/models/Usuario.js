import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Usuario {
    constructor(){
        const usuarioSchema = new mongoose.Schema({
            nome: {type: String, required:true},
            email:{type:String, required:true, unique:true},
            telefone:{type:String, required:true, unique:true},
            senha:{type:String, require:true},
            dataNascimento:{type:Date, required: true},
            cpf:{type:String, required:true, unique:true},
            notaMediaAvaliacao:{type:Number},
            status: {type: String, required: true},
            tipoUsuario:{type:String, required: true},
            fotoUsuario:{type:String}
        })
        usuarioSchema.plugin(mongoosePaginate);
        this.model = mongoose.model('usuarios', usuarioSchema);
    }
}

export default new Usuario().model
