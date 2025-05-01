import fakebr from 'faker-br';
import { fa } from 'faker-br/lib/locales';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

//173

const fakeMappings = {
    common: {
        
    },

    Usuario: {
        id: () => new mongoose.Types.ObjectId().toString(),
        nome: () => fakebr.name.firstName(),
        sobrenome: () => fakebr.name.lastName(),
        email: () => fakebr.internet.email(),
        telefone: () => fakebr.phone.phoneNumber(),
        senha: () => fakebr.internet.password(),
        dataNascimento: () => fakebr.date.paste(),
        cpf: () => fakebr.br.cpf(),
        notaMediaAvaliação: () => fakebr.random.number({ min: 0, max: 10 }),
        status: () => fakebr.random.arrayElement(['ativo', 'inativo']),
        tipoUsuario: () => fakebr.random.arrayElement(['admin', 'usuario']),
    }
}