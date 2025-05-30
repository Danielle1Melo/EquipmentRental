const { equipamentoSchema, equipamentoUpdateSchema } = require('../../../utils/validators/schemas/zod/EquipamentoSchema');
const mongoose = require('mongoose');

describe('equipamentoSchema', () => {
    const objectId = new mongoose.Types.ObjectId().toString();

    it('valida dados válidos corretamente', () => {
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
    });

    it('erro quando "equiNome" está ausente', () => {
        const dados = {
            equiDescricao: 'Furadeira',
            equiValorDiaria: 50,
            equiQuantidadeDisponivel: 5,
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto1.jpg'],
        };
        expect(() => equipamentoSchema.parse(dados)).toThrow('Nome obrigatório');
    });

    it('erro quando "equiNome" é muito curto', () => {
        const dados = {
            equiNome: 'F',
            equiDescricao: 'desc',
            equiValorDiaria: 10,
            equiQuantidadeDisponivel: 1,
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto.jpg'],
        };
        expect(() => equipamentoSchema.parse(dados)).toThrow('Nome deve ter pelo menos 2 caracteres');
    });

    it('erro quando "equiDescricao" está ausente', () => {
        const dados = {
            equiNome: 'Item',
            equiValorDiaria: 50,
            equiQuantidadeDisponivel: 5,
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto.jpg'],
        };
        expect(() => equipamentoSchema.parse(dados)).toThrow('Descrição obrigatória');
    });

    it('erro se "equiValorDiaria" não for número', () => {
        const dados = {
            equiNome: 'Furadeira',
            equiDescricao: 'desc',
            equiValorDiaria: 'abc',
            equiQuantidadeDisponivel: 1,
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto.jpg'],
        };
        expect(() => equipamentoSchema.parse(dados)).toThrow('Valor da diária deve ser um número');
    });

    it('erro se "equiQuantidadeDisponivel" não for número', () => {
        const dados = {
            equiNome: 'Furadeira',
            equiDescricao: 'desc',
            equiValorDiaria: 10,
            equiQuantidadeDisponivel: 'abc',
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto.jpg'],
        };
        expect(() => equipamentoSchema.parse(dados)).toThrow('Quantidade deve ser um número');
    });

    it('erro se "equiCategoria" for inválida', () => {
        const dados = {
            equiNome: 'Furadeira',
            equiDescricao: 'desc',
            equiValorDiaria: 10,
            equiQuantidadeDisponivel: 1,
            equiCategoria: 'Invalida',
            equiFoto: ['https://example.com/foto.jpg'],
        };
        expect(() => equipamentoSchema.parse(dados)).toThrow('Categoria inválida');
    });

    it('erro se "equiFoto" for vazio', () => {
        const dados = {
            equiNome: 'Furadeira',
            equiDescricao: 'desc',
            equiValorDiaria: 10,
            equiQuantidadeDisponivel: 1,
            equiCategoria: 'Furadeira',
            equiFoto: [],
        };
        expect(() => equipamentoSchema.parse(dados)).toThrow('Pelo menos uma foto é obrigatória');
    });

    it('erro se "equiFoto" tiver URL inválida', () => {
        const dados = {
            equiNome: 'Furadeira',
            equiDescricao: 'desc',
            equiValorDiaria: 10,
            equiQuantidadeDisponivel: 1,
            equiCategoria: 'Furadeira',
            equiFoto: ['não-é-url'],
        };
        expect(() => equipamentoSchema.parse(dados)).toThrow('Cada item deve ser uma URL válida');
    });
});

describe('equipamentoUpdateSchema', () => {
    it('valida atualização parcial', () => {
        const dados = {
            equiValorDiaria: 100,
        };
        const resultado = equipamentoUpdateSchema.parse(dados);
        expect(resultado.equiValorDiaria).toBe(100);
    });

    it('aceita objeto vazio', () => {
        const resultado = equipamentoUpdateSchema.parse({});
        expect(resultado).toEqual({});
    });

    it('erro se "equiValorDiaria" for negativa', () => {
        expect(() => equipamentoUpdateSchema.parse({ equiValorDiaria: -1 }))
            .toThrow('Number must be greater than 0');
    });

    it('erro se "equiQuantidadeDisponivel" for negativa', () => {
        expect(() => equipamentoUpdateSchema.parse({ equiQuantidadeDisponivel: -1 }))
            .toThrow('Number must be greater than or equal to 0');
    });

    it('erro se "equiStatus" não for booleano', () => {
        expect(() => equipamentoUpdateSchema.parse({ equiStatus: 'true' }))
            .toThrow('Expected boolean');
    });

    it('erro se enviar campo não permitido', () => {
        expect(() => equipamentoUpdateSchema.parse({ equiNome: 'Algo' }))
            .toThrow("Unrecognized key(s) in object: 'equiNome'");
    });
});
