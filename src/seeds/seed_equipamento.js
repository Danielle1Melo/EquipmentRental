// import mongoose from "mongoose";
// import Equipamento from "../models/Equipamento.js";
// import Usuario from "../models/Usuario.js";
// import DbConnect from "../config/Dbconnect.js";
// import getGlobalFakeMapping from "./globalFakermapping.js";
// //import logger from "../utils/logger.js";


// await DbConnect.conectar();

// async function SeedEquipamentos() {
//   await Equipamento.deleteMany();

//   const usuario = await Usuario.findOne();

//   if (!usuario) {
//     console.error("Nenhum usuário encontrado. Execute o seed de usuários primeiro.");
//     return;
//   }

//   const fake = getGlobalFakeMapping.Equipamento;

//   const categoriasValidas = [
//     "Furadeira",
//     "Serra Elétrica",
//     "Multímetro",
//     "Parafusadeira",
//     "Lixadeira",
//     "Compressor de Ar",
//     "Soldador",
//     "Betoneira"
//   ];

//   const equipamentos = Array.from({ length: 10 }).map(() => ({
//     nome: fake.nome(),
//     descricao: fake.descricao(),
//     valor: fake.valor(),
//     categoria: fake.random.arrayElement
//       ? fake.random.arrayElement(categoriasValidas)
//       : fake.helpers.arrayElement(categoriasValidas), 
//     foto: fake.foto(),
//     quantidade: fake.quantidadeDisponivel(),
//     notaMedia: 0,
//     status: fake.status(),
//     fkUsuarioId: usuario._id,
//     aprovado: false,
//     //avaliacaoPkAvalId: [] // adicionar isso quando   tiver avaliações a vincular no equipamento 
//   }));

//   await Equipamento.insertMany(equipamentos);
//   console.log("Equipamentos inseridos com sucesso!");
// }

// SeedEquipamentos();

import mongoose from "mongoose";
import Equipamento from "../models/Equipamento.js";
import Usuario from "../models/Usuario.js";
import DbConnect from "../config/Dbconnect.js";

await DbConnect.conectar();

async function SeedEquipamentos() {
  await Equipamento.deleteMany();

  const usuario = await Usuario.findOne();

  if (!usuario) {
    console.error("Nenhum usuário encontrado. Execute o seed de usuários primeiro.");
    return;
  }

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

  const equipamentos = Array.from({ length: 10 }).map((_, i) => ({
    nome: `Equipamento ${i + 1}`,
    descricao: `Descrição do equipamento ${i + 1}`,
    valor: (i + 1) * 10,
    categoria: categoriasValidas[i % categoriasValidas.length],
    foto: `https://example.com/foto${i + 1}.jpg`,
    quantidade: Math.floor(Math.random() * 10) + 1,
    notaMedia: 0,
    status: "disponível",
    fkUsuarioId: usuario._id,
    aprovado: false
  }));

  await Equipamento.insertMany(equipamentos);
  console.log("Equipamentos inseridos com sucesso!");
}

SeedEquipamentos();

