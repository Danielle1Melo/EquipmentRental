import { beforeAll, beforeEach, describe, expect, jest } from "@jest/globals";
import UsuarioController from "../../controllers/UsuarioController.js";
import UsuarioService from "../../services/UsuarioService.js";
import { CommonResponse, messages } from "../../utils/helpers/index.js";
import { UsuarioIdSchema, UsuarioQuerySchema } from "../../utils/validators/schemas/zod/querys/UsuarioQuerySchema.js";
import { UsuarioSchema } from "../../utils/validators/schemas/zod/UsuarioSchema.js";
import { UsuarioUpdateSchema } from "../../utils/validators/schemas/zod/UsuarioSchema.js";
import { error, query } from "winston";

jest.mock("../../services/UsuarioService.js")

describe('UsuarioController', () => {
    let req, res, usuarioController;

    beforeEach(() =>{
        req = {params: {}, body: {}, query: {}}
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        UsuarioService.mockClear();
        usuarioController = new UsuarioController()
    });

    it('deve listar todos os usuarios', async() => {
        const mockData = [{
            id: '67959501ea0999e0a0fa9f58',
            nome: 'Usuario'
        }]
        usuarioController.service.listar.mockResolvedValue(mockData)
        await usuarioController.listar(req, res)
        expect(usuarioController.service.listar).toHaveBeenCalledTimes(1)
        expect(usuarioController.service.listar).toHaveBeenCalledWith(req)
        expect(res.status).toHaveBeenCalledWith(200)
        
        expect(res.json).toHaveBeenCalledWith({
            
            data: mockData,
            errors: [],
            message: "Requisição bem-sucedida",
        })
    });
    it('deve listar um usuario por id com params', async( )=> {
        const mockData = {id: '67959501ea0999e0a0fa9f58',
            nome: 'Usuario'}
        req.params = {id:'67959501ea0999e0a0fa9f58'}
        usuarioController.service.listar.mockResolvedValue(mockData)
        await usuarioController.listar(req, res)
        expect(usuarioController.service.listar).toHaveBeenCalledTimes(1)
        expect(usuarioController.service.listar).toHaveBeenCalledWith(req)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            data:mockData,
            errors:[],
            message: "Requisição bem-sucedida"
        })
    })
});