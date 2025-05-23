import { beforeAll, beforeEach, describe, expect, jest } from "@jest/globals";
import UsuarioController from "../../controllers/UsuarioController.js";
import UsuarioService from "../../services/UsuarioService.js";
import { CommonResponse, messages } from "../../utils/helpers/index.js";
import { UsuarioIdSchema, UsuarioQuerySchema } from "../../utils/validators/schemas/zod/querys/UsuarioQuerySchema.js";
import { UsuarioSchema } from "../../utils/validators/schemas/zod/UsuarioSchema.js";
import { UsuarioUpdateSchema } from "../../utils/validators/schemas/zod/UsuarioSchema.js";
import { error, query } from "winston";
import { errors } from "mongodb-memory-server";

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
        req.params = undefined
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
        req.query = undefined
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
    });
    it('deve listar um usuário pelas queries', async()=>{
        const mockData = [{
            id: '67959501ea0999e0a0fa9f58',
            nome: 'Usuario',
            email: 'usuario@gmail.com'
        },{
            id: '67959501ea0999e0a0fa9f59',
            nome: 'Usuario Dois',
            email: 'usuario2@gmail.com'
        }]
        req.query = {email: 'usuario@gmail.com'}
        usuarioController.service.listar.mockResolvedValue(mockData.find(user => user.email == req.query.email))
        await usuarioController.listar(req, res)
        expect(usuarioController.service.listar).toHaveBeenCalledTimes(1)
        expect(usuarioController.service.listar).toHaveBeenCalledWith(req)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            data:mockData[0],
            errors: [],
            message: "Requisição bem-sucedida"
        })
    });
    it('deve cadastrar um usuário pelo body', async() => {
        req.body = {
            nome: "TESTE",
            email: "teste1234@gmail.com",
            telefone: "(69) 99999-8888",
            senha: "Laravel@123",
            dataNascimento: "2000-08-08",
            CPF: "96945788253",
            status: "ativo",
            tipoUsuario: "usuario",
            fotoUsuario: "http://lorempixel.com/640/480"
        }
            usuarioController.service.cadastrarUsuario.mockResolvedValue({...req.body, id:'67959501ea0999e0a0fa9f59'})
            await usuarioController.cadastrarUsuario(req, res)
            expect(usuarioController.service.cadastrarUsuario).toHaveBeenCalledTimes(1)
            expect(usuarioController.service.cadastrarUsuario).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                data: {...req.body, id:'67959501ea0999e0a0fa9f59'},
                errors:[],
                message: 'Usuário criado com sucesso!'
            })

    });
    it('deve atualizar um usuário pelo id recibo no req.params', async () => {
        const mockUsuario = {
            id: '67959501ea0999e0a0fa9f59',
            nome: "TESTE",
            email: "teste1234@gmail.com",
            telefone: "(69) 99999-8888",
            senha: "Laravel@123",
            dataNascimento: "2000-08-08",
            CPF: "96945788253",
            status: "ativo",
            tipoUsuario: "usuario",
            fotoUsuario: "http://lorempixel.com/640/480"
        }
        req.params = {id:'67959501ea0999e0a0fa9f59'}
        req.body = {nome: "Nome Alterado Com Sucesso",
                    email: "emailalteradocomsucesso@gmail.com",
                    telefone: "(69) 99999-9999"
        }
        usuarioController.service.updateUsuario.mockResolvedValue({...mockUsuario, ...req.body})
        await usuarioController.updateUsuario(req, res)
        expect(usuarioController.service.updateUsuario).toHaveBeenCalledTimes(1)
        expect(usuarioController.service.updateUsuario).toHaveBeenCalledWith(req.params.id, req.body)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            data: {...mockUsuario, ...req.body},
            errors: [],
            message: "Usuário atualizado com sucesso!"
        })

    });
    it('deve retornar um erro ao tentar atualizar o usuário sem id', async() => {
        req.params = undefined
        await expect(usuarioController.updateUsuario(req, res)).rejects.toThrowErrorMatchingInlineSnapshot(`
"[
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [],
    "message": "Required"
  }
]"
`)
    })
});
