import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import UsuarioRepository from '../repository/UsuarioRepository.js';

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
        await this.ensureUserExists(id)
        console.log(id)
        console.log(parseData)
        await this.repository.buscarPorEmail(parseData.email, id)
        await this.repository.buscarPorTelefone(parseData.telefone, id)
        await this.repository.buscarPorCpf(parseData.cpf, id)
        await this.repository.updateUsuario(parseData, id)

        delete parseData.cpf
        delete parseData.dataNascimento

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
}
export default UsuarioService