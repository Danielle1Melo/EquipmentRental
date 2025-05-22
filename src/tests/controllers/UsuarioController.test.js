import UsuarioController from '../../controllers/UsuarioController.js';
import UsuarioService from '../../services/UsuarioService.js';
import { CommonResponse } from '../../utils/helpers/index.js';
import { describe, test, it, beforeEach } from '@jest/globals';

/**
 * @jest-environment node
 */
jest.mock('../../services/UsuarioService.js');
jest.mock('../../utils/helpers/index.js', () => ({
    CommonResponse: {
        success: jest.fn(),
    },
}));

describe('UsuarioController', () => {
    let controller;
    let req;
    let res;

    beforeEach(() => {
        controller = new UsuarioController();
        req = { params: {}, query: {}, body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });
    it('listar deve chamar o serviço listar corretamente e retornar todos os usuários', async () => {
        controller.service.listar = jest.fn().mockResolvedValue([
            { id: '682e08436c8fce3d955960f9', nome: 'Teste' },
            { id: '682e08436c8fce3d955960fa', nome: 'Teste Dois' }
        ]);
        req.params = undefined
        await controller.listar(req, res);

        expect(controller.service.listar).toHaveBeenCalledWith(req);
        expect(CommonResponse.success).toHaveBeenCalledWith(res, [
            { id: '682e08436c8fce3d955960f9', nome: 'Teste' },
            { id: '682e08436c8fce3d955960fa', nome: 'Teste Dois' }
        ]);
    });

    it('listar deve chamar o serviço listar corretamente ao receber params', async () => {
        req.params = { id: '682e08436c8fce3d955960f9' }; 
        controller.service.listar = jest.fn().mockResolvedValue([
            { id: '682e08436c8fce3d955960f9', nome: 'Teste' }
        ]);

        req.query = undefined
        await controller.listar(req, res);

        expect(controller.service.listar).toHaveBeenCalledWith(req);
        expect(CommonResponse.success).toHaveBeenCalledWith(res, [
            { id: '682e08436c8fce3d955960f9', nome: 'Teste' }
        ]);
    });

    it('listar deve chamar o serviço listar corretamente ao receber queries', async () => {
        req.query = {
            nome: "Genuário",
            email: "genuario@gmail.com",
            status: "ativo",
            tipoUsuario: "usuario"
        };
        controller.service.listar = jest.fn().mockResolvedValue([
            { id: '682e08436c8fce3d955960f9', nome: 'Teste' }
        ]);

        await controller.listar(req, res);

        expect(controller.service.listar).toHaveBeenCalledWith(req);
        expect(CommonResponse.success).toHaveBeenCalledWith(res, [
            { id: '682e08436c8fce3d955960f9', nome: 'Teste' }
        ]);
    });

    it('cadastrarUsuario deve chamar o serviço corretamente', async () => {
        const dataUser = {
            nome: "Fulano Beltrano Silvano Gilbertano",
            email: "fulano@gmail.com",
            telefone: "+55 (69) 9999-8888",
            senha: "Fulano@123",
            dataNascimento: "2000-01-01",
            CPF: "54425888065",
            status: "ativo",
            tipoUsuario: "usuario",
            fotoUsuario: "https://s3.amazonaws.com/uifaces/faces/twitter/johannesneu/128.jpg"
        };
        req.body = dataUser;
        controller.service.cadastrarUsuario = jest.fn().mockResolvedValue(dataUser);

        await controller.cadastrarUsuario(req, res);

        expect(controller.service.cadastrarUsuario).toHaveBeenCalledWith(req);
        expect(CommonResponse.success).toHaveBeenCalledWith(res, dataUser);
    });

    it('updateUsuario deve chamar o serviço corretamente', async () => {
        const updateUser = {
            nome: "Novo Nome",
            email: "novo@gmail.com",
            telefone: "+55 (69) 99999-9999"
        };
        req.body = updateUser;
        req.params = { id: '682e08436c8fce3d955960f9' };
        controller.service.updateUsuario = jest.fn().mockResolvedValue(updateUser);

        await controller.updateUsuario(req, res);

        expect(controller.service.updateUsuario).toHaveBeenCalledWith(req.params.id, updateUser);
        expect(CommonResponse.success).toHaveBeenCalledWith(res, updateUser);
    });
    
    it('updateUsuario deve retornar ao receber id undefined', async() =>{
        const updateUser = {
            nome: "Novo Nome",
            email: "novo@gmail.com",
            telefone: "+55 (69) 99999-9999"
        };
        req.body = updateUser;
        req.params = undefined
        await expect(controller.updateUsuario(req, res)).rejects.toThrowErrorMatchingInlineSnapshot(`
"[
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [],
    "message": "Required"
  }
]"
`);
    })
});
