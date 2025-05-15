import mongoose from "mongoose";
import Reserva from "../models/Reserva.js";
import DbConnect from "../config/Dbconnect.js";
import getGlobalFakeMapping from "./globalFakermapping.js";
import Usuario from "../models/Usuario.js";
import Equipamento from "../models/Equipamento.js";

await DbConnect.conectar();

async function SeedReserva() {
  await Reserva.deleteMany();

  const globalFakeMapping = await getGlobalFakeMapping();
  
  const reservas = [];

  const usuarios = await Usuario.find()
  const equipamentos = await Equipamento.find()

  if (usuarios.length === 0) {
    throw new Error("Nenhum usuário encontrado. Rode o seed de usuários primeiro.");
  }

  if (equipamentos.length === 0) {
    throw new Error("Nenhum equipamento encontrado. Rode o seed de equipamentos primeiro.");
  }

  const usuarioAleatorio = usuarios[Math.floor(Math.random() * usuarios.length )];
  const equipamentoAleatorio = equipamentos[Math.floor(Math.random() * equipamentos.length )]
  
  for (let i = 0; i <= 10; i++) {
    reservas.push({
        dataInicial: globalFakeMapping.dataInicial(),
        dataFinal: globalFakeMapping.dataFinal(),
        dataFinalAtrasada: globalFakeMapping.dataFinalAtrasada(),
        quantidadeEquipamento: globalFakeMapping.quantidadeEquipamento(),
        valorEquipamento: globalFakeMapping.valorEquipamento(),
        enderecoEquipamento: globalFakeMapping.enderecoEquipamento(),
        status: globalFakeMapping.status(),
        equipamento: [equipamentoAleatorio._id],
        usuario: [usuarioAleatorio._id]
    });
}

  const resultados = await Reserva.collection.insertMany(reservas);
  console.log(Object.keys(resultados.insertedIds).length + "Reservas concluídas!");
  
  return Reserva.find();
}  


export default SeedReserva;
