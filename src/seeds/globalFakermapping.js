import fakebr from 'faker-br';
//import { fa } from 'faker-br/lib/locales';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import loadModels from './loadModels.js';

//173

const fakeMappings = {
    common: {

    },

    Usuario: {
        nome: () => fakebr.name.firstName(),
        sobrenome: () => fakebr.name.lastName(),
        email: () => fakebr.internet.email(),
        telefone: () => fakebr.phone.phoneNumber(),
        senha: () => fakebr.internet.password(),
        dataNascimento: () => fakebr.date.paste(),
        cpf: () => fakebr.br.cpf(),
        notaMediaAvaliacao: () => fakebr.random.number({ min: 0, max: 10 }),
        status: () => fakebr.random.arrayElement(['ativo', 'inativo']),
        tipoUsuario: () => fakebr.random.arrayElement(['admin', 'usuario']),
        
    }, 

    Endereco: {
        rua: () => fakebr.address.streetName(),
        numero: () => fakebr.random.number({ min: 1, max: 1000 }),
        complemento: () => fakebr.address.secondaryAddress(),
        bairro: () => fakebr.address.county(),
        cidade: () => fakebr.address.city(),
        estado: () => fakebr.address.stateAbbr(),
        cep: () => fakebr.address.zipCode(),
    },

    Reserva: {
      dataInicial: () => fakebr.date.past(),
      dataFinal: () => fakebr.date.future(),
      dataFinalAtrasada: () => fakebr.date.future(),
      quantidadeEquipamento: () => fakebr.random.number({ min: 1, max: 10 }),
      valorEquipamento: () => fakebr.random.number({ min: 100, max: 1000 }),
      enderecoEquipamento: () => fakebr.address.streetAddress(),
      status: () => fakebr.random.arrayElement(['pendente', 'confirmada', 'cancelada']),
      equipamento: [{_id: new mongoose.Types.ObjectId().toString}],
      usuario: [{_id: new mongoose.Types.ObjectId().toString}],
    }, 

    Avaliacao: {
      nota: () => fakebr.random.number({ min: 1, max: 5 }),
      descricao: () => fakebr.lorem.sentence(),
      dataAvaliacao: () => fakebr.date.past(),
      usuario: [{_id: new mongoose.Types.ObjectId().toString}]
    }, 

    Equipamento: {
      nome: () => fakebr.commerce.productName(),
      descricao: () => fakebr.lorem.sentence(),
      valorDiaria: () => fakebr.random.number({ min: 10, max: 100 }),
      quantidadeDisponivel: () => fakebr.random.number({ min: 1, max: 50 }),
      categoria: () => fakebr.commerce.department(),
      status: () => fakebr.random.arrayElement(['disponível', 'indisponível']),
      foto: () => fakebr.image.imageUrl(),
      notaMediaAvaliacao: () => fakebr.random.number({ min: 0, max: 10 }),
    }
}

/**
 * Retorna o mapping global, consolidando os mappings comuns e específicos.
 * Nesta versão automatizada, carregamos os models e combinamos o mapping comum com o mapping específico de cada model.
 */
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
  
  /**
   * Função auxiliar para extrair os nomes dos campos de um schema,
   * considerando apenas os níveis superiores (campos aninhados são verificados pela parte antes do ponto).
   */
  function getSchemaFieldNames(schema) {
    const fieldNames = new Set();
    Object.keys(schema.paths).forEach((key) => {
      if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return;
      const topLevel = key.split('.')[0];
      fieldNames.add(topLevel);
    });
    return Array.from(fieldNames);
  }
  
  /**
   * Valida se o mapping fornecido cobre todos os campos do model.
   * Retorna um array com os nomes dos campos que estiverem faltando.
   */
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
  
  /**
   * Executa a validação para os models fornecidos, utilizando o mapping específico de cada um.
   */
  async function validateAllMappings() {
    const models = await loadModels();
    let totalMissing = {};
  
    models.forEach(({ model, name }) => {
      // Combina os campos comuns com os específicos de cada model
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
  
  // Executa a validação antes de prosseguir com o seeding ou outras operações
  validateAllMappings()
    .then((valid) => {
      if (valid) {
        console.log('Podemos acessar globalFakeMapping com segurança.');
        // Prossegue com o seeding ou outras operações
      } else {
        throw new Error('globalFakeMapping não possui todos os mapeamentos necessários.');
      }
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

export default getGlobalFakeMapping;