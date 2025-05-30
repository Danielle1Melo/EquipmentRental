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
        let erroCapturado;
        try {
            equipamentoSchema.parse(dados);
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe('Nome obrigatório');
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
        let erroCapturado;
        try {
            equipamentoSchema.parse(dados);
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe('Nome deve ter pelo menos 2 caracteres');
    });

    it('erro quando "equiDescricao" está ausente', () => {
        const dados = {
            equiNome: 'Item',
            equiValorDiaria: 50,
            equiQuantidadeDisponivel: 5,
            equiCategoria: 'Furadeira',
            equiFoto: ['https://example.com/foto.jpg'],
        };
        let erroCapturado;
        try {
            equipamentoSchema.parse(dados);
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe('Descrição obrigatória');
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
        let erroCapturado;
        try {
            equipamentoSchema.parse(dados);
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe('Valor da diária deve ser um número');
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
        let erroCapturado;
        try {
            equipamentoSchema.parse(dados);
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe('Quantidade deve ser um número');
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
        let erroCapturado;
        try {
            equipamentoSchema.parse(dados);
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe('Categoria inválida');
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
        let erroCapturado;
        try {
            equipamentoSchema.parse(dados);
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe('Pelo menos uma foto é obrigatória');
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
        let erroCapturado;
        try {
            equipamentoSchema.parse(dados);
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe('Cada item deve ser uma URL válida');
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
        let erroCapturado;
        try {
            equipamentoUpdateSchema.parse({ equiValorDiaria: -1 });
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe('Valor da diária deve ser maior que 0');
    });

    it('erro se "equiQuantidadeDisponivel" for negativa', () => {
        let erroCapturado;
        try {
            equipamentoUpdateSchema.parse({ equiQuantidadeDisponivel: -1 });
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe('Quantidade disponível deve ser maior ou igual a 0');
    });

    it('erro se "equiStatus" não for booleano', () => {
        let erroCapturado;
        try {
            equipamentoUpdateSchema.parse({ equiStatus: 'true' });
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe('Status deve ser um valor booleano');
    });

    it('erro se enviar campo não permitido', () => {
        let erroCapturado;
        try {
            equipamentoUpdateSchema.parse({ equiNome: 'Algo' });
        } catch (erro) {
            erroCapturado = erro;
        }
        expect(erroCapturado.errors[0].message).toBe("Campos não permitidos no objeto");
    });
});