import { ReservaIdSchema, ReservaQuerySchema } from "../../../../utils/validators/schemas/zod/querys/ReservaQuerySchema.js";
import mongoose from "mongoose";

describe('ReservaQuerySchema', () => {
  describe('ReservaIdSchema', () => {
    it('deve validar um ID válido', () => {
      const validId = new mongoose.Types.ObjectId().toString();
      expect(() => ReservaIdSchema.parse(validId)).not.toThrow();
    });

    it('deve rejeitar um ID inválido', async () => {
      const invalidId = 'invalid-id';
      await expect(ReservaIdSchema.parseAsync(invalidId)).rejects.toThrow("ID inválido");
    });
  });

  describe('ReservaQuerySchema', () => {
    describe('equipamentoNome', () => {
      it('deve validar um nome de equipamento válido', () => {
        const validQuery = { equipamentoNome: "Equipamento 1" };
        const result = ReservaQuerySchema.partial().parse(validQuery);
        expect(result).toEqual(validQuery);
      });

      it('deve rejeitar um nome de equipamento vazio', async () => {
        const invalidQuery = { equipamentoNome: " " };
        await expect(ReservaQuerySchema.partial().parseAsync(invalidQuery))
          .rejects.toThrow("Nome do equipamento não pode ser vazio");
      });
    });

    describe('dataInicial', () => {
      it('deve validar uma data inicial válida', () => {
        const validQuery = { dataInicial: "2023-01-01" };
        const result = ReservaQuerySchema.partial().parse(validQuery);
        expect(result.dataInicial).toBeInstanceOf(Date);
      });

      it('deve rejeitar uma data inicial inválida', async () => {
        const invalidQuery = { dataInicial: "invalid-date" };
        await expect(ReservaQuerySchema.partial().parseAsync(invalidQuery))
          .rejects.toThrow("Data inicial inválida");
      });
    });

    describe('dataFinal', () => {
      it('deve validar uma data final válida', () => {
        const validQuery = { dataFinal: "2023-01-01" };
        const result = ReservaQuerySchema.partial().parse(validQuery);
        expect(result.dataFinal).toBeInstanceOf(Date);
      });

      it('deve rejeitar uma data final inválida', async () => {
        const invalidQuery = { dataFinal: "invalid-date" };
        await expect(ReservaQuerySchema.partial().parseAsync(invalidQuery))
          .rejects.toThrow("Data final inválida");
      });
    });

    describe('statusReserva', () => {
      it('deve validar um status válido', () => {
        const validStatuses = ['pendente', 'confirmada', 'cancelada'];
        
        validStatuses.forEach(status => {
          const validQuery = { statusReserva: status };
          const result = ReservaQuerySchema.partial().parse(validQuery);
          expect(result).toEqual(validQuery);
        });
      });

      it('deve rejeitar um status inválido', async () => {
        const invalidQuery = { statusReserva: "invalido" };
        await expect(ReservaQuerySchema.partial().parseAsync(invalidQuery))
          .rejects.toThrow();
      });
    });

    describe('usuarioNome', () => {
      it('deve validar um nome de usuário válido', () => {
        const validQuery = { usuarioNome: "Usuário Teste" };
        const result = ReservaQuerySchema.partial().parse(validQuery);
        expect(result).toEqual(validQuery);
      });

      it('deve rejeitar um nome de usuário vazio', async () => {
        const invalidQuery = { usuarioNome: " " };
        await expect(ReservaQuerySchema.partial().parseAsync(invalidQuery))
          .rejects.toThrow("Nome do usuário não pode ser vazio");
      });
    });

    describe('page', () => {
      it('deve validar uma página válida', () => {
        const validQuery = { page: "1" };
        const result = ReservaQuerySchema.partial().parse(validQuery);
        expect(result).toEqual({ page: 1 });
      });

      it('deve usar valor padrão 1 quando page não for fornecida', () => {
        const emptyQuery = {};
        const result = ReservaQuerySchema.parse(emptyQuery);
        expect(result.page).toBe(1);
      });

      it('deve rejeitar uma página inválida (não numérica)', async () => {
        const invalidQuery = { page: "abc" };
        await expect(ReservaQuerySchema.partial().parseAsync(invalidQuery))
          .rejects.toThrow("Page deve ser um número inteiro maior que 0");
      });

      it('deve rejeitar uma página inválida (<= 0)', async () => {
        const invalidQuery = { page: "0" };
        await expect(ReservaQuerySchema.partial().parseAsync(invalidQuery))
          .rejects.toThrow("Page deve ser um número inteiro maior que 0");
      });
    });

    describe('limite', () => {
      it('deve validar um limite válido', () => {
        const validQuery = { limite: "10" };
        const result = ReservaQuerySchema.partial().parse(validQuery);
        expect(result).toEqual({ limite: 10 });
      });

      it('deve usar valor padrão 10 quando limite não for fornecido', () => {
        const emptyQuery = {};
        const result = ReservaQuerySchema.parse(emptyQuery);
        expect(result.limite).toBe(10);
      });

      it('deve rejeitar um limite inválido (não numérico)', async () => {
        const invalidQuery = { limite: "abc" };
        await expect(ReservaQuerySchema.partial().parseAsync(invalidQuery))
          .rejects.toThrow("Limite deve ser um número inteiro entre 1 e 100");
      });

      it('deve rejeitar um limite inválido (< 1)', async () => {
        const invalidQuery = { limite: "0" };
        await expect(ReservaQuerySchema.partial().parseAsync(invalidQuery))
          .rejects.toThrow("Limite deve ser um número inteiro entre 1 e 100");
      });

      it('deve rejeitar um limite inválido (> 100)', async () => {
        const invalidQuery = { limite: "101" };
        await expect(ReservaQuerySchema.partial().parseAsync(invalidQuery))
          .rejects.toThrow("Limite deve ser um número inteiro entre 1 e 100");
      });
    });

    describe('combinação de campos', () => {
      it('deve validar uma query com múltiplos campos válidos', () => {
        const validQuery = {
          equipamentoNome: "Equipamento 1",
          dataInicial: "2023-01-01",
          dataFinal: "2023-01-10",
          statusReserva: "pendente",
          page: "2",
          limite: "20"
        };
        
        const result = ReservaQuerySchema.parse(validQuery);
        
        expect(result).toEqual({
          equipamentoNome: "Equipamento 1",
          dataInicial: new Date("2023-01-01"),
          dataFinal: new Date("2023-01-10"),
          statusReserva: "pendente",
          page: 2,
          limite: 20
        });
      });

      it('deve rejeitar uma query com múltiplos campos inválidos', async () => {
        const invalidQuery = {
          equipamentoNome: " ",
          dataInicial: "invalid-date",
          page: "0",
          limite: "200"
        };
        
        await expect(ReservaQuerySchema.parseAsync(invalidQuery)).rejects.toThrow();
      });
    });
  });
});