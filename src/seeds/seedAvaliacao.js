import Avaliacao from "../models/Avaliacao.js"
import DbConnect from "../config/DbConnect.js"
import Usuario from "../models/Usuario.js"

import getGlobalFakeMapping from "./globalFakeMapping.js"
import Equipamento from "../models/Equipamento.js"


async function SeedAvaliacao(usuarios, equipamentos) {
  await Avaliacao.deleteMany()

  const fake = await getGlobalFakeMapping()
  const avaliacoes = []

  for (let i = 0; i < equipamentos.length; i++) {
    const usuario = usuarios[i % usuarios.length]
    const nota = fake.nota()
    const descricao = fake.descricao()

    const avaliacao = await Avaliacao.create({
      nota,
      descricao,
      usuarios: usuario._id,
      equipamentos: equipamentos[i]._id
    })

    avaliacoes.push(avaliacao)

    await Equipamento.findByIdAndUpdate(
      equipamentos[i]._id,
      { $push: { equiAvaliacoes: avaliacao._id } }
    )
  }

  for (const equipamento of equipamentos) {
    const equipamentoPopulado = await Equipamento.findById(equipamento._id).populate("equiAvaliacoes")
    const notas = equipamentoPopulado.equiAvaliacoes.map(av => av.nota)
    const media = notas.reduce((a, b) => a + b, 0) / notas.length || 0

    await Equipamento.findByIdAndUpdate(
      equipamento._id,
      { equiNotaMediaAvaliacao: media.toFixed(1) }
    )
  }

  // console.log(`${avaliacoes.length} avaliações inseridas com sucesso!`)
  return avaliacoes
}

export default SeedAvaliacao
