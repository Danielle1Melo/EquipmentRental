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
        await this.repository.buscarPorCpf(parseData.cpf)
        await this.repository.buscarPorEmail(parseData.email)
        await this.repository.buscarPorTelefone(parseData.telefone)
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
    async cadastrarUsuario(body){
        await this.repository.buscarPorCpf(body.CPF)
        await this.repository.buscarPorEmail(body.email)
        await this.repository.buscarPorTelefone(body.telefone)
        const data = await this.repository.cadastrarUsuario(body)
        return data
    }
}
export default UsuarioService