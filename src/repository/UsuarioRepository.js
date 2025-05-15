import UsuarioModel from "../models/Usuario.js"

class UsuarioRepository {
    constructor({
        usuarioModel = UsuarioModel
    } = {}){
        this.model = usuarioModel
    }
    async listar(req) {
        console.log("Estou no listar em UsuarioRepository")
        const id = req.params.id || null
        if(id){
            const data = await this.model.findById(id)
            // TODO: Colocar os populates depois
        }

        const data = await this.model.find()
        return data

    }
}

export default UsuarioRepository