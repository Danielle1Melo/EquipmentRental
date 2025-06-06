import UsuarioModel from "../models/Usuario.js"
// import AvaliacaoModel from "../models/Avaliacao.js"
import CustomError from "../utils/helpers/CustomError.js"
import messages from "../utils/helpers/messages.js"
import UsuarioFilterBuilder from "./filters/UsuarioFilterBuilder.js"
import bcrypt from 'bcrypt'

class UsuarioRepository {
    constructor({
        usuarioModel = UsuarioModel
    } = {}){
        this.model = usuarioModel
    }
    async listar(req) {
        // console.log("Estou no listar em UsuarioRepository")
        const id = req.params.id || null
        if(id){
            const data = await this.model.findById(id)
            return data
        }

        // TODO: Fazer opções de consulta com filtros
        const { nome, email, status, tipoUsuario, page = 1 } = req.query
        const limite = Math.min(parseInt(req.query.limite, 10) || 10, 100);
        const filterBuilder = new UsuarioFilterBuilder()
        .comNome(nome, '')
        .comEmail(email, '')
        .comStatus(status, '')
        .comTipoUsuario(tipoUsuario, '')
        
        let filtros = filterBuilder.build()
        const options = {
            page: parseInt(page),
            limit: parseInt(limite),
            sort: {nome: 1}
        }
        const data = await this.model.paginate(filtros, options)
        // console.log(data)
        return data

    }
    async updateUsuario(id, parseData){
        // console.log("Estou no updateUsuario em UsuarioRepository")
        
        
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
        // console.log("Estou no bucarPorId no UsuarioRepository")
        let query = this.model.findById(id)
        if(includeTokens){
            console.log(includeTokens)
            query.select('+refreshToken +accessToken')   
        }

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
    // console.log("Estou na buscarPorEmail Repository")
        const documento = await this.model.findOne({email:email, _id: {$ne: idIgnorado}})
        // console.log("Pesquisa conluida com sucesso")
        if(documento){
            throw new CustomError({
                statusCode: 409,
                errorType:"Conflict",
                details:[],
                customMessage: messages.error.resourceConflict("Usuário", "Email")

            })
        }
    }
    async buscarPorEmailCadastrado(email) {
        const documento = await this.model.findOne({email:email},'+senha')
        // console.log(documento.senha)
        return documento
    }
    async buscarPorTelefone(telefone, id = null){
        // console.log("Estou no buscarPorTelefone no UsuarioRepository")
        const documento = await this.model.findOne({telefone:telefone, _id:{$ne: id}}, '+senha')
        // console.log("Pesquisa conluida com sucesso")
        // console.log("Telefone encontrado:",documento)
        if(documento){
            throw new CustomError({
                statusCode: 409,
                errorType:"Conflict",
                details:[],
                customMessage: messages.error.resourceConflict("Usuário","Telefone")

            })
        }
    }
    async buscarPorCpf(cpf, id = null) {
        // console.log("Estou no buscarPorCpf no UsuarioRepository")
        const documento = await this.model.findOne({CPF:cpf, _id:{$ne: id}})
        // console.log(documento)
        if(documento){
            throw new CustomError({
                statusCode: 409,
                errorType:"Conflict",
                details:[],
                customMessage: messages.error.resourceConflict("Usuário", "CPF")

            })
        }
    }
    async cadastrarUsuario(req){
        req.body.senha = await bcrypt.hash(req.body.senha, 8)
        const data = await this.model.create(req.body)
        return data
    }
    async alterarStatus(id, parseData){
        console.log(parseData)
        const documento = await this.model.findByIdAndUpdate(id,{$set: parseData})
        return documento
    }
}
export default UsuarioRepository