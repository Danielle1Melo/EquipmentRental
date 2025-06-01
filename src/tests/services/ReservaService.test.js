import { beforeEach, describe, expect, jest } from '@jest/globals';
import ReservaService from '../../services/ReservaService.js';
import ReservaRepository from '../../repositories/ReservaRepository.js';
import Equipamento from '../../models/Equipamento.js';
import mongoose from 'mongoose';
import { CustomError, messages } from "../../utils/helpers";

jest.mock('../../repositories/ReservaRepository.js', () => {
  return jest.fn().mockImplementation(() => ({
    listar: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
    buscarPorID: jest.fn(),
    findReservasSobrepostas: jest.fn(),
  }));
});

jest.mock('../../models/Equipamento.js', () => ({
  findById: jest.fn(),
}));

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  const mockObjectId = jest.fn().mockImplementation((id) => ({
    toString: () => id,
    equals: (other) => id === other.toString(),
  }));
  mockObjectId.isValid = jest.fn();
  return {
    ...actualMongoose,
    Types: {
      ObjectId: mockObjectId,
    },
  };
});

describe('ReservaService', () => {
  let reservaService;
  let repositoryMock;
  let req;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    repositoryMock = new ReservaRepository();
    reservaService = new ReservaService();
    reservaService.repository = repositoryMock;
    jest.clearAllMocks();
    mongoose.Types.ObjectId.isValid.mockReturnValue(true);
  });

  describe('listar', () => {
    it('deve listar todas as reservas', async () => {
      const mockData = [
        {
          _id: '67959501ea0999e0a0fa9f58',
          dataInicial: new Date('2025-06-01T05:01:45.884Z'),
          dataFinal: new Date('2025-06-05T05:01:45.884Z'),
          quantidadeEquipamento: 2,
          valorEquipamento: 200,
          enderecoEquipamento: 'Rua Exemplo, 123',
          statusReserva: 'confirmada',
          equipamentos: 'equip1',
          usuarios: 'user1',
        },
      ];
      repositoryMock.listar.mockResolvedValue(mockData);

      const result = await reservaService.listar(req);

      expect(repositoryMock.listar).toHaveBeenCalledWith(req);
      expect(result).toEqual(mockData);
    });
  });

  describe('criar', () => {
    const validReservaData = {
      dataInicial: new Date('2025-06-02T05:01:45.884Z'),
      dataFinal: new Date('2025-06-05T05:01:45.884Z'),
      dataFinalAtrasada: new Date('2025-06-06T05:01:45.884Z'),
      quantidadeEquipamento: 2,
      valorEquipamento: 200,
      enderecoEquipamento: 'Rua Exemplo, 123',
      statusReserva: 'pendente',
      equipamentos: '67959501ea0999e0a0fa9f58',
      usuarios: 'user1',
    };

    it('deve criar uma reserva válida', async () => {
      const mockEquipamento = {
        _id: '67959501ea0999e0a0fa9f58',
        quantidadeDisponivel: 5,
      };
      Equipamento.findById.mockResolvedValue(mockEquipamento);
      repositoryMock.findReservasSobrepostas.mockResolvedValue([]);
      repositoryMock.criar.mockResolvedValue(validReservaData);

      const result = await reservaService.criar(validReservaData);

      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('67959501ea0999e0a0fa9f58');
      expect(Equipamento.findById).toHaveBeenCalledWith(expect.any(Object));
      expect(repositoryMock.findReservasSobrepostas).toHaveBeenCalledWith(
        validReservaData.equipamentos,
        validReservaData.dataInicial,
        validReservaData.dataFinal
      );
      expect(repositoryMock.criar).toHaveBeenCalledWith(validReservaData);
      expect(result).toEqual(validReservaData);
    });

    it('deve criar uma reserva com data no formato ISO do MongoDB', async () => {
      const isoReservaData = {
        ...validReservaData,
        dataInicial: new Date('2025-06-02T05:01:45.884Z'),
        dataFinal: new Date('2025-06-05T05:01:45.884Z'),
        dataFinalAtrasada: new Date('2025-06-06T05:01:45.884Z'),
      };
      const mockEquipamento = {
        _id: '67959501ea0999e0a0fa9f58',
        quantidadeDisponivel: 5,
      };
      Equipamento.findById.mockResolvedValue(mockEquipamento);
      repositoryMock.findReservasSobrepostas.mockResolvedValue([]);
      repositoryMock.criar.mockResolvedValue(isoReservaData);

      const result = await reservaService.criar(isoReservaData);

      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('67959501ea0999e0a0fa9f58');
      expect(Equipamento.findById).toHaveBeenCalledWith(expect.any(Object));
      expect(repositoryMock.findReservasSobrepostas).toHaveBeenCalledWith(
        isoReservaData.equipamentos,
        isoReservaData.dataInicial,
        isoReservaData.dataFinal
      );
      expect(repositoryMock.criar).toHaveBeenCalledWith(isoReservaData);
      expect(result).toEqual(isoReservaData);
    });

    it('deve lançar erro se dataInicial for maior ou igual a dataFinal', async () => {
      const invalidData = {
        ...validReservaData,
        dataInicial: new Date('2025-06-05T05:01:45.884Z'),
        dataFinal: new Date('2025-06-05T05:01:45.884Z'),
      };

      await expect(reservaService.criar(invalidData)).rejects.toThrow(
        new CustomError({
          statusCode: 400,
          errorType: 'invalidData',
          field: 'dataInicial',
          details: [],
          customMessage: 'A data inicial deve ser anterior à data final.',
        })
      );
    });

    it('deve lançar erro se dataFinalAtrasada for menor ou igual a dataFinal', async () => {
      const invalidData = {
        ...validReservaData,
        dataFinalAtrasada: new Date('2025-06-05T05:01:45.884Z'),
      };

      await expect(reservaService.criar(invalidData)).rejects.toThrow(
        new CustomError({
          statusCode: 400,
          errorType: 'invalidData',
          field: 'dataFinalAtrasada',
          details: [],
          customMessage: 'A data final atrasada deve ser posterior à data final.',
        })
      );
    });

    it('deve lançar erro se dataInicial for no passado', async () => {
      const invalidData = {
        ...validReservaData,
        dataInicial: new Date('2024-01-01T05:01:45.884Z'),
      };

      await expect(reservaService.criar(invalidData)).rejects.toThrow(
        new CustomError({
          statusCode: 400,
          errorType: 'invalidData',
          field: 'dataInicial',
          details: [],
          customMessage: 'A data inicial não pode ser no passado.',
        })
      );
    });

    it('deve lançar erro se quantidadeEquipamento for menor ou igual a zero', async () => {
      const invalidData = {
        ...validReservaData,
        quantidadeEquipamento: 0,
      };

      await expect(reservaService.criar(invalidData)).rejects.toThrow(
        new CustomError({
          statusCode: 400,
          errorType: 'invalidData',
          field: 'quantidadeEquipamento',
          details: [],
          customMessage: 'A quantidade de equipamento deve ser um número inteiro positivo.',
        })
      );
    });

    it('deve lançar erro se equipamentos não for especificado', async () => {
      const invalidData = {
        ...validReservaData,
        equipamentos: null,
      };

      await expect(reservaService.criar(invalidData)).rejects.toThrow(
        new CustomError({
          statusCode: 400,
          errorType: 'invalidData',
          field: 'equipamentos',
          details: [],
          customMessage: 'Pelo menos um equipamento deve ser especificado.',
        })
      );
    });

    it('deve lançar erro se equipamentoId for inválido', async () => {
      const invalidData = {
        ...validReservaData,
        equipamentos: 'invalid-id',
      };
      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      await expect(reservaService.criar(invalidData)).rejects.toThrow(
        new CustomError({
          statusCode: 400,
          errorType: 'invalidData',
          field: 'equipamentos',
          details: [],
          customMessage: `ID de equipamento inválido: ${invalidData.equipamentos}`,
        })
      );
    });

    it('deve lançar erro se equipamento não for encontrado', async () => {
      Equipamento.findById.mockResolvedValue(null);

      await expect(reservaService.criar(validReservaData)).rejects.toThrow(
        new CustomError({
          statusCode: 404,
          errorType: 'resourceNotFound',
          field: 'equipamentos',
          details: [],
          customMessage: 'Equipamento não encontrado.',
        })
      );
    });

    it('deve lançar erro se quantidade solicitada excede a disponível', async () => {
      const mockEquipamento = {
        _id: '67959501ea0999e0a0fa9f58',
        quantidadeDisponivel: 1,
      };
      Equipamento.findById.mockResolvedValue(mockEquipamento);
      repositoryMock.findReservasSobrepostas.mockResolvedValue([]);

      await expect(reservaService.criar(validReservaData)).rejects.toThrow(
        new CustomError({
          statusCode: 400,
          errorType: 'invalidData',
          field: 'quantidadeEquipamento',
          details: [],
          customMessage: 'Quantidade solicitada excede a quantidade disponível do equipamento.',
        })
      );
    });

    it('deve lançar erro se houver reservas sobrepostas', async () => {
      const mockEquipamento = {
        _id: '67959501ea0999e0a0fa9f58',
        quantidadeDisponivel: 5,
      };
      Equipamento.findById.mockResolvedValue(mockEquipamento);
      repositoryMock.findReservasSobrepostas.mockResolvedValue([
        { _id: 'existing-reserva' },
      ]);

      await expect(reservaService.criar(validReservaData)).rejects.toThrow(
        new CustomError({
          statusCode: 409,
          errorType: 'conflict',
          field: 'equipamento',
          details: [],
          customMessage: 'Já existe uma reserva para este equipamento no período solicitado.',
        })
      );
    });
  });

  describe('atualizar', () => {
    it('deve atualizar uma reserva válida', async () => {
      const mockReserva = {
        _id: '67959501ea0999e0a0fa9f58',
        dataInicial: new Date('2025-06-01T05:01:45.884Z'),
        dataFinal: new Date('2025-06-05T05:01:45.884Z'),
        quantidadeEquipamento: 2,
        valorEquipamento: 200,
        enderecoEquipamento: 'Rua Exemplo, 123',
        statusReserva: 'pendente',
        equipamentos: 'equip1',
        usuarios: 'user1',
      };
      const updateData = { statusReserva: 'confirmada' };
      repositoryMock.atualizar.mockResolvedValue({ ...mockReserva, ...updateData });

      const result = await reservaService.atualizar(mockReserva._id, updateData);

      expect(repositoryMock.atualizar).toHaveBeenCalledWith(mockReserva._id, updateData);
      expect(result).toEqual({ ...mockReserva, ...updateData });
    });
  });

  describe('ensureReservaExists', () => {
    it('deve retornar a reserva se ela existir', async () => {
      const mockReserva = {
        _id: '67959501ea0999e0a0fa9f58',
        dataInicial: new Date('2025-06-01T05:01:45.884Z'),
        dataFinal: new Date('2025-06-05T05:01:45.884Z'),
        quantidadeEquipamento: 2,
        valorEquipamento: 200,
        enderecoEquipamento: 'Rua Exemplo, 123',
        statusReserva: 'pendente',
        equipamentos: 'equip1',
        usuarios: 'user1',
      };
      repositoryMock.buscarPorID.mockResolvedValue(mockReserva);

      const result = await reservaService.ensureReservaExists(mockReserva._id);

      expect(repositoryMock.buscarPorID).toHaveBeenCalledWith(mockReserva._id);
      expect(result).toEqual(mockReserva);
    });

    it('deve lançar erro se a reserva não for encontrada', async () => {
      repositoryMock.buscarPorID.mockResolvedValue(null);

      await expect(reservaService.ensureReservaExists('67959501ea0999e0a0fa9f58')).rejects.toThrow(
        new CustomError({
          statusCode: 404,
          errorType: 'resourceNotFound',
          field: 'Reserva',
          details: [],
          customMessage: 'Reserva não encontrada.',
        })
      );
    });
  });
});