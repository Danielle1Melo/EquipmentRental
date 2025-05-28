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
      req.query = { equiNome: 'Multímetro' };
      EquipamentoQuerySchema.parseAsync.mockResolvedValue(true);
      const mockData = [{ nome: 'Multímetro Digital' }];
      controller.service.listar.mockResolvedValue(mockData);

      await controller.listar(req, res);

      expect(EquipamentoQuerySchema.parseAsync).toHaveBeenCalledWith(req.query);
      expect(controller.service.listar).toHaveBeenCalledWith(req.query);
      expect(CommonResponse.success).toHaveBeenCalledWith(res, mockData);
    });

    it('deve listar equipamentos sem query', async () => {
      req.query = {};
      const mockData = [{ nome: 'Furadeira Bosch' }];
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
      const equipamento = { nome: 'Osciloscópio Tektronix' };
      controller.service.listarPorId.mockResolvedValue(equipamento);

      await controller.listarPorId(req, res);

      expect(EquipamentoIdSchema.parse).toHaveBeenCalledWith('123');
      expect(controller.service.listarPorId).toHaveBeenCalledWith('123', '456');
      expect(CommonResponse.success).toHaveBeenCalledWith(res, equipamento);
    });
  });

  describe('criar', () => {
    it('deve criar novo equipamento com dados válidos', async () => {
      const dados = {
        equiNome: 'Estação de Solda',
        equiDescricao: 'Estação com controle digital de temperatura',
        equiValorDiaria: 25.50,
        equiQuantidadeDisponivel: 5,
        equiCategoria: 'Soldador',
        equiFoto: ['https://exemplo.com/foto1.jpg']
      };

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
    it('deve atualizar um equipamento com dados válidos', async () => {
      const id = 'abc123';
      req.params.id = id;
      req.body = { equiValorDiaria: 30.5 };
      EquipamentoIdSchema.parse.mockReturnValue(true);
      equipamentoUpdateSchema.parse.mockReturnValue(req.body);
      const equipamento = { equiValorDiaria: 30.5 };
      controller.service.atualizar.mockResolvedValue(equipamento);

      await controller.atualizar(req, res);

      expect(EquipamentoIdSchema.parse).toHaveBeenCalledWith(id);
      expect(equipamentoUpdateSchema.parse).toHaveBeenCalledWith(req.body);
      expect(CommonResponse.success).toHaveBeenCalledWith(res, equipamento, 200, 'Equipamento atualizado com sucesso.');
    });
  });
});


