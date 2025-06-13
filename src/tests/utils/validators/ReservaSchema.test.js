import { ReservaSchema } from '../../../utils/validators/schemas/zod/ReservaSchema.js';
import { z } from 'zod';
import mongoose from 'mongoose';

describe('ReservaSchema', () => {
  let reservaSchema;

  beforeEach(() => {
    reservaSchema = ReservaSchema;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parse', () => {
    it('deve validar todos os dados da reserva sem retornar erro', () => {
      const mockData = {
        dataInicial: '2025-06-01',
        dataFinal: '2025-06-05',
        dataFinalAtrasada: '2025-06-06',
        valorEquipamento: 100.5,
        quantidadeEquipamento: 2,
        enderecoEquipamento: 'Rua Exemplo, 123',
        statusReserva: 'pendente',
        equipamento: new mongoose.Types.ObjectId().toString(),
        usuario: new mongoose.Types.ObjectId().toString(),
      };

      const resultado = reservaSchema.parse(mockData);
      expect(resultado).toEqual({
        ...mockData,
        dataInicial: new Date(mockData.dataInicial),
        dataFinal: new Date(mockData.dataFinal),
        dataFinalAtrasada: new Date(mockData.dataFinalAtrasada),
        equipamento: mockData.equipamento,
        usuario: mockData.usuario,
      });
    });
  });

  describe('dataInicial', () => {
    it('deve validar uma data inicial válida', () => {
      const schema = reservaSchema.partial();
      const dataValida = { dataInicial: '2025-06-01' };
      const resultado = schema.parse(dataValida);
      expect(resultado.dataInicial).toEqual(new Date('2025-06-01'));
    });

    it('deve retornar erro para data inicial inválida', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { dataInicial: '2025-13-01' };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Data inicial inválida');
    });

    it('deve retornar erro se dataInicial estiver ausente', async () => {
      const schema = reservaSchema;
      const dataInvalida = {
        dataFinal: '2025-06-05',
        valorEquipamento: 100,
        quantidadeEquipamento: 1,
        enderecoEquipamento: 'Rua Exemplo, 123',
      };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Required');
    });
  });

  describe('dataFinal', () => {
    it('deve validar uma data final válida', () => {
      const schema = reservaSchema.partial();
      const dataValida = { dataFinal: '2025-06-05' };
      const resultado = schema.parse(dataValida);
      expect(resultado.dataFinal).toEqual(new Date('2025-06-05'));
    });

    it('deve retornar erro para data final inválida', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { dataFinal: '2025-13-05' };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Data final inválida');
    });

    it('deve retornar erro se dataFinal estiver ausente', async () => {
      const schema = reservaSchema;
      const dataInvalida = {
        dataInicial: '2025-06-01',
        valorEquipamento: 100,
        quantidadeEquipamento: 1,
        enderecoEquipamento: 'Rua Exemplo, 123',
      };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Required');
    });
  });

  describe('dataFinalAtrasada', () => {
    it('deve validar uma data final atrasada válida', () => {
      const schema = reservaSchema.partial();
      const dataValida = { dataFinalAtrasada: '2025-06-06' };
      const resultado = schema.parse(dataValida);
      expect(resultado.dataFinalAtrasada).toEqual(new Date('2025-06-06'));
    });

    it('deve aceitar dataFinalAtrasada como opcional', () => {
      const schema = reservaSchema.partial();
      const dataValida = {};
      const resultado = schema.parse(dataValida);
      expect(resultado.dataFinalAtrasada).toBeUndefined();
    });

    it('deve retornar erro para data final atrasada inválida', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { dataFinalAtrasada: '2025-13-06' };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Data final atrasada inválida');
    });

  });

  describe('valorEquipamento', () => {
    it('deve validar um valor de equipamento válido', () => {
      const schema = reservaSchema.partial();
      const dataValida = { valorEquipamento: 100.5 };
      const resultado = schema.parse(dataValida);
      expect(resultado).toEqual(dataValida);
    });

    it('deve retornar erro para valor de equipamento não positivo', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { valorEquipamento: -10 };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Valor do equipamento deve ser um número positivo');
    });

    it('deve retornar erro se valorEquipamento não for número', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { valorEquipamento: 'abc' };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Expected number');
    });

    it('deve retornar erro se valorEquipamento estiver ausente', async () => {
      const schema = reservaSchema;
      const dataInvalida = {
        dataInicial: '2025-06-01',
        dataFinal: '2025-06-05',
        quantidadeEquipamento: 1,
        enderecoEquipamento: 'Rua Exemplo, 123',
      };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Required');
    });
  });

    describe('quantidadeEquipamento', () => {
    it('deve validar uma quantidade de equipamento válida', () => {
        const schema = reservaSchema.partial();
        const dataValida = { quantidadeEquipamento: 2 };
        const resultado = schema.parse(dataValida);
        expect(resultado).toEqual(dataValida);
    });

    it('deve retornar erro para quantidade de equipamento não inteira', async () => {
        const schema = reservaSchema.partial();
        const dataInvalida = { quantidadeEquipamento: 2.5 };
        await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Quantidade de equipamento deve ser um número inteiro');
    });

    it('deve retornar erro para quantidade de equipamento menor que 1', async () => {
        const schema = reservaSchema.partial();
        const dataInvalida = { quantidadeEquipamento: 0 };
        await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Quantidade de equipamento deve ser no mínimo 1');
    });

    it('deve retornar erro se quantidadeEquipamento não for número', async () => {
        const schema = reservaSchema.partial();
        const dataInvalida = { quantidadeEquipamento: 'abc' };
        await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Expected number');
    });

    it('deve retornar erro se quantidadeEquipamento estiver ausente', async () => {
        const schema = reservaSchema;
        const dataInvalida = {
        dataInicial: '2025-06-01',
        dataFinal: '2025-06-05',
        valorEquipamento: 100,
        enderecoEquipamento: 'Rua Exemplo, 123',
        equipamento: new mongoose.Types.ObjectId().toString(),
        usuario: new mongoose.Types.ObjectId().toString(),
        };
        await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Required');
    });
    });

  describe('enderecoEquipamento', () => {
    it('deve validar um endereço de equipamento válido', () => {
      const schema = reservaSchema.partial();
      const dataValida = { enderecoEquipamento: 'Rua Exemplo, 123' };
      const resultado = schema.parse(dataValida);
      expect(resultado).toEqual(dataValida);
    });

    it('deve retornar erro para endereço de equipamento vazio', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { enderecoEquipamento: '' };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Endereço do equipamento é obrigatório');
    });

    it('deve retornar erro se enderecoEquipamento não for string', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { enderecoEquipamento: 123 };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Expected string');
    });

    it('deve retornar erro se enderecoEquipamento estiver ausente', async () => {
      const schema = reservaSchema;
      const dataInvalida = {
        dataInicial: '2025-06-01',
        dataFinal: '2025-06-05',
        valorEquipamento: 100,
        quantidadeEquipamento: 1,
      };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Required');
    });
  });

  describe('statusReserva', () => {
    it('deve validar status pendente', () => {
      const schema = reservaSchema.partial();
      const dataValida = { statusReserva: 'pendente' };
      const resultado = schema.parse(dataValida);
      expect(resultado).toEqual(dataValida);
    });

    it('deve validar status confirmada', () => {
      const schema = reservaSchema.partial();
      const dataValida = { statusReserva: 'confirmada' };
      const resultado = schema.parse(dataValida);
      expect(resultado).toEqual(dataValida);
    });

    it('deve validar status cancelada', () => {
      const schema = reservaSchema.partial();
      const dataValida = { statusReserva: 'cancelada' };
      const resultado = schema.parse(dataValida);
      expect(resultado).toEqual(dataValida);
    });

    it('deve retornar erro para status inválido', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { statusReserva: 'invalido' };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow(
        "Invalid enum value. Expected 'pendente' | 'confirmada' | 'cancelada' | 'finalizada' | 'atrasada'"
      );
    });

  });

describe('equipamento', () => {
    it('deve validar um ObjectId válido', () => {
      const schema = reservaSchema.partial();
      const dataValida = { equipamento: new mongoose.Types.ObjectId().toString() };
      const resultado = schema.parse(dataValida);
      expect(resultado).toEqual(dataValida);
    });

    it('deve retornar erro se equipamento estiver ausente', async () => {
      const schema = reservaSchema;
      const dataInvalida = {
        dataInicial: '2025-06-01',
        dataFinal: '2025-06-05',
        valorEquipamento: 100,
        quantidadeEquipamento: 1,
        enderecoEquipamento: 'Rua Exemplo, 123',
        usuario: new mongoose.Types.ObjectId().toString(),
      };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Required');
    });

    it('deve retornar erro para ObjectId inválido', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { equipamento: 'invalid-id' };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Invalid MongoDB ObjectId');
    });

    it('deve retornar erro se equipamento não for string', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { equipamento: 123 };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Expected string');
    });
  });

  describe('usuario', () => {
    it('deve validar um ObjectId válido', () => {
      const schema = reservaSchema.partial();
      const dataValida = { usuario: new mongoose.Types.ObjectId().toString() };
      const resultado = schema.parse(dataValida);
      expect(resultado).toEqual(dataValida);
    });

    it('deve retornar erro se usuario estiver ausente', async () => {
      const schema = reservaSchema;
      const dataInvalida = {
        dataInicial: '2025-06-01',
        dataFinal: '2025-06-05',
        valorEquipamento: 100,
        quantidadeEquipamento: 1,
        enderecoEquipamento: 'Rua Exemplo, 123',
        equipamento: new mongoose.Types.ObjectId().toString(),
      };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Required');
    });

    it('deve retornar erro para ObjectId inválido', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { usuario: 'invalid-id' };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Invalid MongoDB ObjectId');
    });

    it('deve retornar erro se usuario não for string', async () => {
      const schema = reservaSchema.partial();
      const dataInvalida = { usuario: 123 };
      await expect(schema.parseAsync(dataInvalida)).rejects.toThrow('Expected string');
    });
  });
});