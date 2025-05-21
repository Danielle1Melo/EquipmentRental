import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';

class UsuarioService {
    constructor(){
        this.repository = new UsuarioRepository()
    }
    async listar(req){
        console.log("Estou no listar em Usuario")
        const data = await this.repository.listar(req)
        console.log("Estou retornando os dados em UsuarioService")
        return data
    }
    async updateUsuario(id, parseData){
        console.log("Estou no updateUsuario Service")
        const data = await this.repository.updateUsuario(id, parseData)
        return data
    }
    async ensureUserExists(id){
        const usuarioExistente = await this.repository.buscarPorId(id)
         if (!usuarioExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Usuário',
                details: [],
                customMessage: messages.error.resourceNotFound('Usuário'),
            });
        }
        return usuarioExistente;

    }
    async validateEmail(email, id = null){
        const usuarioExistente = await this.repository.buscarPorEmail(email)
    }
    async cadastrarUsuario(req){
        const data = await this.repository.cadastrarUsuario(req)
        return data
    }
}
export default UsuarioService