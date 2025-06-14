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
    findReservasAtrasadas: jest.fn(), 
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
          dataInicial: new Date('2026-06-01T05:01:45.884Z'),
          dataFinal: new Date('2026-06-05T05:01:45.884Z'),
          quantidadeEquipamento: 2,
          valorEquipamento: 200,
          enderecoEquipamento: 'Rua Exemplo, 123',
          statusReserva: 'confirmada',
          equipamentos: '67959501ea0999e0a0fa9f58',
          usuarios: '6839a06f57d3853fbcc3797f',
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
      dataInicial: new Date('2026-06-22T05:00:00.000Z'),
      dataFinal: new Date('2026-06-23T05:00:00.000Z'),
      quantidadeEquipamento: 2,
      valorEquipamento: 200,
      enderecoEquipamento: 'Rua Exemplo, 123',
      statusReserva: 'pendente',
      equipamentos: '67959501ea0999e0a0fa9f58',
      usuarios: '6839a06f57d3853fbcc3797f',
    };

    it('deve criar uma reserva válida', async () => {
      const mockEquipamento = {
        equiQuantidadeDisponivel: 5,
        equiStatus: true,
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
    }, 1000);

    it('deve criar uma reserva com data no formato ISO do MongoDB', async () => {
      const isoReservaData = {
        ...validReservaData,
        dataInicial: new Date('2026-06-22T05:01:45.884Z'),
        dataFinal: new Date('2026-06-23T05:01:45.884Z'),
      };
      const mockEquipamento = {
        _id: '67959501ea0999e0a0fa9f58',
        equiQuantidadeDisponivel: 5,
        equiStatus: true,
      };
      const mockUsuario = {
        _id: '6839a06f57d3853fbcc3797f',
      };
      Equipamento.findById.mockResolvedValue(mockEquipamento);
      Equipamento.findByIdAndUpdate.mockResolvedValue(mockEquipamento);
      Usuario.findById.mockResolvedValue(mockUsuario);
      repositoryMock.findReservasAtrasadas.mockResolvedValue([]);
      repositoryMock.findReservasSobrepostas.mockResolvedValue([]);
      repositoryMock.criar.mockResolvedValue(isoReservaData);

      const result = await reservaService.criar(isoReservaData);

      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('67959501ea0999e0a0fa9f58');
      expect(Equipamento.findById).toHaveBeenCalledWith(expect.any(mongoose.Types.ObjectId));
      expect(Usuario.findById).toHaveBeenCalledWith(expect.any(mongoose.Types.ObjectId));
      expect(Equipamento.findByIdAndUpdate).toHaveBeenCalledWith(
        expect.any(mongoose.Types.ObjectId),
        { $inc: { equiQuantidadeDisponivel: -isoReservaData.quantidadeEquipamento } }
      );
      expect(repositoryMock.findReservasAtrasadas).toHaveBeenCalledWith(
        expect.any(mongoose.Types.ObjectId),
        expect.any(Date)
      );
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
        dataInicial: new Date('2026-06-05T05:01:45.884Z'),
        dataFinal: new Date('2026-06-05T05:01:45.884Z'),
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
        dataFinalAtrasada: new Date('2025-05-05T05:00:00.000Z'),
      };
      
      console.log("ESTES SÃO AS DATAS INVALIDAS:",invalidData)

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
          customMessage: 'O campo equipamentos é obrigatório.',
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
      _id: '6839a07057d3853fbcc379b8',
      equiQuantidadeDisponivel: 1,
    };
    
    Equipamento.findById.mockResolvedValue(mockEquipamento);
    
    await expect(reservaService.criar(validReservaData)).rejects.toThrow(
      new CustomError({
        statusCode: 400,
        errorType: 'invalidData',
        field: 'equiQuantidadeDisponivel',
        details: [],
        customMessage: 'Quantidade solicitada excede a quantidade disponível do equipamento.',
    })
  );
  
  expect(Equipamento.findById).toHaveBeenCalledWith(expect.any(Object));
});

    it('deve lançar erro se houver reservas sobrepostas', async () => {
      const mockEquipamento = {
        _id: '67959501ea0999e0a0fa9f58',
        equiQuantidadeDisponivel: 1,
      };
      Equipamento.findById.mockResolvedValue(mockEquipamento);
      repositoryMock.findReservasSobrepostas.mockResolvedValue([
        { _id: 'existing-reserva' },
      ]);

      const futureReservaData = {
        ...validReservaData,
        dataInicial: new Date('2025-06-14'), 
        dataFinal: new Date('2025-06-15'), 
        dataFinalAtrasada: new Date('2025-06-14T05:00:00.000Z'), 
    };

      await expect(reservaService.criar(futureReservaData)).rejects.toThrow(
        new CustomError({
          statusCode: 409,
          errorType: 'conflict',
          field: 'equipamento',
          details: [],
          customMessage: 'Conflito com reservas existentes, incluindo período de atraso.',
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
        dataInicial: new Date('2030-12-01T05:01:45.884Z'),
        dataFinal: new Date('2030-12-05T05:01:45.884Z'),
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