import UsuarioService from "../../services/UsuarioService";
import UsuarioRepository from "../../repositories/UsuarioRepository";
import { afterEach, beforeAll, beforeEach, describe, expect, jest } from "@jest/globals";
import { CustomError, messages } from "../../utils/helpers";
import { it } from "faker-br/lib/locales";
jest.mock('../../repositories/UsuarioRepository')

describe('UsuarioService', () => {
    let usuarioService;
    let repositoryMock;
    let req, res;
    beforeEach(() =>{
        req = { params: {}, body: {}, query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        repositoryMock = new UsuarioRepository();
        usuarioService = new UsuarioService();
    });
    afterEach(() => {
        jest.clearAllMocks()
    });
    describe('listar', () => {
        it('deve listar todos os clientes', async() => {
            const mockData = [{
                id: '67959501ea0999e0a0fa9f58',
                nome: 'Usuario'
            }]
            usuarioService.repository.listar.mockResolvedValue(mockData);
            const resultado = await usuarioService.listar(req)
            expect(usuarioService.repository.listar).toHaveBeenCalled();
            expect(resultado).toEqual(mockData)
        });
        it('deve listar por id', async () => {
            const mockData = {
                id: '67959501ea0999e0a0fa9f58',
                nome: 'Usuario'
            }
            req.params = {id: '67959501ea0999e0a0fa9f58'}
            usuarioService.repository.listar.mockResolvedValue(mockData)
            const resultado = await usuarioService.listar(req)
            expect(usuarioService.repository.listar).toHaveBeenCalledWith(req);
            expect(resultado).toEqual(mockData)
        });
        it('deve listar por params', async () => {
            const mockData = {
                id: '67959501ea0999e0a0fa9f58',
                nome: 'Usuario',
                email:'usuario@gmail.com',
                status:'ativo',
                tipoUsuario:'admin'
            }
            req.params = {
                nome:'Usuario'
            }
            usuarioService.repository.listar.mockResolvedValue(mockData)
            const resultado = await usuarioService.listar(req)
            expect(usuarioService.repository.listar).toHaveBeenCalledWith(req)
            expect(resultado).toEqual(mockData)
        });
    });
    describe('criar', () => {
        it('deve criar um usuário válido', async() => {
            const mockData = {
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
        req.body = mockData
        usuarioService.repository.buscarPorCpf.mockResolvedValue(null)
        usuarioService.repository.buscarPorEmail.mockResolvedValue(null)
        usuarioService.repository.buscarPorTelefone.mockResolvedValue(null)
        usuarioService.repository.cadastrarUsuario.mockResolvedValue({id:'67959501ea0999e0a0fa9f58', ...mockData})
        const resultado = await usuarioService.cadastrarUsuario(mockData)
        console.log("Resultado:", resultado)
        expect(resultado).toHaveProperty('id')
        expect(usuarioService.repository.buscarPorCpf).toHaveBeenCalledWith(mockData.CPF)
        expect(usuarioService.repository.buscarPorEmail).toHaveBeenCalledWith(mockData.email)
        expect(usuarioService.repository.buscarPorTelefone).toHaveBeenCalledWith(mockData.telefone)
        expect(usuarioService.repository.cadastrarUsuario).toHaveBeenCalledWith(expect.objectContaining(mockData))
        });
        it("deve lançar um erro se o CPF já estiver em uso", async () => {
    const mockData = {
        nome: "TESTE",
        email: "teste1234@gmail.com",
        telefone: "(69) 99999-8888",
        senha: "Laravel@123",
        dataNascimento: "2000-08-08",
        CPF: "96945788253",
        status: "ativo",
        tipoUsuario: "usuario",
        fotoUsuario: "http://lorempixel.com/640/480"
    };

    req.body = mockData;

    usuarioService.repository.buscarPorCpf.mockRejectedValue(new CustomError({
                statusCode: 409,
                errorType:"Conflict",
                details:[],
                customMessage: messages.error.resourceConflict("Usuário", "CPF")
            })); // Simulando usuário existente
    usuarioService.repository.buscarPorEmail.mockResolvedValue(null);
    usuarioService.repository.buscarPorTelefone.mockResolvedValue(null);

    await expect(usuarioService.cadastrarUsuario(mockData)).rejects.toThrowErrorMatchingInlineSnapshot(`"Conflito de recurso em Usuário contém CPF."`)
    expect(usuarioService.repository.buscarPorCpf).toHaveBeenCalledWith(mockData.CPF)
})
    it('deve lançar um erro se o E-mail já estiver em uso', async () => {
        const dataMock = {
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

        req.body = dataMock
        usuarioService.repository.buscarPorCpf.mockRejectedValue(null)
        usuarioService.repository.buscarPorEmail.mockResolvedValue(new CustomError({
                statusCode: 409,
                errorType:"Conflict",
                details:[],
                customMessage: messages.error.resourceConflict("Usuário", "E-mail")
            }))
        usuarioService.repository.buscarPorTelefone.mockRejectedValue(null)
    })  

    })
})