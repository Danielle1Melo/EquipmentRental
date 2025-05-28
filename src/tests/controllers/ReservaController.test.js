import { beforeEach, describe, expect, jest } from '@jest/globals';
import ReservaController from '../../controllers/ReservaController.js';
import ReservaService from '../../services/ReservaService.js';
import mongoose from 'mongoose';

jest.mock('../../services/ReservaService.js');

describe('ReservaController', () => {
  let req, res, reservaController;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    ReservaService.mockClear();
    reservaController = new ReservaController();
  });

  describe('listar', () => {
    it('deve listar todas as reservas', async () => {
      const mockData = [
        {
          id: '67959501ea0999e0a0fa9f58',
          dataInicial: '2025-06-01T00:00:00.000Z',
          dataFinal: '2025-06-05T00:00:00.000Z',
          quantidadeEquipamento: 2,
          valorEquipamento: 200,
          enderecoEquipamento: 'Rua Exemplo, 123',
          statusReserva: 'confirmada',
          usuarios: new mongoose.Types.ObjectId(),
          equipamentos: new mongoose.Types.ObjectId(),
        },
      ];
      reservaController.service.listar.mockResolvedValue(mockData);
      await reservaController.listar(req, res);
      expect(reservaController.service.listar).toHaveBeenCalledTimes(1);
      expect(reservaController.service.listar).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { dados: mockData, message: 'Reservas listadas com sucesso.' },
        errors: [],
        message: 'Requisição bem-sucedida',
      });
    });

    it('deve listar uma reserva por id com params', async () => {
      const mockData = {
        id: '67959501ea0999e0a0fa9f58',
        usuario: new mongoose.Types.ObjectId(),
        equipamento: new mongoose.Types.ObjectId(),
        dataInicial: '2025-06-01T00:00:00.000Z',
        dataFinal: '2025-06-05T00:00:00.000Z',
        quantidadeEquipamento: 2,
        valorEquipamento: 200,
        enderecoEquipamento: 'Rua Exemplo, 123',
        status: 'confirmada',
      };
      req.params = { id: '67959501ea0999e0a0fa9f58' };
      req.query = {};
      reservaController.service.listar.mockResolvedValue(mockData);
      await reservaController.listar(req, res);
      expect(reservaController.service.listar).toHaveBeenCalledTimes(1);
      expect(reservaController.service.listar).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { dados: mockData, message: 'Reserva encontrada com sucesso.' },
        errors: [],
        message: 'Requisição bem-sucedida',
      });
    });

    it('deve listar reservas pelas queries', async () => {
      const mockData = [
        {
          id: '67959501ea0999e0a0fa9f58',
          usuario: new mongoose.Types.ObjectId(),
          equipamento: new mongoose.Types.ObjectId(),
          dataInicial: '2025-06-01T00:00:00.000Z',
          dataFinal: '2025-06-05T00:00:00.000Z',
          quantidadeEquipamento: 2,
          valorEquipamento: 200,
          enderecoEquipamento: 'Rua Exemplo, 123',
          status: 'confirmada',
        },
      ];
      req.query = { dataInicial: '2025-06-01' };
      reservaController.service.listar.mockResolvedValue(mockData);
      await reservaController.listar(req, res);
      expect(reservaController.service.listar).toHaveBeenCalledTimes(1);
      expect(reservaController.service.listar).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { dados: mockData, message: 'Reservas listadas com sucesso.' },
        errors: [],
        message: 'Requisição bem-sucedida',
      });
    });
  });

  describe('criar', () => {
    it('deve criar uma reserva pelo body', async () => {
      const mockReserva = {
        id: '67959501ea0999e0a0fa9f58',
        usuario: new mongoose.Types.ObjectId(),
        equipamento: new mongoose.Types.ObjectId(),
        dataInicial: '2025-06-01T00:00:00.000Z',
        dataFinal: '2025-06-05T00:00:00.000Z',
        quantidadeEquipamento: 2,
        valorEquipamento: 200,
        enderecoEquipamento: 'Rua Exemplo, 123',
        status: 'confirmada',
      };
      req.body = {
        usuario: mockReserva.usuario,
        equipamento: mockReserva.equipamento,
        dataInicial: '2025-06-01',
        dataFinal: '2025-06-05',
        quantidadeEquipamento: 2,
        valorEquipamento: 200,
        enderecoEquipamento: 'Rua Exemplo, 123',
        status: 'confirmada',
      };
      reservaController.service.criar.mockResolvedValue({
        toObject: () => mockReserva,
      });
      await reservaController.criar(req, res);
      expect(reservaController.service.criar).toHaveBeenCalledTimes(1);
      expect(reservaController.service.criar).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: mockReserva,
        errors: [],
        message: 'Recurso criado com sucesso',
      });
    });
  });

  describe('atualizar', () => {
    it('deve atualizar uma reserva pelo id recebido no req.params', async () => {
      const mockReserva = {
        id: '67959501ea0999e0a0fa9f58',
        usuario: new mongoose.Types.ObjectId(),
        equipamento: new mongoose.Types.ObjectId(),
        dataInicial: '2025-06-01T00:00:00.000Z',
        dataFinal: '2025-06-05T00:00:00.000Z',
        quantidadeEquipamento: 2,
        valorEquipamento: 200,
        enderecoEquipamento: 'Rua Exemplo, 123',
        status: 'confirmada',
      };
      req.params = { id: '67959501ea0999e0a0fa9f58' };
      req.body = {
        status: 'cancelada',
        quantidadeEquipamento: 3,
        valorEquipamento: 300,
      };
      reservaController.service.atualizar.mockResolvedValue({
        ...mockReserva,
        ...req.body,
      });
      await reservaController.atualizar(req, res);
      expect(reservaController.service.atualizar).toHaveBeenCalledTimes(1);
      expect(reservaController.service.atualizar).toHaveBeenCalledWith(
        req.params.id,
        req.body,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { ...mockReserva, ...req.body },
        errors: [],
        message: 'Reserva atualizada com sucesso.',
      });
    });

    it('deve retornar um erro ao tentar atualizar uma reserva com id inválido', async () => {
      req.params = { id: 'invalid-id' };
      req.body = { status: 'cancelada' };
      await expect(reservaController.atualizar(req, res)).rejects.toThrow();
    });
  });
});