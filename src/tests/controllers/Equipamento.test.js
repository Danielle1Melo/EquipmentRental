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
    it('deve listar equipamentos com query válida', async () => {
      req.query = { categoria: 'câmera' };
      EquipamentoQuerySchema.parseAsync.mockResolvedValue(req.query);
      const dados = [{ _id: '1', nome: 'Câmera' }];
      controller.service.listar.mockResolvedValue(dados);

      await controller.listar(req, res);

      expect(EquipamentoQuerySchema.parseAsync).toHaveBeenCalledWith(req.query);
      expect(controller.service.listar).toHaveBeenCalledWith(req.query);
      expect(CommonResponse.success).toHaveBeenCalledWith(res, dados);
    });

    it('deve listar equipamentos sem query', async () => {
      const dados = [{ _id: '1', nome: 'Câmera' }];
      controller.service.listar.mockResolvedValue(dados);

      await controller.listar(req, res);

      expect(EquipamentoQuerySchema.parseAsync).not.toHaveBeenCalled();
      expect(controller.service.listar).toHaveBeenCalledWith({});
      expect(CommonResponse.success).toHaveBeenCalledWith(res, dados);
    });
  });

  describe('listarPorId', () => {
    it('deve retornar equipamento pelo id', async () => {
      const id = '123abc';
      req.params.id = id;
      req.usuario = { _id: 'userId' };
      EquipamentoIdSchema.parse.mockReturnValue(true);
      const equipamento = { _id: id, nome: 'Tripé' };
      controller.service.listarPorId.mockResolvedValue(equipamento);

      await controller.listarPorId(req, res);

      expect(EquipamentoIdSchema.parse).toHaveBeenCalledWith(id);
      expect(controller.service.listarPorId).toHaveBeenCalledWith(id, 'userId');
      expect(CommonResponse.success).toHaveBeenCalledWith(res, equipamento);
    });
  });

  describe('criar', () => {
    it('deve criar um equipamento com dados válidos', async () => {
      const dadosValidos = { equiNome: 'Câmera', equiValorDiaria: 50 };
      req.body = dadosValidos;
      equipamentoSchema.parse.mockReturnValue(dadosValidos);
      const equipamentoCriado = { _id: '1', ...dadosValidos };
      controller.service.criar.mockResolvedValue(equipamentoCriado);

      await controller.criar(req, res);

      expect(equipamentoSchema.parse).toHaveBeenCalledWith(dadosValidos);
      expect(controller.service.criar).toHaveBeenCalledWith(dadosValidos);
      expect(CommonResponse.created).toHaveBeenCalledWith(res, {
        mensagem: 'Equipamento cadastrado. Aguardando aprovação.',
        equipamento: equipamentoCriado,
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
      expect(controller.service.atualizar).toHaveBeenCalledWith(id, req.body);
      expect(CommonResponse.success).toHaveBeenCalledWith(res, equipamento, 200, 'Equipamento atualizado com sucesso.');
    });

    it('deve lançar erro se id for inválido', async () => {
      req.params.id = 'idInvalido';
      EquipamentoIdSchema.parse.mockImplementation(() => {
        throw { name: 'ZodError', message: 'Id inválido' };
      });

      await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));
    });

    it('deve lançar erro se dados forem inválidos', async () => {
      req.params.id = 'abc123';
      req.body = { equiNome: 'Inválido' };
      EquipamentoIdSchema.parse.mockReturnValue(true);
      equipamentoUpdateSchema.parse.mockImplementation(() => {
        throw { name: 'ZodError', message: 'Dados inválidos' };
      });

      await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));
    });

    it('deve lançar erro se não encontrar equipamento', async () => {
      req.params.id = 'inexistente';
      req.body = { equiValorDiaria: 40.0 };
      EquipamentoIdSchema.parse.mockReturnValue(true);
      equipamentoUpdateSchema.parse.mockReturnValue(req.body);
      controller.service.atualizar.mockRejectedValue({ status: 404, message: 'Equipamento não encontrado' });

      await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ status: 404 }));
    });

    it('deve lançar erro 500 se falhar inesperadamente', async () => {
      req.params.id = 'abc123';
      req.body = { equiValorDiaria: 50.0 };
      EquipamentoIdSchema.parse.mockReturnValue(true);
      equipamentoUpdateSchema.parse.mockReturnValue(req.body);
      controller.service.atualizar.mockRejectedValue(new Error('Erro interno'));

      await expect(controller.atualizar(req, res)).rejects.toThrow('Erro interno');
    });
  });

  describe('deletar', () => {
    it('deve deletar equipamento com id válido', async () => {
      const id = 'abc123';
      req.params.id = id;
      EquipamentoIdSchema.parse.mockReturnValue(true);
      controller.service.deletar.mockResolvedValue();

      await controller.deletar(req, res);

      expect(EquipamentoIdSchema.parse).toHaveBeenCalledWith(id);
      expect(controller.service.deletar).toHaveBeenCalledWith(id);
      expect(CommonResponse.success).toHaveBeenCalledWith(res, {
        mensagem: 'Equipamento excluído com sucesso.',
      });
    });
  });
});
