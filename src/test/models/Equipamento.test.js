import mongoose from 'mongoose';
import Equipamento from '../../models/Equipamento.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

// Cria um servidor MongoDB em memória antes dos testes
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Desconecta e finaliza o servidor após todos os testes
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Limpa os dados após cada teste
afterEach(async () => {
  await Equipamento.deleteMany(); 
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

    // verifica se os campos foram definidos corretamente após o salvar
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
    await expect(
      new Equipamento({
        equiDescricao: 'Equipamento sem nome',
        equiValorDiaria: 100,
        equiCategoria: 'Ferramentas',
        equiQuantidadeDisponivel: 3,
      }).save()
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('Deve falhar ao salvar equipamento sem descrição', async () => {
    await expect(
      new Equipamento({
        equiNome: 'Serra elétrica',
        equiValorDiaria: 90,
        equiCategoria: 'Ferramentas',
        equiQuantidadeDisponivel: 2,
      }).save()
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  //antes de ficar ativo ele precisa passar pela aprovação
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

  //não é possivel criar uma avaliação juntos com o equipamento
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

  it('Deve retornar todos os equipamentos cadastrados', async () => {
  const e1 = new Equipamento({
    equiNome: 'Furadeira',
    equiDescricao: 'Furadeira de impacto',
    equiValorDiaria: 100,
    equiCategoria: 'Ferramentas',
    equiQuantidadeDisponivel: 3,
  });

  const e2 = new Equipamento({
    equiNome: 'Lixadeira',
    equiDescricao: 'Lixadeira orbital',
    equiValorDiaria: 80,
    equiCategoria: 'Ferramentas',
    equiQuantidadeDisponivel: 2,
  });

  await e1.save();
  await e2.save();

  const equipamentos = await Equipamento.find();

  expect(equipamentos.length).toBe(2);
  const nomes = equipamentos.map(e => e.equiNome);
  expect(nomes).toContain('Furadeira');
  expect(nomes).toContain('Lixadeira');
});
});
