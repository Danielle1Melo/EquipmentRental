import { EquipamentoIdSchema, EquipamentoQuerySchema } from '../../../../utils/validators/schemas/zod/querys/EquipamentoQuerySchema';
import mongoose from 'mongoose';

describe('EquipamentoQuerySchema', () => {
  let equipamentoIdSchema;
  let equipamentoQuerySchema;

  beforeEach(() => {
    equipamentoIdSchema = EquipamentoIdSchema;
    equipamentoQuerySchema = EquipamentoQuerySchema;
  });

  describe('EquipamentoIdSchema', () => {
    it('deve validar um ID válido', () => {
      const SchemaQueryId = equipamentoIdSchema;
      const IdValido = '507f1f77bcf86cd799439011';
      const resultado = SchemaQueryId.parse(IdValido);
      expect(resultado).toEqual(IdValido);
    });

    it('deve retornar uma mensagem de erro para um ID inválido (menos de 24 caracteres)', async () => {
      const SchemaQueryId = equipamentoIdSchema;
      const IdInvalido = '507f1f77bcf86cd7994390';
      await expect(SchemaQueryId.parseAsync(IdInvalido)).rejects.toThrow('ID inválido');
    });

    it('deve retornar uma mensagem de erro para um ID com caracteres inválidos', async () => {
      const SchemaQueryId = equipamentoIdSchema;
      const IdInvalido = '507f1f77bcf86cd79943901g';
      await expect(SchemaQueryId.parseAsync(IdInvalido)).rejects.toThrow('ID inválido');
    });

    it('deve retornar uma mensagem de erro para um ID ausente', async () => {
      const SchemaQueryId = equipamentoIdSchema;
      const IdInvalido = '';
      await expect(SchemaQueryId.parseAsync(IdInvalido)).rejects.toThrow('ID inválido');
    });
  });

  describe('Categoria', () => {
    it('deve validar uma categoria', () => {
      const SchemaQueryCategoria = equipamentoQuerySchema.partial();
      const CategoriaValida = { categoria: 'Furadeira' };
      const resultado = SchemaQueryCategoria.parse(CategoriaValida);
      expect(resultado).toEqual(CategoriaValida);
    });

    it('deve aceitar ausência de categoria', () => {
      const SchemaQueryCategoria = equipamentoQuerySchema.partial();
      const resultado = SchemaQueryCategoria.parse({});
      expect(resultado.categoria).toBeUndefined();
    });
  });

  describe('Status', () => {
    it('deve validar um status válido', () => {
      const SchemaQueryStatus = equipamentoQuerySchema.partial();
      const StatusValido = { status: 'true' };
      const resultado = SchemaQueryStatus.parse(StatusValido);
      expect(resultado).toEqual({ status: true });
    });

    it('deve retornar um status válido para string não booleana', () => {
      const SchemaQueryStatus = equipamentoQuerySchema.partial();
      const StatusInvalido = { status: 'invalido' };
      const resultado = SchemaQueryStatus.parse(StatusInvalido);
      expect(resultado).toEqual({ status: true });
    });

    it('deve aceitar ausência de status', () => {
      const SchemaQueryStatus = equipamentoQuerySchema.partial();
      const resultado = SchemaQueryStatus.parse({});
      expect(resultado.status).toBeUndefined();
    });
  });

  describe('MinValor', () => {
    it('deve validar um valor mínimo válido', () => {
      const SchemaQueryMinValor = equipamentoQuerySchema.partial();
      const MinValorValido = { minValor: '10' };
      const resultado = SchemaQueryMinValor.parse(MinValorValido);
      expect(resultado).toEqual({ minValor: 10 });
    });

    it('deve retornar uma mensagem de erro para um valor mínimo negativo', async () => {
      const SchemaQueryMinValor = equipamentoQuerySchema.partial();
      const MinValorInvalido = { minValor: '-1' };
      await expect(SchemaQueryMinValor.parseAsync(MinValorInvalido)).rejects.toThrow(`Valor deve ser um número inteiro maior que 0`);
    });

    it('deve retornar uma mensagem de erro para um valor mínimo inválido', async () => {
      const SchemaQueryMinValor = equipamentoQuerySchema.partial();
      const MinValorInvalido = { minValor: 'abc' };
      await expect(SchemaQueryMinValor.parseAsync(MinValorInvalido)).rejects.toThrow(`Page deve ser um número inteiro maior que 0`);
    });

    it('deve aceitar ausência de minValor', () => {
      const SchemaQueryMinValor = equipamentoQuerySchema.partial();
      const resultado = SchemaQueryMinValor.parse({});
      expect(resultado.minValor).toBeUndefined();
    });
  });

  describe('MaxValor', () => {
    it('deve validar um valor máximo válido', () => {
      const SchemaQueryMaxValor = equipamentoQuerySchema.partial();
      const MaxValorValido = { maxValor: '100' };
      const resultado = SchemaQueryMaxValor.parse(MaxValorValido);
      expect(resultado).toEqual({ maxValor: 100 });
    });

    it('deve retornar uma mensagem de erro para um valor máximo negativo', async () => {
      const SchemaQueryMaxValor = equipamentoQuerySchema.partial();
      const MaxValorInvalido = { maxValor: '-1' };
      await expect(SchemaQueryMaxValor.parseAsync(MaxValorInvalido)).rejects.toThrow('O valor máximo deve ser maior ou igual a 0');
    });

    it('deve retornar uma mensagem de erro para um valor máximo inválido', async () => {
      const SchemaQueryMaxValor = equipamentoQuerySchema.partial();
      const MaxValorInvalido = { maxValor: 'abc' };
      await expect(SchemaQueryMaxValor.parseAsync(MaxValorInvalido)).rejects.toThrow('O valor deve ser um número válido');
    });

    it('deve aceitar ausência de maxValor', () => {
      const SchemaQueryMaxValor = equipamentoQuerySchema.partial();
      const resultado = SchemaQueryMaxValor.parse({});
      expect(resultado.maxValor).toBeUndefined();
    });
  });

  describe('Page', () => {
    it('deve validar uma página válida', () => {
      const SchemaQueryPage = equipamentoQuerySchema.partial();
      const PaginaValida = { page: '2' };
      const resultado = SchemaQueryPage.parse(PaginaValida);
      expect(resultado).toEqual({ page: 2 });
    });

    it('deve retornar uma mensagem de erro para uma página inválida', async () => {
      const SchemaQueryPage = equipamentoQuerySchema.partial();
      const PaginaInvalida = { page: '0' };
      await expect(SchemaQueryPage.parseAsync(PaginaInvalida)).rejects.toThrow('A página deve ser um número inteiro maior que 0');
    });

    it('deve retornar uma mensagem de erro para uma página não numérica', async () => {
      const SchemaQueryPage = equipamentoQuerySchema.partial();
      const PaginaInvalida = { page: 'abc' };
      await expect(SchemaQueryPage.parseAsync(PaginaInvalida)).rejects.toThrow('O valor deve ser um número válido');
    });

    it('deve aceitar ausência de page', () => {
      const SchemaQueryPage = equipamentoQuerySchema.partial();
      const resultado = SchemaQueryPage.parse({});
      expect(resultado.page).toBeUndefined();
    });
  });

  describe('Limit', () => {
    it('deve validar um limite válido', () => {
      const SchemaQueryLimit = equipamentoQuerySchema.partial();
      const LimiteValido = { limit: '50' };
      const resultado = SchemaQueryLimit.parse(LimiteValido);
      expect(resultado).toEqual({ limit: 50 });
    });

    it('deve retornar uma mensagem de erro para um limite maior que 100', async () => {
      const SchemaQueryLimit = equipamentoQuerySchema.partial();
      const LimiteInvalido = { limit: '101' };
      await expect(SchemaQueryLimit.parseAsync(LimiteInvalido)).rejects.toThrow('O limite deve ser um número inteiro menor ou igual a 100');
    });

    it('deve retornar uma mensagem de erro para um limite menor que 1', async () => {
      const SchemaQueryLimit = equipamentoQuerySchema.partial();
      const LimiteInvalido = { limit: '0' };
      await expect(SchemaQueryLimit.parseAsync(LimiteInvalido)).rejects.toThrow('O limite deve ser um número inteiro maior que 0');
    });

    it('deve retornar uma mensagem de erro para um limite não numérico', async () => {
      const SchemaQueryLimit = equipamentoQuerySchema.partial();
      const LimiteInvalido = { limit: 'abc' };
      await expect(SchemaQueryLimit.parseAsync(LimiteInvalido)).rejects.toThrow('O valor deve ser um número válido');
    });

    it('deve aceitar ausência de limit', () => {
      const SchemaQueryLimit = equipamentoQuerySchema.partial();
      const resultado = SchemaQueryLimit.parse({});
      expect(resultado.limit).toBeUndefined();
    });
  });
});