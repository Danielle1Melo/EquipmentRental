import { equipamentoSchema, equipamentoUpdateSchema } from '../../../utils/validators/schemas/zod/EquipamentoSchema';
import { z } from 'zod';
import mongoose from 'mongoose';

describe('equipamentoSchema', () => {
    const objectId = new mongoose.Types.ObjectId().toString();

    it('deve validar dados válidos corretamente', () => {
        const dadosValidos = {
            equiNome: 'Furadeira Bosch',
            equiDescricao: 'Furadeira de impacto 700W',
            equiValorDiaria: 50,
            equiQuantidadeDisponivel: 5,
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto1.jpg'],
        };
        const resultado = equipamentoSchema.parse(dadosValidos);
        expect(resultado.equiNome).toBe('Furadeira Bosch');
        expect(resultado.equiDescricao).toBe('Furadeira de impacto 700W');
        expect(resultado.equiValorDiaria).toBe(50);
        expect(resultado.equiQuantidadeDisponivel).toBe(5);
        expect(resultado.equiCategoria).toBe('Furadeira');
        expect(resultado.equiFoto).toEqual(['https://example.com/foto1.jpg']);
    });

    it('deve lançar erro quando "equiNome" está ausente', () => {
        const dadosInvalidos = {
            equiDescricao: 'Furadeira de impacto 700W',
            equiValorDiaria: 50,
            equiQuantidadeDisponivel: 5,
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto1.jpg'],
        };
        expect(() => equipamentoSchema.parse(dadosInvalidos)).toThrow('Nome obrigatório');
    });

    it('deve lançar erro quando "equiNome" é muito curto', () => {
        const dadosInvalidos = {
            equiNome: 'F',
            equiDescricao: 'Furadeira de impacto 700W',
            equiValorDiaria: 50,
            equiQuantidadeDisponivel: 5,
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto1.jpg'],
        };
        expect(() => equipamentoSchema.parse(dadosInvalidos)).toThrow('Nome obrigatório');
    });

    it('deve lançar erro quando "equiDescricao" está ausente', () => {
        const dadosInvalidos = {
            equiNome: 'Furadeira Bosch',
            equiValorDiaria: 50,
            equiQuantidadeDisponivel: 5,
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto1.jpg'],
        };
        expect(() => equipamentoSchema.parse(dadosInvalidos)).toThrow('Descrição obrigatória');
    });

    it('deve lançar erro quando "equiValorDiaria" não é número', () => {
        const dadosInvalidos = {
            equiNome: 'Furadeira Bosch',
            equiDescricao: 'Furadeira de impacto 700W',
            equiValorDiaria: 'cinquenta',
            equiQuantidadeDisponivel: 5,
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto1.jpg'],
        };
        expect(() => equipamentoSchema.parse(dadosInvalidos)).toThrow('Valor da diária deve ser um número');
    });

    it('deve lançar erro quando "equiQuantidadeDisponivel" não é número', () => {
        const dadosInvalidos = {
            equiNome: 'Furadeira Bosch',
            equiDescricao: 'Furadeira de impacto 700W',
            equiValorDiaria: 50,
            equiQuantidadeDisponivel: 'cinco',
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto1.jpg'],
        };
        expect(() => equipamentoSchema.parse(dadosInvalidos)).toThrow('Quantidade deve ser um número');
    });

    it('deve lançar erro quando "equiCategoria" não é válida', () => {
        const dadosInvalidos = {
            equiNome: 'Furadeira Bosch',
            equiDescricao: 'Furadeira de impacto 700W',
            equiValorDiaria: 50,
            equiQuantidadeDisponivel: 5,
            equiCategoria: 'Invalida',
            equiFoto: ['https://example.com/foto1.jpg'],
        };
        expect(() => equipamentoSchema.parse(dadosInvalidos)).toThrow('Invalid enum value');
    });

    it('deve lançar erro quando "equiFoto" está vazio', () => {
        const dadosInvalidos = {
            equiNome: 'Furadeira Bosch',
            equiDescricao: 'Furadeira de impacto 700W',
            equiValorDiaria: 50,
            equiQuantidadeDisponivel: 5,
            equiCategoria: 'Furadeira',
            equiFoto: [],
        };
        expect(() => equipamentoSchema.parse(dadosInvalidos)).toThrow('Pelo menos uma foto é obrigatória');
    });

    it('deve lançar erro quando "equiFoto" contém URL inválida', () => {
        const dadosInvalidos = {
            equiNome: 'Furadeira Bosch',
            equiDescricao: 'Furadeira de impacto 700W',
            equiValorDiaria: 50,
            equiQuantidadeDisponivel: 5,
            equiCategoria: 'Furadeira',
            equiFoto: ['foto_invalida'],
        };
        expect(() => equipamentoSchema.parse(dadosInvalidos)).toThrow('Cada item deve ser uma URL válida');
    });
});

describe('equipamentoUpdateSchema', () => {
    it('deve validar dados parciais corretamente', () => {
        const dadosParciais = {
            equiValorDiaria: 60,
        };
        const resultado = equipamentoUpdateSchema.parse(dadosParciais);
        expect(resultado.equiValorDiaria).toBe(60);
        expect(resultado.equiQuantidadeDisponivel).toBeUndefined();
        expect(resultado.equiStatus).toBeUndefined();
    });

    it('deve aceitar objeto vazio e manter campos indefinidos', () => {
        const resultado = equipamentoUpdateSchema.parse({});
        expect(resultado.equiValorDiaria).toBeUndefined();
        expect(resultado.equiQuantidadeDisponivel).toBeUndefined();
        expect(resultado.equiStatus).toBeUndefined();
    });

    it('deve lançar erro quando "equiValorDiaria" não é número positivo', () => {
        const dadosInvalidos = {
            equiValorDiaria: -10,
        };
        expect(() => equipamentoUpdateSchema.parse(dadosInvalidos)).toThrow('Number must be greater than 0');
    });

    it('deve lançar erro quando "equiQuantidadeDisponivel" não é número inteiro não negativo', () => {
        const dadosInvalidos = {
            equiQuantidadeDisponivel: -5,
        };
        expect(() => equipamentoUpdateSchema.parse(dadosInvalidos)).toThrow('Number must be greater than or equal to 0');
    });

    it('deve lançar erro quando "equiStatus" não é booleano', () => {
        const dadosInvalidos = {
            equiStatus: 'ativo',
        };
        expect(() => equipamentoUpdateSchema.parse(dadosInvalidos)).toThrow('Expected boolean');
    });

    it('deve lançar erro quando campos não permitidos são fornecidos', () => {
        const dadosInvalidos = {
            equiNome: 'Furadeira Bosch',
        };
        expect(() => equipamentoUpdateSchema.parse(dadosInvalidos)).toThrow('Unrecognized key(s) in object: \'equiNome\'');
    });
});