import mongoose from 'mongoose';
import ReservaRepository from '../../repositories/ReservaRepository.js';
import Reserva from '../../models/Reserva.js';
import Equipamento from '../../models/Equipamento.js';
import Usuario from '../../models/Usuario.js';
import { CustomError, messages } from '../../utils/helpers/index.js';
import ReservaFilterBuilder from '../../repositories/filters/ReservaFilterBuilder.js';

// Definir MockObjectId no escopo global
class MockObjectId {
  constructor(id) {
    this.id = id;
  }
  toString() {
    return this.id;
  }
}

// Mocks
jest.mock('../../utils/logger.js', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));
jest.mock('../../models/Reserva.js');
jest.mock('../../models/Equipamento.js');
jest.mock('../../models/Usuario.js');
jest.mock('../../repositories/filters/ReservaFilterBuilder.js', () => {
  return jest.fn().mockImplementation(() => ({
    comDataInicial: jest.fn().mockReturnThis(),
    comDataFinal: jest.fn().mockReturnThis(),
    comDataFinalAtrasada: jest.fn().mockReturnThis(),
    comQuantidadeEquipamento: jest.fn().mockReturnThis(),
    comValorEquipamento: jest.fn().mockReturnThis(),
    comEnderecoEquipamento: jest.fn().mockReturnThis(),
    comStatus: jest.fn().mockReturnThis(),
    build: jest.fn(),
  }));
});
jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  return {
    ...originalMongoose,
    Types: {
      ObjectId: jest.fn().mockImplementation((id) => new MockObjectId(id)),
    },
  };
});

describe('ReservaRepository', () => {
  let reservaRepository;

  beforeEach(() => {
    reservaRepository = new ReservaRepository({
      reservaModel: Reserva,
      equipamentoModel: Equipamento,
      usuarioModel: Usuario,
    });
    jest.clearAllMocks();
  });

  describe('listar', () => {
    it('deve listar uma reserva por ID com populate', async () => {
      const mockReserva = {
        _id: '123',
        dataInicial: new Date(),
        dataFinal: new Date(),
        quantidadeEquipamento: 1,
        valorEquipamento: 100,
        enderecoEquipamento: 'Rua Teste',
        statusReserva: 'pendente',
        equipamentos: { _id: 'equip1', nome: 'Equipamento 1' },
        usuarios: { _id: 'user1', nome: 'Usuário 1' },
      };

      Reserva.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockReserva),
      });

      const req = { params: { id: '123' } };
      const result = await reservaRepository.listar(req);

      expect(Reserva.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockReserva);
    });

    it('deve lançar erro se a reserva por ID não for encontrada', async () => {
      Reserva.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const req = { params: { id: '123' } };

      await expect(reservaRepository.listar(req)).rejects.toThrow(
        new CustomError({
          statusCode: 404,
          errorType: 'resourceNotFound',
          field: 'Reserva',
          details: [],
          customMessage: messages.error.resourceNotFound('Reserva'),
        })
      );
    });

    it('deve listar reservas com filtros e paginação', async () => {
      const mockFiltros = { statusReserva: 'pendente' };
      const mockResultado = {
        docs: [{ _id: '123', toObject: jest.fn().mockReturnValue({ _id: '123' }) }],
        totalDocs: 1,
        page: 1,
        limit: 10,
      };

      ReservaFilterBuilder.mockImplementation(() => ({
        comDataInicial: jest.fn().mockReturnThis(),
        comDataFinal: jest.fn().mockReturnThis(),
        comDataFinalAtrasada: jest.fn().mockReturnThis(),
        comQuantidadeEquipamento: jest.fn().mockReturnThis(),
        comValorEquipamento: jest.fn().mockReturnThis(),
        comEnderecoEquipamento: jest.fn().mockReturnThis(),
        comStatus: jest.fn().mockReturnThis(),
        build: jest.fn().mockReturnValue(mockFiltros),
      }));
      Reserva.paginate.mockResolvedValue(mockResultado);

      const req = {
        query: { statusReserva: 'pendente', page: '1', limite: '10' },
        params: {},
      };

      const result = await reservaRepository.listar(req);

      expect(ReservaFilterBuilder).toHaveBeenCalled();
      expect(Reserva.paginate).toHaveBeenCalledWith(mockFiltros, {
        page: 1,
        limit: 10,
        sort: { nome: 1 },
      });
      expect(result).toEqual(mockResultado);
    });

    it('deve lançar erro se filterBuilder.build não for uma função', async () => {
      ReservaFilterBuilder.mockImplementation(() => ({
        comDataInicial: jest.fn().mockReturnThis(),
        comDataFinal: jest.fn().mockReturnThis(),
        comDataFinalAtrasada: jest.fn().mockReturnThis(),
        comQuantidadeEquipamento: jest.fn().mockReturnThis(),
        comValorEquipamento: jest.fn().mockReturnThis(),
        comEnderecoEquipamento: jest.fn().mockReturnThis(),
        comStatus: jest.fn().mockReturnThis(),
        build: null,
      }));

      const req = { query: { statusReserva: 'pendente' }, params: {} };

      await expect(reservaRepository.listar(req)).rejects.toThrow(
        new CustomError({
          statusCode: 500,
          errorType: 'internalServerError',
          field: 'Reserva',
          details: [],
          customMessage: messages.error.internalServerError('Reserva'),
        })
      );
    });
  });

  describe('criar', () => {
    it('deve criar uma nova reserva', async () => {
      const mockDados = {
        dataInicial: new Date(),
        dataFinal: new Date(),
        quantidadeEquipamento: 1,
        valorEquipamento: 100,
        enderecoEquipamento: 'Rua Teste',
        statusReserva: 'pendente',
        equipamentos: new MockObjectId('equip1'),
        usuarios: new MockObjectId('user1'),
      };

      const mockReserva = { ...mockDados, _id: '123', save: jest.fn().mockResolvedValue(mockDados) };
      Reserva.mockImplementation(() => mockReserva);

      const result = await reservaRepository.criar(mockDados);

      expect(Reserva).toHaveBeenCalledWith(mockDados);
      expect(mockReserva.save).toHaveBeenCalled();
      expect(result).toEqual(mockDados);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar uma reserva existente', async () => {
      const mockReserva = {
        _id: '123',
        dataInicial: new Date(),
        dataFinal: new Date(),
        quantidadeEquipamento: 2,
        equipamentos: new MockObjectId('equip1'),
        usuarios: new MockObjectId('user1'),
      };

      Reserva.findByIdAndUpdate.mockResolvedValue(mockReserva);

      const result = await reservaRepository.atualizar('123', { quantidadeEquipamento: 2 });

      expect(Reserva.findByIdAndUpdate).toHaveBeenCalledWith('123', { quantidadeEquipamento: 2 }, { new: true });
      expect(result).toEqual(mockReserva);
    });

    it('deve lançar erro se a reserva não for encontrada', async () => {
      Reserva.findByIdAndUpdate.mockResolvedValue(null);

      await expect(reservaRepository.atualizar('123', { quantidadeEquipamento: 2 })).rejects.toThrow(
        new CustomError({
          statusCode: 404,
          errorType: 'resourceNotFound',
          field: 'Reserva',
          details: [],
          customMessage: messages.error.resourceNotFound('Reserva'),
        })
      );
    });
  });

  describe('findReservasSobrepostas', () => {
    it('deve encontrar reservas sobrepostas', async () => {
      const mockReservas = [
        {
          _id: '123',
          equipamentos: new MockObjectId('equip1'),
          dataInicial: new Date('2025-06-01'),
          dataFinal: new Date('2025-06-02'),
        },
      ];

      mongoose.Types.ObjectId.mockReturnValue(new MockObjectId('equip1'));
      Reserva.find.mockResolvedValue(mockReservas);

      const result = await reservaRepository.findReservasSobrepostas(
        'equip1',
        new Date('2025-06-01'),
        new Date('2025-06-02')
      );

      expect(mongoose.Types.ObjectId).toHaveBeenCalledWith('equip1');
      expect(Reserva.find).toHaveBeenCalledWith({
        equipamentos: expect.any(MockObjectId),
        dataInicial: { $lte: new Date('2025-06-02') },
        dataFinal: { $gte: new Date('2025-06-01') },
      });
      expect(result).toEqual(mockReservas);
    });

    it('deve lançar erro em caso de falha no banco', async () => {
      mongoose.Types.ObjectId.mockReturnValue(new MockObjectId('equip1'));
      Reserva.find.mockRejectedValue(new Error('Erro no banco'));

      await expect(
        reservaRepository.findReservasSobrepostas('equip1', new Date('2025-06-01'), new Date('2025-06-02'))
      ).rejects.toThrow(
        new CustomError({
          statusCode: 500,
          errorType: 'databaseError',
          field: 'Reserva',
          details: ['Erro no banco'],
          customMessage: 'Erro ao buscar reservas sobrepostas.',
        })
      );
    });
  });
});