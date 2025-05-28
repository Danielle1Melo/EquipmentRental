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
      expect(controller.service.atualizar).toHaveBeenCalledWith(id, req.body);
      expect(CommonResponse.success).toHaveBeenCalledWith(res, equipamento, 200, 'Equipamento atualizado com sucesso.');
    });

    it('deve lançar erro se id for inválido', async () => {
      req.params.id = 'idInvalido';
      EquipamentoIdSchema.parse.mockImplementation(() => {
        throw { name: 'ZodError', message: 'Id inválido' };
      });

      await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));

      expect(EquipamentoIdSchema.parse).toHaveBeenCalledWith('idInvalido');
      expect(equipamentoUpdateSchema.parse).not.toHaveBeenCalled();
      expect(controller.service.atualizar).not.toHaveBeenCalled();
      expect(CommonResponse.success).not.toHaveBeenCalled();
    });

    it('deve lançar erro se dados de atualização forem inválidos', async () => {
      const id = 'abc123';
      req.params.id = id;
      req.body = { equiNome: 'Nome inválido' }; 
      EquipamentoIdSchema.parse.mockReturnValue(true);
      equipamentoUpdateSchema.parse.mockImplementation(() => {
        throw { name: 'ZodError', message: 'Dados inválidos' };
      });

      await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));

      expect(EquipamentoIdSchema.parse).toHaveBeenCalledWith(id);
      expect(equipamentoUpdateSchema.parse).toHaveBeenCalledWith(req.body);
      expect(controller.service.atualizar).not.toHaveBeenCalled();
      expect(CommonResponse.success).not.toHaveBeenCalled();
    });

    it('deve lançar erro 404 se equipamento não for encontrado', async () => {
      const id = 'naoExiste123';
      req.params.id = id;
      req.body = { equiValorDiaria: 40.0 };
      EquipamentoIdSchema.parse.mockReturnValue(true);
      equipamentoUpdateSchema.parse.mockReturnValue(req.body);
      controller.service.atualizar.mockRejectedValue({ status: 404, message: 'Equipamento não encontrado' });

      await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ status: 404 }));

      expect(EquipamentoIdSchema.parse).toHaveBeenCalledWith(id);
      expect(equipamentoUpdateSchema.parse).toHaveBeenCalledWith(req.body);
      expect(controller.service.atualizar).toHaveBeenCalledWith(id, req.body);
    });

    it('deve lançar erro 500 em caso de falha inesperada', async () => {
      const id = 'abc123';
      req.params.id = id;
      req.body = { equiValorDiaria: 50.0 };
      EquipamentoIdSchema.parse.mockReturnValue(true);
      equipamentoUpdateSchema.parse.mockReturnValue(req.body);
      controller.service.atualizar.mockRejectedValue(new Error('Erro interno'));

      await expect(controller.atualizar(req, res)).rejects.toThrow('Erro interno');

      expect(EquipamentoIdSchema.parse).toHaveBeenCalledWith(id);
      expect(equipamentoUpdateSchema.parse).toHaveBeenCalledWith(req.body);
      expect(controller.service.atualizar).toHaveBeenCalledWith(id, req.body);
    });
  });
});
