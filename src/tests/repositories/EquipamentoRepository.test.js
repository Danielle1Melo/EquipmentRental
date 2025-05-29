import EquipamentoRepository from '../../repositories/EquipamentoRepository.js';
import EquipamentoModel from '../../models/Equipamento.js';

jest.mock('../../models/Equipamento.js');

const mockPaginate = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockSave = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  EquipamentoModel.mockImplementation(() => ({
    save: mockSave,
  }));
  EquipamentoModel.paginate = mockPaginate;
  EquipamentoModel.findById = mockFindById;
  EquipamentoModel.findByIdAndUpdate = mockFindByIdAndUpdate;
  EquipamentoModel.findByIdAndDelete = mockFindByIdAndDelete;
});

describe('EquipamentoRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new EquipamentoRepository({ equipamentoModel: EquipamentoModel });
  });

  describe('constructor', () => {
    it('deve usar o modelo padrão quando nenhum for fornecido', () => {
      const repo = new EquipamentoRepository();
      expect(repo.model).toBe(EquipamentoModel);
    });
  });

  describe('criar', () => {
    it('deve criar e retornar equipamento com status inativo', async () => {
      const dadosEquipamento = {
        nome: 'Câmera DSLR',
        descricao: 'Câmera profissional',
        categoria: 'Fotografia',
        valorDiaria: 50,
        disponibilidade: { inicio: '2025-06-01', fim: '2025-12-31' },
      };
      const equipamentoSalvo = { _id: '123', ...dadosEquipamento, ativo: false };
      mockSave.mockResolvedValueOnce(equipamentoSalvo);

      const result = await repository.criar(dadosEquipamento);

      expect(result).toEqual(equipamentoSalvo);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(result.ativo).toBe(false);
    });

    it('deve lançar erro se atributos obrigatórios estiverem faltando', async () => {
      const dadosEquipamento = { nome: 'Câmera DSLR' };
      mockSave.mockRejectedValueOnce(new Error('Missing required fields'));

      await expect(repository.criar(dadosEquipamento)).rejects.toThrow('Missing required fields');
    });
  });

  describe('listar', () => {
    it('deve listar equipamentos com filtros de categoria, faixa de preço e disponibilidade', async () => {
      const query = {
        categoria: 'Fotografia',
        valorDiariaMin: 20,
        valorDiariaMax: 100,
        disponibilidade: '2025-06-01',
      };
      const pagina = 1;
      const limite = 10;
      const mockEquipamentos = {
        docs: [{ _id: '123', nome: 'Câmera DSLR', categoria: 'Fotografia', valorDiaria: 50 }],
        totalDocs: 1,
      };
      mockPaginate.mockResolvedValueOnce(mockEquipamentos);

      const result = await repository.listar(query, pagina, limite);

      expect(result).toEqual(mockEquipamentos);
      expect(mockPaginate).toHaveBeenCalledWith(query, {
        page: pagina,
        limit: limite,
        sort: { equiNome: 1 },
      });
    });

    it('deve listar apenas equipamentos ativos para usuários comuns', async () => {
      const query = { ativo: true };
      const pagina = 1;
      const limite = 10;
      const mockEquipamentos = {
        docs: [{ _id: '123', nome: 'Câmera DSLR', ativo: true }],
        totalDocs: 1,
      };
      mockPaginate.mockResolvedValueOnce(mockEquipamentos);

      const result = await repository.listar(query, pagina, limite);

      expect(result).toEqual(mockEquipamentos);
      expect(mockPaginate).toHaveBeenCalledWith({ ativo: true }, expect.any(Object));
    });
  });

  describe('listarPorId', () => {
    it('deve retornar detalhes de um equipamento ativo', async () => {
      const id = '123';
      const mockEquipamento = { _id: '123', nome: 'Câmera DSLR', ativo: true };
      mockFindById.mockResolvedValueOnce(mockEquipamento);

      const result = await repository.listarPorId(id);

      expect(result).toEqual(mockEquipamento);
      expect(mockFindById).toHaveBeenCalledWith(id);
    });

    it('deve retornar null se o equipamento não for encontrado', async () => {
      const id = '123';
      mockFindById.mockResolvedValueOnce(null);

      const result = await repository.listarPorId(id);

      expect(result).toBeNull();
    });
  });

  describe('atualizar', () => {
    it('deve atualizar equipamento e marcar como inativo para nova aprovação', async () => {
      const id = '123';
      const dadosAtualizados = { nome: 'Câmera DSLR Atualizada', valorDiaria: 60 };
      const mockEquipamento = { _id: '123', nome: 'Câmera DSLR Atualizada', valorDiaria: 60, ativo: false };
      mockFindByIdAndUpdate.mockResolvedValueOnce(mockEquipamento);

      const result = await repository.atualizar(id, dadosAtualizados);

      expect(result).toEqual(mockEquipamento);
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(id, dadosAtualizados, { new: true });
    });

    it('deve retornar null se o equipamento não for encontrado', async () => {
      const id = '123';
      mockFindByIdAndUpdate.mockResolvedValueOnce(null);

      const result = await repository.atualizar(id, { nome: 'Câmera DSLR' });

      expect(result).toBeNull();
    });
  });

  describe('deletar', () => {
    it('deve inativar um equipamento sem locações ativas', async () => {
      const id = '123';
      const mockEquipamento = { _id: '123', nome: 'Câmera DSLR', ativo: false };
      mockFindByIdAndDelete.mockResolvedValueOnce(mockEquipamento);

      const result = await repository.deletar(id);

      expect(result).toEqual(mockEquipamento);
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('deve retornar null se o equipamento não for encontrado', async () => {
      const id = '123';
      mockFindByIdAndDelete.mockResolvedValueOnce(null);

      const result = await repository.deletar(id);

      expect(result).toBeNull();
    });
  });
});
