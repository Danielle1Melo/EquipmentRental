import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
import UsuarioService from '../services/UsuarioService.js';
import { UsuarioIdSchema, UsuarioQuerySchema } from '../utils/validators/schemas/zod/querys/UsuarioQuerySchema.js';
import { UsuarioSchema, UsuarioUpdateSchema } from '../utils/validators/schemas/zod/UsuarioSchema.js';

class UsuarioController {
    constructor(){
        this.service = new UsuarioService()
    }
    async listar(req, res){
        console.log("Estou no listar Controller")

        const { id } = req.params|| {}
    
        if(id) {
            console.log("Um id foi passado como parametro")
            UsuarioIdSchema.parse(id)
        }

        const query = req.query || {}

        if(Object.keys(query).length !== 0){
            console.log("Um array de objetos foi passado")
            UsuarioQuerySchema.parseAsync(query)
        }
        const data = await this.service.listar(req)
        return CommonResponse.success(res, data)
    }
    async updateUsuario(req, res){
        console.log("Estou no updateUsuario Controller")

        const {id} = req.params || {}
        
        UsuarioIdSchema.parse(id)
        const parseData = await UsuarioUpdateSchema.parseAsync(req.body)
        console.log("BODY:", parseData)
        const data = await this.service.updateUsuario(id, parseData)
        return CommonResponse.success(res, data)
    }
    async cadastrarUsuario(req, res){
        console.log("Estou no cadastrarUsuario")
        const parseDate = await UsuarioSchema(req.body)
        const data = await this.service.cadastrarUsuario(req.body)
        return data
    }
}

export default UsuarioController;