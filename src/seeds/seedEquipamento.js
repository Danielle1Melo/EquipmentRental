import getGlobalFakeMapping from "./globalFakermapping.js";
//import mongoose from "mongoose";
import Equipamento from "../models/Equipamento.js";
import Usuario from "../models/Usuario.js";
//import DbConnect from "../config/DbConnect.js";



async function SeedEquipamentos(usuario, enderecos, avaliacoes) {

  await Equipamento.deleteMany();


  const fake = await getGlobalFakeMapping();

  const categoriasValidas = [
    "Furadeira",
    "Serra Elétrica",
    "Multímetro",
    "Parafusadeira",
    "Lixadeira",
    "Compressor de Ar",
    "Soldador",
    "Betoneira"
  ];

  const equipamentos = []

    for(let i = 0; i < usuario.length; i++){
    equipamentos.push({
      nome: fake.nome(),
      descricao:fake.descricao(),
      valorDiaria: fake.valorDiaria(),
      quantidadeDisponivel:fake.quantidadeDisponivel(),
      categoria: categoriasValidas[Math.floor(Math.random() * categoriasValidas.length)],
      status: fake.status(),
      usuario:{_id:usuario[i]._id},
      endereco: { _id: enderecos[i]._id },
      foto: fake.foto(),
      notaMediaAvaliacao: {_id: avaliacoes[i]._id}
    });

  }

  await Equipamento.collection.insertMany(equipamentos)
  
  console.log(`${Equipamento.length} Equipamentos inseridos com sucesso!`)

  return await Equipamento.find();
}


export default SeedEquipamentos;

