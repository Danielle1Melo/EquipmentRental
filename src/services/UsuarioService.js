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
}
export default UsuarioService