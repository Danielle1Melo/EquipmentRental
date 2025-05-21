import { populate } from "dotenv"
import UsuarioModel from "../models/Usuario.js"
import AvaliacaoModel from "../models/Avaliacao.js"
import CustomError from "../utils/helpers/CustomError.js"
import messages from "../utils/helpers/messages.js"
import UsuarioFilterBuilder from "./filters/UsuarioFilterBuilder.js"

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
            return data
        }

        // TODO: Fazer opções de consulta com filtros
        const { nome, email, status, tipoUsuario } = req.query
        const filterBuilder = new UsuarioFilterBuilder()
        .comNome(nome, '')
        .comEmail(email, '')
        .comStatus(status, '')
        .comTipoUsuario(tipoUsuario, '')
        
        let filtros = filterBuilder.build()
        const data = await this.model.find(filtros)
        console.log(data)
        return data

    }
    async updateUsuario(id, parseData){
        console.log("Estou no updateUsuario em UsuarioRepository")
        
        
        const usuarioAtualizado = await this.model.findByIdAndUpdate(id, {$set: parseData}, {new: true})
        if(!usuarioAtualizado){
            throw new CustomError({
                statusCode:404,
                errorType:"resourceNotFound",
                field:"Usuário",
                details:[],
                customMessage: messages.error.resourceNotFound("Usuário")
            })
        }
        return usuarioAtualizado

    }
    async buscarPorId(id, includeTokens = false){
        console.log("Estou no bucarPorId no UsuarioRepository")
        let query = this.model.findById(id)

        const user = await query
        if(!user){
            throw new CustomError({
                statusCode:404,
                errorType:"resourceNotFound",
                field:"Usuário",
                details:[],
                customMessage: messages.error.resourceNotFound("Usuário")
            })
        }
        return user
    }
    async buscarPorEmail(email, idIgnorado = null){
    console.log("Estou na buscarPorEmail Repository")
        const documento = await this.model.findOne({email:email, _id: {$ne: idIgnorado}})
        console.log("Pesquisa conluida com sucesso")
        if(documento){
            throw new CustomError({
                statusCode: 409,
                errorType:"Conflict",
                details:[],
                customMessage: messages.error.resourceConflict("Usuário")

            })
        }
    }
    async buscarPorTelefone(telefone, id = null){
        console.log("Estou no buscarPorTelefone no UsuarioRepository")
        const documento = await this.model.findOne({telefone:telefone, _id:{$ne: id}})
        console.log("Pesquisa conluida com sucesso")
        console.log("Telefone encontrado:",documento)
        if(documento){
            throw new CustomError({
                statusCode: 409,
                errorType:"Conflict",
                details:[],
                customMessage: messages.error.resourceConflict("Usuário")

            })
        }
    }
    async buscarPorCpf(cpf, id = null) {
        // console.log("Estou no buscarPorCpf no UsuarioRepository")
        const documento = await this.model.findOne({cpf:cpf, _id:{$ne: id}})
        console.log(documento)
        if(documento){
            throw new CustomError({
                statusCode: 409,
                errorType:"Conflict",
                details:[],
                customMessage: messages.error.resourceConflict("Usuário")

            })
        }
    }
}
export default UsuarioRepository