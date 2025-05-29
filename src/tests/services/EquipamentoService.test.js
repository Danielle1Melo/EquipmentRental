import EquipamentoService from "../../services/EquipamentoService.js";
import EquipamentoRepository from "../../repositories/EquipamentoRepository.js";
import EquipamentoFilterBuilder from "../../repositories/filters/EquipamentoFilterBuilder.js";
import { CustomError, HttpStatusCodes, messages } from "../../utils/helpers/index.js";

// Mock do EquipamentoRepository e EquipamentoFilterBuilder
jest.mock("../../repositories/EquipamentoRepository.js");
jest.mock("../../repositories/filters/EquipamentoFilterBuilder.js");

// Mock do CustomError
const mockCustomError = jest.fn();
jest.mock("../../utils/helpers/index.js", () => {
  const originalHelpers = jest.requireActual("../../utils/helpers/index.js");
  return {
    ...originalHelpers,
    CustomError: jest.fn().mockImplementation(function (args) {
      const instance = new Error(args.customMessage || "Erro Customizado");
      Object.assign(instance, args);
      instance.name = "CustomError";
      mockCustomError(args);
      return instance;
    }),
    HttpStatusCodes: {
      BAD_REQUEST: { code: 400, reason: "Bad Request" },
      NOT_FOUND: { code: 404, reason: "Not Found" },
      FORBIDDEN: { code: 403, reason: "Forbidden" },
      CONFLICT: { code: 409, reason: "Conflict" },
    },
    messages: {
      error: {
        resourceNotFound: jest.fn((resource) => `${resource} não encontrado.`),
      },
    },
  };
});

const makeEquipamento = (props = {}) => ({
  id: "1",
  equiNome: "Equipamento Teste",
  equiDescricao: "Descrição teste",
  equiCategoria: "maquinas",
  equiValorDiaria: 100,
  equiQuantidadeDisponivel: 5,
  equiFoto: ["foto1.jpg"],
  equiUsuario: "682520e98e38a049ac2ac569",
  equiAvaliacoes: [],
  equiNotaMediaAvaliacao: 0,
  equiStatus: false,
  ...props,
});

describe("EquipamentoService", () => {
  let equipamentoService;
  let mockEquipamentoRepositoryInstance;
  let mockEquipamentoFilterBuilderInstance;

  beforeEach(() => {
    mockEquipamentoRepositoryInstance = {
      listar: jest.fn(),
      listarPorId: jest.fn(),
      criar: jest.fn(),
      atualizar: jest.fn(),
      deletar: jest.fn(),
    };

    mockEquipamentoFilterBuilderInstance = {
      comCategoria: jest.fn().mockReturnThis(),
      comStatus: jest.fn().mockReturnThis(),
      comFaixaDeValor: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue({}),
    };

    EquipamentoRepository.mockImplementation(() => mockEquipamentoRepositoryInstance);
    EquipamentoFilterBuilder.mockImplementation(() => mockEquipamentoFilterBuilderInstance);

    equipamentoService = new EquipamentoService();
    mockCustomError.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("criar", () => {
    const mockDados = {
      equiNome: "Equipamento Teste",
      equiDescricao: "Descrição teste",
      equiCategoria: "maquinas",
      equiValorDiaria: 100,
      equiQuantidadeDisponivel: 5,
      equiFoto: ["foto1.jpg"],
    };

    it("deve criar um equipamento com sucesso, com status inativo", async () => {
      const mockEquipamentoCriado = makeEquipamento();
      mockEquipamentoRepositoryInstance.criar.mockResolvedValue(mockEquipamentoCriado);

      const resultado = await equipamentoService.criar(mockDados);

      expect(mockEquipamentoRepositoryInstance.criar).toHaveBeenCalledWith({
        ...mockDados,
        equiUsuario: "682520e98e38a049ac2ac569",
        equiAvaliacoes: [],
        equiNotaMediaAvaliacao: 0,
        equiStatus: false,
      });
      expect(resultado).toEqual(mockEquipamentoCriado);
    });

    it("deve lançar erro se equiNome não for fornecido", async () => {
      const dadosSemNome = { ...mockDados, equiNome: undefined };
      await expect(equipamentoService.criar(dadosSemNome)).rejects.toThrow(Error);
      expect(mockCustomError).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatusCodes.BAD_REQUEST.code,
          customMessage: "Campos obrigatórios não preenchidos.",
        })
      );
      expect(mockEquipamentoRepositoryInstance.criar).not.toHaveBeenCalled();
    });

    it("deve lançar erro se equiCategoria não for fornecida", async () => {
      const dadosSemCategoria = { ...mockDados, equiCategoria: undefined };
      await expect(equipamentoService.criar(dadosSemCategoria)).rejects.toThrow(Error);
      expect(mockCustomError).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatusCodes.BAD_REQUEST.code,
          customMessage: "Campos obrigatórios não preenchidos.",
        })
      );
      expect(mockEquipamentoRepositoryInstance.criar).not.toHaveBeenCalled();
    });

    it("deve lançar erro se equiFoto não for fornecida", async () => {
      const dadosSemFoto = { ...mockDados, equiFoto: [] };
      await expect(equipamentoService.criar(dadosSemFoto)).rejects.toThrow(Error);
      expect(mockCustomError).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatusCodes.BAD_REQUEST.code,
          customMessage: "Pelo menos uma foto é obrigatória",
        })
      );
      expect(mockEquipamentoRepositoryInstance.criar).not.toHaveBeenCalled();
    });

    it("deve lançar erro inesperado do repository", async () => {
      mockEquipamentoRepositoryInstance.criar.mockRejectedValue(new Error("Erro de banco de dados"));
      await expect(equipamentoService.criar(mockDados)).rejects.toThrow("Erro de banco de dados");
      expect(mockEquipamentoRepositoryInstance.criar).toHaveBeenCalled();
    });
  });

  describe("listar", () => {
    it("deve chamar repository.listar com os filtros processados e retornar os dados", async () => {
      const mockFiltros = { page: "1", limit: "10", categoria: "maquinas", status: "true", minValor: "100", maxValor: "500" };
      const mockResponseData = [makeEquipamento()];
      mockEquipamentoRepositoryInstance.listar.mockResolvedValue(mockResponseData);

      const resultado = await equipamentoService.listar(mockFiltros);

      expect(mockEquipamentoFilterBuilderInstance.comCategoria).toHaveBeenCalledWith("maquinas");
      expect(mockEquipamentoFilterBuilderInstance.comStatus).toHaveBeenCalledWith(true);
      expect(mockEquipamentoFilterBuilderInstance.comFaixaDeValor).toHaveBeenCalledWith("100", "500");
      expect(mockEquipamentoFilterBuilderInstance.build).toHaveBeenCalled();
      expect(mockEquipamentoRepositoryInstance.listar).toHaveBeenCalledWith({}, 1, 10);
      expect(resultado).toEqual(mockResponseData);
    });

    it("deve propagar erros do repository.listar", async () => {
      const mockFiltros = {};
      const erro = new Error("Erro de banco de dados");
      mockEquipamentoRepositoryInstance.listar.mockRejectedValue(erro);

      await expect(equipamentoService.listar(mockFiltros)).rejects.toThrow(erro);
    });
  });

  describe("listarPorId", () => {
    it("deve retornar equipamento se ativo ou se usuário é o proprietário", async () => {
      const mockEquipamento = makeEquipamento({ equiStatus: true });
      mockEquipamentoRepositoryInstance.listarPorId.mockResolvedValue(mockEquipamento);

      const resultado = await equipamentoService.listarPorId("1", "682520e98e38a049ac2ac569");

      expect(mockEquipamentoRepositoryInstance.listarPorId).toHaveBeenCalledWith("1");
      expect(resultado).toEqual(mockEquipamento);
    });

    it("deve lançar erro se equipamento não for encontrado", async () => {
      mockEquipamentoRepositoryInstance.listarPorId.mockResolvedValue(null);

      await expect(equipamentoService.listarPorId("1", "682520e98e38a049ac2ac569")).rejects.toThrow(Error);
      expect(mockCustomError).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatusCodes.NOT_FOUND.code,
          customMessage: messages.error.resourceNotFound("Equipamento"),
        })
      );
    });

    it("deve lançar erro se equipamento inativo e usuário não for o proprietário", async () => {
      const mockEquipamento = makeEquipamento({ equiStatus: false, equiUsuario: "outroUsuario" });
      mockEquipamentoRepositoryInstance.listarPorId.mockResolvedValue(mockEquipamento);

      await expect(equipamentoService.listarPorId("1", "682520e98e38a049ac2ac569")).rejects.toThrow(Error);
      expect(mockCustomError).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatusCodes.FORBIDDEN.code,
          customMessage: "Equipamento não disponível para visualização.",
        })
      );
    });
  });

  describe("atualizar", () => {
    const mockEquipamento = makeEquipamento({ equiStatus: true });
    const mockDadosAtualizados = { equiValorDiaria: 150, equiQuantidadeDisponivel: 10 };

    beforeEach(() => {
      mockEquipamentoRepositoryInstance.listarPorId.mockResolvedValue(mockEquipamento);
      mockEquipamentoRepositoryInstance.atualizar.mockResolvedValue({ ...mockEquipamento, ...mockDadosAtualizados });
    });

    it("deve atualizar equipamento com dados válidos", async () => {
      const resultado = await equipamentoService.atualizar("1", mockDadosAtualizados);

      expect(mockEquipamentoRepositoryInstance.listarPorId).toHaveBeenCalledWith("1");
      expect(mockEquipamentoRepositoryInstance.atualizar).toHaveBeenCalledWith("1", mockDadosAtualizados);
      expect(resultado).toEqual({ ...mockEquipamento, ...mockDadosAtualizados });
    });

    it("deve permitir ativar equipamento inativo apenas com equiStatus", async () => {
      const equipamentoInativo = makeEquipamento({ equiStatus: false });
      mockEquipamentoRepositoryInstance.listarPorId.mockResolvedValue(equipamentoInativo);
      const dadosAtivacao = { equiStatus: true };

      mockEquipamentoRepositoryInstance.atualizar.mockResolvedValue({
        ...equipamentoInativo,
        ...dadosAtivacao,
      });

      const resultado = await equipamentoService.atualizar("1", dadosAtivacao);

      expect(mockEquipamentoRepositoryInstance.atualizar).toHaveBeenCalledWith("1", dadosAtivacao);
      expect(resultado).toEqual({ ...equipamentoInativo, ...dadosAtivacao });
    });

    it("deve lançar erro se equipamento não for encontrado", async () => {
      mockEquipamentoRepositoryInstance.listarPorId.mockResolvedValue(null);

      await expect(equipamentoService.atualizar("1", mockDadosAtualizados)).rejects.toThrow(Error);
      expect(mockCustomError).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatusCodes.NOT_FOUND.code,
          customMessage: messages.error.resourceNotFound("Equipamento"),
        })
      );
    });

    it("deve lançar erro se tentar atualizar equipamento inativo com outros campos", async () => {
      const equipamentoInativo = makeEquipamento({ equiStatus: false });
      mockEquipamentoRepositoryInstance.listarPorId.mockResolvedValue(equipamentoInativo);

      await expect(equipamentoService.atualizar("1", mockDadosAtualizados)).rejects.toThrow(Error);
      expect(mockCustomError).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatusCodes.FORBIDDEN.code,
          customMessage: "Equipamento inativo. Não é possível atualizar.",
        })
      );
    });

    it("deve lançar erro se tentar atualizar campos não permitidos", async () => {
      const dadosInvalidos = { ...mockDadosAtualizados, equiNome: "Novo Nome" };

      await expect(equipamentoService.atualizar("1", dadosInvalidos)).rejects.toThrow(Error);
      expect(mockCustomError).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatusCodes.BAD_REQUEST.code,
          customMessage: expect.stringContaining("Não é permitido alterar os seguintes campos: equiNome"),
        })
      );
    });

    it("deve lançar erro inesperado do repository", async () => {
      mockEquipamentoRepositoryInstance.atualizar.mockRejectedValue(new Error("Erro de banco de dados"));
      await expect(equipamentoService.atualizar("1", mockDadosAtualizados)).rejects.toThrow("Erro de banco de dados");
    });
  });

  describe("deletar", () => {
    const mockEquipamento = makeEquipamento({ equiStatus: true });

    beforeEach(() => {
      mockEquipamentoRepositoryInstance.listarPorId.mockResolvedValue(mockEquipamento);
      mockEquipamentoRepositoryInstance.deletar.mockResolvedValue({ message: "Equipamento deletado" });
    });

    it("deve deletar equipamento com sucesso", async () => {
      const resultado = await equipamentoService.deletar("1");

      expect(mockEquipamentoRepositoryInstance.listarPorId).toHaveBeenCalledWith("1");
      expect(mockEquipamentoRepositoryInstance.deletar).toHaveBeenCalledWith("1");
      expect(resultado).toEqual({ message: "Equipamento deletado" });
    });

    it("deve lançar erro se equipamento não for encontrado", async () => {
      mockEquipamentoRepositoryInstance.listarPorId.mockResolvedValue(null);

      await expect(equipamentoService.deletar("1")).rejects.toThrow(Error);
      expect(mockCustomError).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatusCodes.NOT_FOUND.code,
          customMessage: messages.error.resourceNotFound("Equipamento"),
        })
      );
    });

    it("deve lançar erro se equipamento tiver locações ativas", async () => {
      mockEquipamentoRepositoryInstance.deletar.mockRejectedValue(
        new CustomError({
          statusCode: HttpStatusCodes.CONFLICT.code,
          customMessage: "Não é possível excluir equipamento com locações ativas.",
        })
      );

      await expect(equipamentoService.deletar("1")).rejects.toThrow(Error);
      expect(mockCustomError).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatusCodes.CONFLICT.code,
          customMessage: "Não é possível excluir equipamento com locações ativas.",
        })
      );
    });

    it("deve lançar erro inesperado do repository", async () => {
      mockEquipamentoRepositoryInstance.deletar.mockRejectedValue(new Error("Erro de banco de dados"));
      await expect(equipamentoService.deletar("1")).rejects.toThrow("Erro de banco de dados");
    });
  });

  describe("Métodos auxiliares", () => {
    describe("_processarFiltros", () => {
      it("deve processar filtros corretamente com valores válidos", async () => {
        const filtros = { page: "2", limit: "20", categoria: "maquinas", status: "false", minValor: "50", maxValor: "200" };
        const resultado = await equipamentoService._processarFiltros(filtros);

        expect(mockEquipamentoFilterBuilderInstance.comCategoria).toHaveBeenCalledWith("maquinas");
        expect(mockEquipamentoFilterBuilderInstance.comStatus).toHaveBeenCalledWith(false);
        expect(mockEquipamentoFilterBuilderInstance.comFaixaDeValor).toHaveBeenCalledWith("50", "200");
        expect(mockEquipamentoFilterBuilderInstance.build).toHaveBeenCalled();
        expect(resultado).toEqual({ query: {}, pagina: 2, limite: 20 });
      });

      it("deve usar valores padrão para página e limite se não fornecidos", async () => {
        const filtros = { categoria: "maquinas" };
        const resultado = await equipamentoService._processarFiltros(filtros);

        expect(resultado.pagina).toBe(1);
        expect(resultado.limite).toBe(10);
      });

      it("deve tratar status como true por padrão se valor inválido", async () => {
        const filtros = { status: "invalido" };
        const resultado = await equipamentoService._processarFiltros(filtros);

        expect(mockEquipamentoFilterBuilderInstance.comStatus).toHaveBeenCalledWith(true);
      });
    });

    describe("_buscarEquipamentoExistente", () => {
      it("deve retornar equipamento se encontrado", async () => {
        const mockEquipamento = makeEquipamento();
        mockEquipamentoRepositoryInstance.listarPorId.mockResolvedValue(mockEquipamento);

        const resultado = await equipamentoService._buscarEquipamentoExistente("1");

        expect(mockEquipamentoRepositoryInstance.listarPorId).toHaveBeenCalledWith("1");
        expect(resultado).toEqual(mockEquipamento);
      });

      it("deve lançar erro se equipamento não for encontrado", async () => {
        mockEquipamentoRepositoryInstance.listarPorId.mockResolvedValue(null);

        await expect(equipamentoService._buscarEquipamentoExistente("1")).rejects.toThrow(Error);
        expect(mockCustomError).toHaveBeenCalledWith(
          expect.objectContaining({
            statusCode: HttpStatusCodes.NOT_FOUND.code,
            customMessage: messages.error.resourceNotFound("Equipamento"),
          })
        );
      });
    });

    describe("_verificarAtualizacaoPermitida", () => {
      const mockEquipamento = makeEquipamento({ equiStatus: true });

      it("deve permitir atualização de campos válidos", () => {
        const dadosAtualizados = { equiValorDiaria: 150, equiQuantidadeDisponivel: 10 };
        expect(() => equipamentoService._verificarAtualizacaoPermitida(mockEquipamento, dadosAtualizados)).not.toThrow();
      });

      it("deve permitir ativar equipamento inativo apenas com equiStatus", () => {
        const equipamentoInativo = makeEquipamento({ equiStatus: false });
        const dadosAtualizados = { equiStatus: true };
        expect(() => equipamentoService._verificarAtualizacaoPermitida(equipamentoInativo, dadosAtualizados)).not.toThrow();
      });

      it("deve lançar erro se tentar atualizar equipamento inativo com outros campos", () => {
        const equipamentoInativo = makeEquipamento({ equiStatus: false });
        const dadosAtualizados = { equiValorDiaria: 150 };

        expect(() => equipamentoService._verificarAtualizacaoPermitida(equipamentoInativo, dadosAtualizados)).toThrow(Error);
        expect(mockCustomError).toHaveBeenCalledWith(
          expect.objectContaining({
            statusCode: HttpStatusCodes.FORBIDDEN.code,
            customMessage: "Equipamento inativo. Não é possível atualizar.",
          })
        );
      });

      it("deve lançar erro se tentar atualizar campos não permitidos", () => {
        const dadosAtualizados = { equiNome: "Novo Nome" };

        expect(() => equipamentoService._verificarAtualizacaoPermitida(mockEquipamento, dadosAtualizados)).toThrow(Error);
        expect(mockCustomError).toHaveBeenCalledWith(
          expect.objectContaining({
            statusCode: HttpStatusCodes.BAD_REQUEST.code,
            customMessage: expect.stringContaining("Não é permitido alterar os seguintes campos: equiNome"),
          })
        );
      });
    });
  });
});