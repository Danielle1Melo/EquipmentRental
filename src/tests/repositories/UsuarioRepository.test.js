import mongoose from "mongoose";
import UsuarioModel from "../../models/Usuario";
import UsuarioFilterBuilder from "../../repositories/filters/UsuarioFilterBuilder";
import UsuarioRepository from "../../repositories/UsuarioRepository";
import { CustomError, messages } from "../../utils/helpers";

jest.mock("../../models/Usuario")

describe('UsuarioRepository', () => {

    let usuarioRepository; let req; let res; let mockData;
    beforeEach(() => {
        usuarioRepository = new UsuarioRepository
        req = { params: {id: '67959501ea0999e0a0fa9f58'}, body: {}, query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
            };
        mockData = {
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
    });
    afterEach(() => {
        jest.clearAllMocks()
    });
    describe('listar usuarios', () => {
        it('deve encontrar usuario por id', async() => {
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
        req.params = {id: '67959501ea0999e0a0fa9f58'}
        usuarioRepository.model.findById.mockResolvedValue({...mockData, ...req.params})
        const resultado = await usuarioRepository.listar(req)
        expect(resultado).toEqual({...req.params,...mockData})

        });
        it('não deve encontrar o usuário por id', async () => {
            usuarioRepository.model.findById.mockResolvedValue(null)
            const resultado = await usuarioRepository.listar(req)
            expect(resultado).toEqual(null)
        })
        it('deve listar todos os usuários', async () => {
            const mockData = {
    data: [
        {
            nome: "TESTE",
            email: "teste1234@gmail.com",
            telefone: "(69) 99999-8888",
            senha: "Laravel@123",
            dataNascimento: "2000-08-08",
            CPF: "96945788253",
            status: "ativo",
            tipoUsuario: "usuario",
            fotoUsuario: "http://lorempixel.com/640/480"
        },
        {
            nome: "TESTE DOIS",
            email: "teste12345@gmail.com",
            telefone: "(69) 99999-8878",
            senha: "Laravel@123",
            dataNascimento: "2000-08-08",
            CPF: "96945788253",
            status: "ativo",
            tipoUsuario: "usuario",
            fotoUsuario: "http://lorempixel.com/780/560"
        }
    ],
    totalDocs: 26,
    limit: 10,
    totalPages: 3,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: true,
    prevPage: null,
    nextPage: 2
};

        req.params = {}
        usuarioRepository.model.find.mockResolvedValue(mockData.data)
        usuarioRepository.model.paginate.mockResolvedValue(mockData)
        const resultado = await usuarioRepository.listar(req)
        expect(resultado).toEqual(mockData)
        });
    });
    describe('atualizar usuário', () => {
        it('deve atualizar um usuário com sucesso', async ()=> {
            usuarioRepository.model.findByIdAndUpdate.mockResolvedValue({...req.params, ...mockData})
            const resultado = await usuarioRepository.updateUsuario(mockData)
            expect(usuarioRepository.model.findByIdAndUpdate).toHaveBeenCalledTimes(1)
            expect(resultado).toEqual({...req.params,...mockData})

        });
        it('deve retornar um erro ao tentar atualizar usuário com email persistente em outro usuário', async() =>{
            usuarioRepository.model.findByIdAndUpdate.mockResolvedValue(null)
            await expect(usuarioRepository.updateUsuario(req.params.id, mockData.email)).rejects.toThrowErrorMatchingInlineSnapshot(`"Recurso não encontrado em Usuário."`)
        });
    });
    describe('deve cadastrar um usuário', () => {
        it('deve ter sucesso ao cadastrar um usuário', async() => {
            usuarioRepository.model.create.mockResolvedValue({...req.params,...mockData})
            const resultado = await usuarioRepository.cadastrarUsuario(mockData)
            expect(resultado).toEqual({...req.params, ...mockData})
        });
    });
    describe('não deve encontrar dados duplicados no banco de dados', () => {
        it('não deve encontrar nenhum email', async() =>{
            usuarioRepository.model.findOne.mockResolvedValue(null)
            await expect(usuarioRepository.buscarPorEmail(mockData.email)).resolves.toBeUndefined()
        });
        it('não deve encontrar nenhum telefone', async() => {
            usuarioRepository.model.findOne.mockResolvedValue(null)
            await expect(usuarioRepository.buscarPorTelefone(mockData.telefone)).resolves.toBeUndefined()
        });
        it('deve encontrar um usuário por id', async () => {
            usuarioRepository.model.findById.mockResolvedValue({...req.params, ...mockData})
            const resultado = await usuarioRepository.buscarPorId({...req.params})
            expect(resultado).toEqual({...req.params, ...mockData})
        });
        it('deve buscar um usuário por cpf e rotrnar nada/undefind', async() => {
            usuarioRepository.model.findOne.mockResolvedValue(null)
            const resultado = await usuarioRepository.buscarPorCpf(mockData.CPF)
            expect(resultado).toBeUndefined()
        }); 
    });
    describe('Retornar exception/CustomError ao realizar consultas', () => {
        it('deve retornar erro ao realizar consulta por email', async() => {
            usuarioRepository.model.findOne.mockResolvedValue({...req.params, ... mockData})
            await expect(usuarioRepository.buscarPorEmail(mockData.email)).rejects.toThrowErrorMatchingInlineSnapshot(`"Conflito de recurso em Usuário contém Email."`)
        });
        it('deve retornar erro ao realizar consulta por telefone', async() => {
            usuarioRepository.model.findOne.mockResolvedValue({...req.params, ...mockData})
            await expect(usuarioRepository.buscarPorTelefone(mockData.telefone)).rejects.toThrowErrorMatchingInlineSnapshot(`"Conflito de recurso em Usuário contém Telefone."`)
        });
        it('deve retornar erro ao realizar consulta por id', async () => {
            usuarioRepository.model.findById.mockResolvedValue(null)
            await expect(usuarioRepository.buscarPorId(req.params.id)).rejects.toThrowErrorMatchingInlineSnapshot(`"Recurso não encontrado em Usuário."`)
        });
        it('deve retornar erro ao realizar consulta por cpf', async() => {
            usuarioRepository.model.findOne({...req.params, ...mockData})
            await expect(usuarioRepository.buscarPorCpf(mockData.CPF)).rejects.toThrowErrorMatchingInlineSnapshot(`"Conflito de recurso em Usuário contém CPF."`)
        })
    })
})