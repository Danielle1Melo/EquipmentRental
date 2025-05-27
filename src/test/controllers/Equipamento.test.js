import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';
import EquipamentoController from '../../controllers/EquipamentoController.js';
import { CommonResponse } from '../../utils/helpers/index.js';
import { equipamentoSchema, equipamentoUpdateSchema } from '../../utils/validators/schemas/zod/EquipamentoSchema.js';
import { EquipamentoQuerySchema, EquipamentoIdSchema } from '../../utils/validators/schemas/zod/querys/EquipamentoQuerySchema.js';

jest.mock('../../services/EquipamentoService.js');
jest.mock('../../utils/helpers/index.js', () => ({
  CommonResponse: {
    success: jest.fn(),
    created: jest.fn()
  }
}));

jest.mock('../../utils/validators/schemas/zod/EquipamentoSchema.js', () => ({
  equipamentoSchema: { parse: jest.fn() },
  equipamentoUpdateSchema: { parse: jest.fn() }
}));

jest.mock('../../utils/validators/schemas/zod/querys/EquipamentoQuerySchema.js', () => ({
  EquipamentoQuerySchema: { parseAsync: jest.fn() },
  EquipamentoIdSchema: { parse: jest.fn() }
}));

describe('EquipamentoController', () => {
  let controller;
  let req, res;

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    controller = new EquipamentoController();
    req = { params: {}, body: {}, query: {}, usuario: {} };
    res = mockResponse();

    controller.service.listar = jest.fn();
    controller.service.listarPorId = jest.fn();
    controller.service.criar = jest.fn();
    controller.service.atualizar = jest.fn();
    controller.service.deletar = jest.fn();
  });

  afterEach(() => jest.clearAllMocks());

  describe('listar', () => {
    it('deve listar equipamentos com query', async () => {
      req.query = { nome: 'Notebook' };
      EquipamentoQuerySchema.parseAsync.mockResolvedValue(true);
      const mockData = [{ nome: 'Notebook Dell' }];
      controller.service.listar.mockResolvedValue(mockData);

      await controller.listar(req, res);

      expect(EquipamentoQuerySchema.parseAsync).toHaveBeenCalledWith(req.query);
      expect(controller.service.listar).toHaveBeenCalledWith(req.query);
      expect(CommonResponse.success).toHaveBeenCalledWith(res, mockData);
    });

    it('deve listar equipamentos sem query', async () => {
      req.query = {};
      const mockData = [{ nome: 'Monitor LG' }];
      controller.service.listar.mockResolvedValue(mockData);

      await controller.listar(req, res);

      expect(EquipamentoQuerySchema.parseAsync).not.toHaveBeenCalled();
      expect(CommonResponse.success).toHaveBeenCalledWith(res, mockData);
    });
  });

  describe('listarPorId', () => {
    it('deve retornar equipamento por ID', async () => {
      req.params.id = '123';
      req.usuario = { _id: '456' };
      EquipamentoIdSchema.parse.mockReturnValue(true);
      const equipamento = { nome: 'Mouse' };
      controller.service.listarPorId.mockResolvedValue(equipamento);

      await controller.listarPorId(req, res);

      expect(EquipamentoIdSchema.parse).toHaveBeenCalledWith('123');
      expect(controller.service.listarPorId).toHaveBeenCalledWith('123', '456');
      expect(CommonResponse.success).toHaveBeenCalledWith(res, equipamento);
    });
  });

  describe('criar', () => {
    it('deve criar novo equipamento', async () => {
      const dados = { nome: 'Teclado' };
      req.body = dados;
      equipamentoSchema.parse.mockReturnValue(dados);
      const mockEquipamento = { ...dados, _id: 'abc' };
      controller.service.criar.mockResolvedValue(mockEquipamento);

      await controller.criar(req, res);

      expect(equipamentoSchema.parse).toHaveBeenCalledWith(dados);
      expect(CommonResponse.created).toHaveBeenCalledWith(res, {
        mensagem: 'Equipamento cadastrado. Aguardando aprovação.',
        equipamento: mockEquipamento
      });
    });
  });

  describe('atualizar', () => {
    it('deve atualizar um equipamento', async () => {
      const id = 'abc123';
      req.params.id = id;
      req.body = { nome: 'Teclado atualizado' };
      EquipamentoIdSchema.parse.mockReturnValue(true);
      equipamentoUpdateSchema.parse.mockReturnValue(req.body);
      const equipamento = { nome: 'Teclado atualizado' };
      controller.service.atualizar.mockResolvedValue(equipamento);

      await controller.atualizar(req, res);

      expect(EquipamentoIdSchema.parse).toHaveBeenCalledWith(id);
      expect(equipamentoUpdateSchema.parse).toHaveBeenCalledWith(req.body);
      expect(CommonResponse.success).toHaveBeenCalledWith(res, equipamento, 200, 'Equipamento atualizado com sucesso.');
    });
  });

  describe('deletar', () => {
    it('deve deletar equipamento por id', async () => {
      req.params.id = 'xyz789';
      EquipamentoIdSchema.parse.mockReturnValue(true);
      controller.service.deletar.mockResolvedValue();

      await controller.deletar(req, res);

      expect(EquipamentoIdSchema.parse).toHaveBeenCalledWith('xyz789');
      expect(CommonResponse.success).toHaveBeenCalledWith(res, {
        mensagem: 'Equipamento excluído com sucesso.'
      });
    });
  });
});


