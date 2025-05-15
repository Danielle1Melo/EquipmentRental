import Avaliacao from "../models/Avaliacao.js"
import DbConnect from "../config/Dbconnect.js"
import Usuario from "../models/Usuario.js"
import getGlobalFakeMapping from "./globalFakeMapping.js"



async function SeedAvaliacao(usuario) {
    await Avaliacao.deleteMany()
    const avaliacoes = []
    const fake =  await getGlobalFakeMapping()
    for(let i = 0; i < usuario.length; i++){
        const descricao = fake.descricao();
        const nota = fake.nota()
        const dataAvaliacao = fake.dataAvaliacao()


        avaliacoes.push({
            descricao,
            nota,
            usuarioId:{_id:usuario[i]._id},
            dataAvaliacao
        })
    }

    await Avaliacao.collection.insertMany(avaliacoes)
    console.log(`${avaliacoes.length} avaliaçoes inseridas com sucesso!`);

    return await Avaliacao.find()
}

export default SeedAvaliacao
