import Avaliacao from "../models/Avaliacao.js"
import DbConnect from "../config/DbConnect.js"
import Usuario from "../models/Usuario.js"
import { faker } from "@faker-js/faker"
import getGlobalFakeMapping from "./globalFakermapping.js"


async function SeedAvaliacao(usuario) {
    await Avaliacao.deleteMany()
    const avaliacoes = []
    const fake =  await getGlobalFakeMapping()
    for(let i = 0; i < usuario.length; i++){
        const avalDescricao = fake.descricao();
        const notaMedia = fake.nota()

        avaliacoes.push({
            avalDescricao,
            notaMedia,
            usuarioId:{_id:usuario[i]._id}
        })
    }

    await Avaliacao.collection.insertMany(avaliacoes)
    console.log(`${avaliacoes.length} avaliaçoes inseridas com sucesso!`);
    return await Avaliacao.find()
}

export default SeedAvaliacao
