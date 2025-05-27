import mongoose from 'mongoose';
import Equipamento from '../../src/models/Equipamento.js';
import { it, expect, describe, beforeAll, afterAll } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Modelo Equipamento', () => {
  it('Deve criar um equipamento com os dados obrigatórios corretamente', async () => {
    const equipamento = new Equipamento({
      equiNome: 'Furadeira',
      equiDescricao: 'Furadeira industrial de alta potência',
      equiValorDiaria: 150,
      equiCategoria: 'Ferramentas',
      equiQuantidadeDisponivel: 5,
    });

    const saved = await equipamento.save();

    expect(saved._id).toBeDefined();
    expect(saved.equiNome).toBe('Furadeira');
    expect(saved.equiDescricao).toBe('Furadeira industrial de alta potência');
    expect(saved.equiValorDiaria).toBe(150);
    expect(saved.equiCategoria).toBe('Ferramentas');
    expect(saved.equiQuantidadeDisponivel).toBe(5);
    expect(saved.equiStatus).toBe(false);
    expect(saved.equiNotaMediaAvaliacao).toBe(0);
    expect(saved.equiAvaliacoes).toEqual([]);
    expect(saved.createdAt).toBeDefined();
    expect(saved.updatedAt).toBeDefined();
  });

  it('Deve falhar ao salvar equipamento sem nome', async () => {
    const equipamento = new Equipamento({
      equiDescricao: 'Equipamento sem nome',
      equiValorDiaria: 100,
      equiCategoria: 'Ferramentas',
      equiQuantidadeDisponivel: 3,
    });

    let error;
    try {
      await equipamento.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
    expect(error.errors.equiNome).toBeDefined();
  });

  it('Deve falhar ao salvar equipamento sem descrição', async () => {
    const equipamento = new Equipamento({
      equiNome: 'Serra elétrica',
      equiValorDiaria: 90,
      equiCategoria: 'Ferramentas',
      equiQuantidadeDisponivel: 2,
    });

    let error;
    try {
      await equipamento.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
    expect(error.errors.equiDescricao).toBeDefined();
  });

  it('Deve definir status como false por padrão', async () => {
    const equipamento = new Equipamento({
      equiNome: 'Betoneira',
      equiDescricao: 'Betoneira de 400 litros',
      equiValorDiaria: 200,
      equiCategoria: 'Construção',
      equiQuantidadeDisponivel: 1,
    });

    const saved = await equipamento.save();
    expect(saved.equiStatus).toBe(false);
  });

  it('Deve permitir salvar equipamento sem foto e sem avaliações', async () => {
    const equipamento = new Equipamento({
      equiNome: 'Martelo Pneumático',
      equiDescricao: 'Martelo de impacto para obras pesadas',
      equiValorDiaria: 120,
      equiCategoria: 'Ferramentas',
      equiQuantidadeDisponivel: 2,
    });

    const saved = await equipamento.save();

    expect(saved.equiFoto).toBeUndefined();
    expect(saved.equiAvaliacoes.length).toBe(0);
  });

  it('Deve criar equipamento com campo equiNotaMediaAvaliacao como 0 por padrão', async () => {
    const equipamento = new Equipamento({
      equiNome: 'Compressor de Ar',
      equiDescricao: 'Compressor de ar industrial 50L',
      equiValorDiaria: 180,
      equiCategoria: 'Industrial',
      equiQuantidadeDisponivel: 3,
    });

    const saved = await equipamento.save();

    expect(saved.equiNotaMediaAvaliacao).toBe(0);
  });
});
