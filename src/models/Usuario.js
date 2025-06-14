import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Usuario {
    constructor(){
        const usuarioSchema = new mongoose.Schema({
            nome: {type: String, required:true},
            email:{type:String, required:true, unique:true},
            telefone:{type:String, required:true, unique:true},
            senha:{type:String, required:true, select:false},
            dataNascimento:{type:Date, required: true},
            CPF:{type:String, required:true, unique:true},
            notaMediaAvaliacao:{type:Number},
            status: {type: String, required: true},
            tipoUsuario:{type:String, required: true},
            fotoUsuario:{type:String},
            accessToken:{type:String, required: false, select:false},
            refreshToken:{type:String, required: false, select:false}
        })
        usuarioSchema.plugin(mongoosePaginate);
        this.model = mongoose.model('usuarios', usuarioSchema);
    }
}

export default new Usuario().model
