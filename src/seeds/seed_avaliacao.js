import Avaliacao from "../models/Avaliacao.js"
import DbConnect from "../config/Dbconnect.js"
import Usuario from "../models/Usuario.js"
import { faker } from "@faker-js/faker"


async function SeedAvaliacao(usuario) {
    await Avaliacao.deleteMany()
    const avaliacoes = []

    for(let i = 0; i < usuario.length; i++){
        const avalDescricao = faker.lorem.paragraph({min:1, max: 5});
        const notaMedia = faker.number.int({min: 1, max: 5})

        avaliacoes.push({
            avalDescricao,
            notaMedia,
            usuarioId:{_id:usuario[i]._id}
        })
    }

    await Avaliacao.collection.insertMany(avaliacoes)
    console.log(`${avaliacoes.length} avaliaçoes inseridas com sucesso!`);
}

export default SeedAvaliacao