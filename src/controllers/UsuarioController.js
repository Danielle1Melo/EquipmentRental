import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import UsuarioService from '../services/UsuarioService.js';

class UsuarioController {
    constructor(){
        this.service = new UsuarioService()
    }
    async listar(req, res){
        console.log("Estou no listar Controller")

        const { id } = req.params || {}
        if(id) {
            console.log("Um id foi passado")
        }

        const query = req.query || {}

        if(Object.keys(query).length !== 0){
            console.log("Um array de objetos foi passado")
        }
        const data = await this.service.listar(req)
        return CommonResponse.success(res, data)
    }
}

export default UsuarioController;