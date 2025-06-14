import mongoose from 'mongoose';
import ReservaRepository from '../../repositories/ReservaRepository.js';
import Reserva from '../../models/Reserva.js';
import Equipamento from '../../models/Equipamento.js';
import Usuario from '../../models/Usuario.js';
import { CustomError, messages } from '../../utils/helpers/index.js';
import ReservaFilterBuilder from '../../repositories/filters/ReservaFilterBuilder.js';
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
      it('deve listar uma reserva por ID', async () => {
        const mockReserva = {
          _id: '123',
          dataInicial: new Date(),
          dataFinal: new Date(),
          quantidadeEquipamento: 1,
          valorEquipamento: 100,
          enderecoEquipamento: 'Rua Teste',
          statusReserva: 'pendente',
          equipamentos: { _id: 'equip1', equiNome: 'Equipamento 1' },
          usuarios: { _id: 'user1', nome: 'Usuário 1' },
        };

        const mockQuery = {
          populate: jest.fn()
            .mockReturnThis() 
            .mockReturnThis() 
            .mockResolvedValue(mockReserva) 
        };

       Reserva.findById.mockReturnValue(mockQuery);

        const req = { params: { id: '123' } };
        const result = await reservaRepository.listar(req);

        expect(Reserva.findById).toHaveBeenCalledWith('123');
        expect(mockQuery.populate).toHaveBeenNthCalledWith(1, [{ path: 'equipamentos', select: 'equiNome' }, { path: 'usuarios', select: 'nome' }]);
        expect(result).toEqual(mockReserva);
      });

      it('deve lançar erro se a reserva por ID não for encontrada', async () => {
        const mockQuery = {
          populate: jest.fn()
            .mockReturnThis()
            .mockReturnThis() 
            .mockResolvedValue(null) 
        };

        Reserva.findById.mockReturnValue(mockQuery);

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

        expect(Reserva.findById).toHaveBeenCalledWith('123');
        expect(mockQuery.populate).toHaveBeenCalledTimes(1);
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
          populate: [
            { path: 'equipamentos', select: 'equiNome' },
            { path: 'usuarios', select: 'nome' },
          ],
          sort: { createdAt: 1 },
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
        
      it('deve lidar com documentos sem toObject na paginação', async () => {
      const mockFiltros = { statusReserva: 'pendente' };
      const mockResultado = {
        docs: [{ _id: '123' }],
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

      expect(result).toEqual({
        ...mockResultado,
        docs: [{ _id: '123' }],
      });
    });

    it('deve respeitar o limite máximo de 100', async () => {
      const mockFiltros = { statusReserva: 'pendente' };
      const mockResultado = {
        docs: [{ _id: '123', toObject: jest.fn().mockReturnValue({ _id: '123' }) }],
        totalDocs: 1,
        page: 1,
        limit: 100,
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
        query: { statusReserva: 'pendente', page: '1', limite: '200' },
        params: {},
      };

      const result = await reservaRepository.listar(req);

      expect(Reserva.paginate).toHaveBeenCalledWith(mockFiltros, {
        page: 1,
        limit: 100,
        populate: [
          { path: 'equipamentos', select: 'equiNome' },
          { path: 'usuarios', select: 'nome' },
        ],
        sort: { createdAt: 1 },
      });
      expect(result).toEqual(mockResultado);
    });

    it('deve lançar erro para ID inválido', async () => {
      Reserva.findById.mockImplementation(() => {
        throw new Error('Invalid ObjectId');
      });

      const req = { params: { id: 'invalid_id' } };

      await expect(reservaRepository.listar(req)).rejects.toThrow();
      expect(Reserva.findById).toHaveBeenCalledWith('invalid_id');
    });

    it('deve chamar todos os métodos do ReservaFilterBuilder com filtros fornecidos', async () => {
      const mockFiltros = {
        dataInicial: new Date('2025-06-01'),
        dataFinal: new Date('2025-06-02'),
        dataFinalAtrasada: new Date('2025-06-03'),
        quantidadeEquipamento: 1,
        valorEquipamento: 100,
        enderecoEquipamento: 'Rua Teste',
        statusReserva: 'pendente',
      };

      const filterBuilderInstance = {
        comDataInicial: jest.fn().mockReturnThis(),
        comDataFinal: jest.fn().mockReturnThis(),
        comDataFinalAtrasada: jest.fn().mockReturnThis(),
        comQuantidadeEquipamento: jest.fn().mockReturnThis(),
        comValorEquipamento: jest.fn().mockReturnThis(),
        comEnderecoEquipamento: jest.fn().mockReturnThis(),
        comStatus: jest.fn().mockReturnThis(),
        build: jest.fn().mockReturnValue(mockFiltros),
      };
      ReservaFilterBuilder.mockImplementation(() => filterBuilderInstance);
      Reserva.paginate.mockResolvedValue({
        docs: [],
        totalDocs: 0,
        page: 1,
        limit: 10,
      });

      const req = {
        query: {
          dataInicial: '2025-06-01',
          dataFinal: '2025-06-02',
          dataFinalAtrasada: '2025-06-03',
          quantidadeEquipamento: '1',
          valorEquipamento: '100',
          enderecoEquipamento: 'Rua Teste',
          statusReserva: 'pendente',
          page: '1',
          limite: '10',
        },
        params: {},
      };

      await reservaRepository.listar(req);

      expect(filterBuilderInstance.comDataInicial).toHaveBeenCalledWith('2025-06-01');
      expect(filterBuilderInstance.comDataFinal).toHaveBeenCalledWith('2025-06-02');
      expect(filterBuilderInstance.comDataFinalAtrasada).toHaveBeenCalledWith('2025-06-03');
      expect(filterBuilderInstance.comQuantidadeEquipamento).toHaveBeenCalledWith('1');
      expect(filterBuilderInstance.comValorEquipamento).toHaveBeenCalledWith('100');
      expect(filterBuilderInstance.comEnderecoEquipamento).toHaveBeenCalledWith('Rua Teste');
      expect(filterBuilderInstance.comStatus).toHaveBeenCalledWith('pendente');
      expect(filterBuilderInstance.build).toHaveBeenCalled();
    });

    it('deve filtrar reservas por usuarios usando regex', async () => {
    const mockUsuarios = [
      { _id: new MockObjectId('user1'), nome: 'Usuário Teste' },
      { _id: new MockObjectId('user2'), nome: 'Usuário Outro' },
    ];
    const mockFiltros = { statusReserva: 'pendente', usuarios: { $in: [new MockObjectId('user1'), new MockObjectId('user2')] } };
    const mockResultado = {
      docs: [{ _id: '123', toObject: jest.fn().mockReturnValue({ _id: '123', usuarios: new MockObjectId('user1') }) }],
      totalDocs: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    // Mock do usuarioModel.find
    Usuario.find.mockResolvedValue(mockUsuarios);
    // Mock do filterBuilder
    ReservaFilterBuilder.mockImplementation(() => ({
      comDataInicial: jest.fn().mockReturnThis(),
      comDataFinal: jest.fn().mockReturnThis(),
      comDataFinalAtrasada: jest.fn().mockReturnThis(),
      comQuantidadeEquipamento: jest.fn().mockReturnThis(),
      comValorEquipamento: jest.fn().mockReturnThis(),
      comEnderecoEquipamento: jest.fn().mockReturnThis(),
      comStatus: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue({ statusReserva: 'pendente' }),
    }));
    Reserva.paginate.mockResolvedValue(mockResultado);

    const req = {
      query: { statusReserva: 'pendente', usuarios: 'Teste', page: '1', limite: '10' },
      params: {},
    };

    const result = await reservaRepository.listar(req);

    expect(Usuario.find).toHaveBeenCalledWith({ nome: { $regex: 'Teste', $options: 'i' } }, '_id');
    expect(Reserva.paginate).toHaveBeenCalledWith(
      mockFiltros,
      expect.objectContaining({
        page: 1,
        limit: 10,
        populate: [
          { path: 'equipamentos', select: 'equiNome' },
          { path: 'usuarios', select: 'nome' },
        ],
        sort: { createdAt: 1 },
      })
    );
    expect(result).toEqual(mockResultado);
    });

    it('deve retornar resultado vazio quando nenhum usuário é encontrado', async () => {
      // Mock do usuarioModel.find retornando array vazio
      Usuario.find.mockResolvedValue([]);
      
      const req = {
        query: { usuarios: 'Inexistente', page: '1', limite: '10' },
        params: {},
      };

      const result = await reservaRepository.listar(req);

      expect(Usuario.find).toHaveBeenCalledWith({ nome: { $regex: 'Inexistente', $options: 'i' } }, '_id');
      expect(result).toEqual({
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
      });
      expect(Reserva.paginate).not.toHaveBeenCalled();
    });
    it('deve filtrar reservas por equipamentos usando regex', async () => {
    const mockEquipamentos = [
      { _id: new MockObjectId('equip1'), equiNome: 'Equipamento Teste' },
      { _id: new MockObjectId('equip2'), equiNome: 'Equipamento Outro' },
    ];
    const mockFiltros = { statusReserva: 'pendente', equipamentos: { $in: [new MockObjectId('equip1'), new MockObjectId('equip2')] } };
    const mockResultado = {
      docs: [{ _id: '123', toObject: jest.fn().mockReturnValue({ _id: '123', equipamentos: new MockObjectId('equip1') }) }],
      totalDocs: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    // Mock do equipamentoModel.find
    Equipamento.find.mockResolvedValue(mockEquipamentos);
    // Mock do filterBuilder
    ReservaFilterBuilder.mockImplementation(() => ({
      comDataInicial: jest.fn().mockReturnThis(),
      comDataFinal: jest.fn().mockReturnThis(),
      comDataFinalAtrasada: jest.fn().mockReturnThis(),
      comQuantidadeEquipamento: jest.fn().mockReturnThis(),
      comValorEquipamento: jest.fn().mockReturnThis(),
      comEnderecoEquipamento: jest.fn().mockReturnThis(),
      comStatus: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue({ statusReserva: 'pendente' }),
    }));
    Reserva.paginate.mockResolvedValue(mockResultado);

    const req = {
      query: { statusReserva: 'pendente', equipamentos: 'Teste', page: '1', limite: '10' },
      params: {},
    };

    const result = await reservaRepository.listar(req);

    expect(Equipamento.find).toHaveBeenCalledWith({ equiNome: { $regex: 'Teste', $options: 'i' } }, '_id');
    expect(Reserva.paginate).toHaveBeenCalledWith(
      mockFiltros,
      expect.objectContaining({
        page: 1,
        limit: 10,
        populate: [
          { path: 'equipamentos', select: 'equiNome' },
          { path: 'usuarios', select: 'nome' },
        ],
        sort: { createdAt: 1 },
      })
    );
    expect(result).toEqual(mockResultado);
  });

  it('deve retornar resultado vazio quando nenhum equipamento é encontrado', async () => {
    Equipamento.find.mockResolvedValue([]);

    const req = {
      query: { equipamentos: 'Inexistente', page: '1', limite: '10' },
      params: {},
    };

    const result = await reservaRepository.listar(req);

    expect(Equipamento.find).toHaveBeenCalledWith({ equiNome: { $regex: 'Inexistente', $options: 'i' } }, '_id');
    expect(result).toEqual({
      docs: [],
      totalDocs: 0,
      limit: 10,
      page: 1,
      totalPages: 0,
    });
    expect(Reserva.paginate).not.toHaveBeenCalled();
  });

  it('deve combinar filtros de usuarios e equipamentos corretamente', async () => {
    const mockUsuarios = [{ _id: new MockObjectId('user1'), nome: 'Usuário Teste' }];
    const mockEquipamentos = [{ _id: new MockObjectId('equip1'), equiNome: 'Equipamento Teste' }];
    const mockFiltros = {
      statusReserva: 'pendente',
      usuarios: { $in: [new MockObjectId('user1')] },
      equipamentos: { $in: [new MockObjectId('equip1')] },
    };
    const mockResultado = {
      docs: [{ _id: '123', toObject: jest.fn().mockReturnValue({ _id: '123', usuarios: new MockObjectId('user1'), equipamentos: new MockObjectId('equip1') }) }],
      totalDocs: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };


    Usuario.find.mockResolvedValue(mockUsuarios);
    Equipamento.find.mockResolvedValue(mockEquipamentos);

    ReservaFilterBuilder.mockImplementation(() => ({
      comDataInicial: jest.fn().mockReturnThis(),
      comDataFinal: jest.fn().mockReturnThis(),
      comDataFinalAtrasada: jest.fn().mockReturnThis(),
      comQuantidadeEquipamento: jest.fn().mockReturnThis(),
      comValorEquipamento: jest.fn().mockReturnThis(),
      comEnderecoEquipamento: jest.fn().mockReturnThis(),
      comStatus: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue({ statusReserva: 'pendente' }),
    }));
    Reserva.paginate.mockResolvedValue(mockResultado);

    const req = {
      query: { statusReserva: 'pendente', usuarios: 'Teste', equipamentos: 'Teste', page: '1', limite: '10' },
      params: {},
    };

    const result = await reservaRepository.listar(req);

    expect(Usuario.find).toHaveBeenCalledWith({ nome: { $regex: 'Teste', $options: 'i' } }, '_id');
    expect(Equipamento.find).toHaveBeenCalledWith({ equiNome: { $regex: 'Teste', $options: 'i' } }, '_id');
    expect(Reserva.paginate).toHaveBeenCalledWith(
      mockFiltros,
      expect.objectContaining({
        page: 1,
        limit: 10,
        populate: [
          { path: 'equipamentos', select: 'equiNome' },
          { path: 'usuarios', select: 'nome' },
        ],
        sort: { createdAt: 1 },
      })
    );
    expect(result).toEqual(mockResultado);
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

    it('deve lançar erro se a criação da reserva falhar', async () => {
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

    const mockReserva = { ...mockDados, _id: '123', save: jest.fn().mockRejectedValue(new Error('Erro de validação')) };
    Reserva.mockImplementation(() => mockReserva);

    await expect(reservaRepository.criar(mockDados)).rejects.toThrow('Erro de validação');
    expect(Reserva).toHaveBeenCalledWith(mockDados);
    expect(mockReserva.save).toHaveBeenCalled();
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