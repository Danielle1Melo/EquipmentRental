import getGlobalFakeMapping from "./globalFakermapping.js";
//import mongoose from "mongoose";
import Equipamento from "../models/Equipamento.js";
import Usuario from "../models/Usuario.js";
//import DbConnect from "../config/DbConnect.js";



async function SeedEquipamentos(usuario) {

  await Equipamento.deleteMany();

  const usuario = await Usuario.findOne();

  if (!usuario) {
    console.error("Nenhum usuário encontrado. Execute o seed de usuários primeiro.");
    return;
  }

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

    for(let i = 0; i < 5; i++){
    equipamentos.push({
      nome: fake.nome(),
      descricao:fake.descricao(),
      valorDiaria: fake.valorDiaria(),
      quantidadeDisponivel:fake.quantidadeDisponivel(),
      categoria: categoriasValidas[Math.floor(Math.random() * categoriasValidas.length)],
      status: fake.status(),
      usuario:{_id:usuario[i]._id},
      foto: fake.foto(),
      notaMediaAvaliacao: fake.notaMediaAvaliacao(),
    });

  }

  await Equipamento.collection.insertMany(equipamentos)
  
  console.log(`${Equipamento.length} Equipamentos inseridos com sucesso!`)
}



export default SeedEquipamentos;

