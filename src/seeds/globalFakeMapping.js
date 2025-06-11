import fakebr from 'faker-br';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import loadModels from './loadModels.js';
import { gerarDataAleatoria } from '../utils/helpers/randomPastDate.js';

const fakeMappings = {
  common: {},
  Usuario: {
    nome: () => fakebr.name.firstName() + " " + fakebr.name.lastName(),
    email: () => fakebr.internet.email(),
    telefone: () => fakebr.phone.phoneNumber(),
    senha: () => fakebr.internet.password(),
    dataNascimento: () => gerarDataAleatoria(),
    CPF: () => fakebr.br.cpf(),
    notaMediaAvaliacao: () => fakebr.random.number({ min: 0, max: 10 }),
    status: () => fakebr.random.arrayElement(['ativo', 'inativo']),
    tipoUsuario: () => fakebr.random.arrayElement(['admin', 'usuario']),
    fotoUsuario: () => fakebr.internet.avatar(),
  },
  Endereco: {
    endeLogradouro: () => fakebr.address.streetName(),
    endeNumero: () => fakebr.random.number({ min: 1, max: 1000 }),
    endeBairro: () => fakebr.address.county(),
    endeUf: () => fakebr.address.stateAbbr(),
    endeCep: () => fakebr.address.zipCode(),
    endeCidade: () => fakebr.address.city(),
    endeComplemento: () => fakebr.address.secondaryAddress(),
    usuario: () => new mongoose.Types.ObjectId().toString(),
  },
  Reserva: {
    dataInicial: () => fakebr.date.past(),
    dataFinal: () => fakebr.date.future(),
    dataFinalAtrasada: () => fakebr.date.future(),
    quantidadeEquipamento: () => fakebr.random.number({ min: 1, max: 10 }),
    valorEquipamento: () => fakebr.random.number({ min: 100, max: 1000 }),
    enderecoEquipamento: () => fakebr.address.streetAddress(),
    statusReserva: () => fakebr.random.arrayElement(['pendente', 'confirmada', 'cancelada']),
    equipamentos: () => [new mongoose.Types.ObjectId().toString()],
    usuarios: () => [new mongoose.Types.ObjectId().toString()],
  },
  Avaliacao: {
    nota: () => fakebr.random.number({ min: 1, max: 5 }),
    descricao: () => fakebr.lorem.sentence(),
    dataAvaliacao: () => fakebr.date.past(),
    usuario: () => [new mongoose.Types.ObjectId().toString()],
    equipamento: () => [new mongoose.Types.ObjectId().toString()],
  },
  Equipamento: {
    motivosReprovacao: [
      "Fotos de baixa qualidade",
      "Descrição insuficiente ou incompleta",
      "Equipamento não atende aos padrões de segurança",
      "Informações de preço inconsistentes",
      "Equipamento danificado nas fotos",
    ],
    equiNome: () => fakebr.random.arrayElement([
      "Furadeira Bosch",
      "Parafusadeira Makita",
      "Serra Circular Dewalt",
      "Lixadeira Orbital Black+Decker",
      "Compressor Schulz",
      "Multímetro Digital ICEL",
      "Betoneira CSM 400L",
      "Soldador Inversor Vonder",
    ]),
    equiDescricao: () => fakebr.lorem.sentence(),
    equiValorDiaria: () => fakebr.random.number({ min: 10, max: 100 }),
    equiQuantidadeDisponivel: () => fakebr.random.number({ min: 1, max: 50 }),
    equiCategoria: () => fakebr.random.arrayElement([
      "Furadeira",
      "Serra Elétrica",
      "Multímetro",
      "Parafusadeira",
      "Lixadeira",
      "Compressor de Ar",
      "Soldador",
      "Betoneira",
    ]),
    equiStatus: () => fakebr.random.arrayElement(['pendente', 'ativo', 'inativo']),
    equiUsuario: () => new mongoose.Types.ObjectId().toString(),
    equiFoto: () => [
      fakebr.image.imageUrl(),
      fakebr.image.imageUrl(),
      fakebr.image.imageUrl(),
    ],
    equiNotaMediaAvaliacao: () => 0,
    equiAvaliacoes: () => [],
  },
};

export async function getGlobalFakeMapping() {
  const models = await loadModels();
  let globalMapping = { ...fakeMappings.common };

  models.forEach(({ name }) => {
    if (fakeMappings[name]) {
      globalMapping = {
        ...globalMapping,
        ...fakeMappings[name],
      };
    }
  });

  return globalMapping;
}

function getSchemaFieldNames(schema) {
  const fieldNames = new Set();
  Object.keys(schema.paths).forEach((key) => {
    if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return;
    const topLevel = key.split('.')[0];
    fieldNames.add(topLevel);
  });
  return Array.from(fieldNames);
}

function validateModelMapping(model, modelName, mapping) {
  const fields = getSchemaFieldNames(model.schema);
  const missing = fields.filter((field) => !(field in mapping));
  if (missing.length > 0) {
    console.error(
      `Model ${modelName} está faltando mapeamento para os campos: ${missing.join(', ')}`
    );
  } else {
    console.log(`Model ${modelName} possui mapeamento para todos os campos.`);
  }
  return missing;
}

async function validateAllMappings() {
  const models = await loadModels();
  let totalMissing = {};

  models.forEach(({ model, name }) => {
    const mapping = {
      ...fakeMappings.common,
      ...(fakeMappings[name] || {}),
    };
    const missing = validateModelMapping(model, name, mapping);
    if (missing.length > 0) {
      totalMissing[name] = missing;
    }
  });

  if (Object.keys(totalMissing).length === 0) {
    console.log('globalFakeMapping cobre todos os campos de todos os models.');
    return true;
  } else {
    console.warn('Faltam mapeamentos para os seguintes models:', totalMissing);
    return false;
  }
}

validateAllMappings()
  .then((valid) => {
    if (valid) {
      console.log('Podemos acessar globalFakeMapping com segurança.');
    } else {
      throw new Error('globalFakeMapping não possui todos os mapeamentos necessários.');
    }
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export default getGlobalFakeMapping;