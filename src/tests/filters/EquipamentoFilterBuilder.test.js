import EquipamentoFilterBuilder from '../../repositories/filters/EquipamentoFilterBuilder';

jest.mock('../../models/Equipamento.js', () => {
    return 'mock-equipamento-model';
});

jest.mock('mongoose', () => {
    return {
        Types: {
            ObjectId: {
                isValid: jest.fn()
            }
        },
        Schema: {
            Types: {
                ObjectId: 'ObjectId'
            }
        }
    };
});

import mongoose from 'mongoose';

describe('EquipamentoFilterBuilder', () => {
    let equipamentoFilterBuilder;

    beforeEach(() => {
        jest.clearAllMocks();
        equipamentoFilterBuilder = new EquipamentoFilterBuilder();
    });

    describe('constructor', () => {
        test('deve inicializar com filtros vazios', () => {
            expect(equipamentoFilterBuilder.filtros).toEqual({});
        });
    });

    describe('comCategoria', () => {
        test('deve adicionar filtro de categoria quando categoria é fornecida', () => {
            const categoria = 'Furadeira';
            const resultado = equipamentoFilterBuilder.comCategoria(categoria);

            expect(equipamentoFilterBuilder.filtros.equiCategoria).toBe('Furadeira');
            expect(resultado).toBe(equipamentoFilterBuilder);
        });

        test('não deve adicionar filtro quando categoria é undefined', () => {
            const resultado = equipamentoFilterBuilder.comCategoria(undefined);

            expect(equipamentoFilterBuilder.filtros.equiCategoria).toBeUndefined();
            expect(resultado).toBe(equipamentoFilterBuilder);
        });

        test('não deve adicionar filtro quando categoria é null', () => {
            const resultado = equipamentoFilterBuilder.comCategoria(null);

            expect(equipamentoFilterBuilder.filtros.equiCategoria).toBeUndefined();
            expect(resultado).toBe(equipamentoFilterBuilder);
        });

        test('não deve adicionar filtro quando categoria é string vazia', () => {
            const resultado = equipamentoFilterBuilder.comCategoria('');

            expect(equipamentoFilterBuilder.filtros.equiCategoria).toBeUndefined();
            expect(resultado).toBe(equipamentoFilterBuilder);
        });
    });

    describe('comStatus', () => {
        test('deve adicionar filtro de status quando status é true', () => {
            const resultado = equipamentoFilterBuilder.comStatus(true);

            expect(equipamentoFilterBuilder.filtros.equiStatus).toBe(true);
            expect(resultado).toBe(equipamentoFilterBuilder);
        });

        test('não deve adicionar filtro quando status não é booleano', () => {
            const resultado = equipamentoFilterBuilder.comStatus('true');

            expect(equipamentoFilterBuilder.filtros.equiStatus).toBeUndefined();
            expect(resultado).toBe(equipamentoFilterBuilder);
        });

        test('não deve adicionar filtro quando status é undefined', () => {
            const resultado = equipamentoFilterBuilder.comStatus(undefined);

            expect(equipamentoFilterBuilder.filtros.equiStatus).toBeUndefined();
            expect(resultado).toBe(equipamentoFilterBuilder);
        });

        test('não deve adicionar filtro quando status é null', () => {
            const resultado = equipamentoFilterBuilder.comStatus(null);

            expect(equipamentoFilterBuilder.filtros.equiStatus).toBeUndefined();
            expect(resultado).toBe(equipamentoFilterBuilder);
        });
    });

    describe('comFaixaDeValor', () => {
        test('deve adicionar filtro com apenas minValor quando maxValor é undefined', () => {
            const resultado = equipamentoFilterBuilder.comFaixaDeValor(50, undefined);

            expect(equipamentoFilterBuilder.filtros.equiValorDiaria).toEqual({ $gte: 50 });
            expect(resultado).toBe(equipamentoFilterBuilder);
        });

        test('deve adicionar filtro com apenas maxValor quando minValor é undefined', () => {
            const resultado = equipamentoFilterBuilder.comFaixaDeValor(undefined, 100);

            expect(equipamentoFilterBuilder.filtros.equiValorDiaria).toEqual({ $lte: 100 });
            expect(resultado).toBe(equipamentoFilterBuilder);
        });

        test('deve adicionar filtro com minValor e maxValor quando ambos são fornecidos', () => {
            const resultado = equipamentoFilterBuilder.comFaixaDeValor(50, 100);

            expect(equipamentoFilterBuilder.filtros.equiValorDiaria).toEqual({ $gte: 50, $lte: 100 });
            expect(resultado).toBe(equipamentoFilterBuilder);
        });

        test('não deve adicionar filtro quando minValor e maxValor são undefined', () => {
            const resultado = equipamentoFilterBuilder.comFaixaDeValor(undefined, undefined);

            expect(equipamentoFilterBuilder.filtros.equiValorDiaria).toBeUndefined();
            expect(resultado).toBe(equipamentoFilterBuilder);
        });

        test('deve converter valores para números quando minValor e maxValor são strings numéricas', () => {
            const resultado = equipamentoFilterBuilder.comFaixaDeValor('50', '100');

            expect(equipamentoFilterBuilder.filtros.equiValorDiaria).toEqual({ $gte: 50, $lte: 100 });
            expect(resultado).toBe(equipamentoFilterBuilder);
        });

        test('deve lidar com strings numéricas com espaços', () => {
            const resultado = equipamentoFilterBuilder.comFaixaDeValor(' 50 ', ' 100 ');

            expect(equipamentoFilterBuilder.filtros.equiValorDiaria).toEqual({ $gte: 50, $lte: 100 });
            expect(resultado).toBe(equipamentoFilterBuilder);
        });
    });

    describe('build', () => {
        test('deve retornar filtros vazios quando nenhum filtro foi adicionado', () => {
            const filtros = equipamentoFilterBuilder.build();

            expect(filtros).toEqual({});
        });

        test('deve retornar filtro de categoria quando foi adicionado', () => {
            equipamentoFilterBuilder.comCategoria('Furadeira');
            const filtros = equipamentoFilterBuilder.build();

            expect(filtros).toEqual({
                equiCategoria: 'Furadeira'
            });
        });

        test('deve retornar filtro de status quando foi adicionado', () => {
            equipamentoFilterBuilder.comStatus(true);
            const filtros = equipamentoFilterBuilder.build();

            expect(filtros).toEqual({
                equiStatus: true
            });
        });

        test('deve retornar filtro de faixa de valor quando foi adicionado', () => {
            equipamentoFilterBuilder.comFaixaDeValor(50, 100);
            const filtros = equipamentoFilterBuilder.build();

            expect(filtros).toEqual({
                equiValorDiaria: { $gte: 50, $lte: 100 }
            });
        });

        test('deve retornar todos os filtros adicionados corretamente', () => {
            equipamentoFilterBuilder
                .comCategoria('Furadeira')
                .comStatus(true)
                .comFaixaDeValor(50, 100);

            const filtros = equipamentoFilterBuilder.build();

            expect(filtros).toEqual({
                equiCategoria: 'Furadeira',
                equiStatus: true,
                equiValorDiaria: { $gte: 50, $lte: 100 }
            });
        });
    });

    describe('Encadeamento de métodos', () => {
        test('deve permitir encadear múltiplos métodos síncronos e construir filtros corretamente', () => {
            const filtros = equipamentoFilterBuilder
                .comCategoria('Furadeira')
                .comStatus(true)
                .comFaixaDeValor(50, 100)
                .build();

            expect(filtros).toEqual({
                equiCategoria: 'Furadeira',
                equiStatus: true,
                equiValorDiaria: { $gte: 50, $lte: 100 }
            });
        });
    });
});