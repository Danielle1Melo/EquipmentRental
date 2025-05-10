import Avaliacao from "../models/Avaliacao.js"
import DbConnect from "../config/dbconnect.js"
import Usuario from "../models/Usuario.js"
import { faker } from "@faker-js/faker"
import getGlobalFakeMapping from "./globalFakeMapping.js"




async function SeedAvaliacao(usuario) {
    await Avaliacao.deleteMany()
    const avaliacoes = []
    const fake =  await getGlobalFakeMapping()
    for(let i = 0; i < usuario.length; i++){
        const avalDescricao = fake.avalDescricao();
        const notaMedia = fake.notaMedia()

        avaliacoes.push({
            avalDescricao,
            notaMedia,
            usuarioId:{_id:usuario[i]._id}
        })
    }

    await Avaliacao.collection.insertMany(avaliacoes)
    console.log(`${avaliacoes.length} avaliaçoes inseridas com sucesso!`);
    return Avaliacao.collection.find()
}

export default SeedAvaliacao