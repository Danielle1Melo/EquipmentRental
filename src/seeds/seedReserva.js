import mongoose from "mongoose";
import Reserva from "../models/Reserva.js";
import DbConnect from "../config/Dbconnect.js";
import getGlobalFakeMapping from "./globalFakermapping.js"

await DbConnect.conectar();

async function SeedReserva() {
  await Reserva.deleteMany();

  const globalFakeMapping = await getGlobalFakeMapping();
  
  const reservas = [];
  
  for (let i = 0; i <= 10; i++) {
    reservas.push({
        dataInicial: globalFakeMapping.dataInicial(),
        dataFinal: globalFakeMapping.dataFinal(),
        dataFinalAtrasada: globalFakeMapping.dataFinalAtrasada(),
        quantidadeEquipamento: globalFakeMapping.quantidadeEquipamento(),
        valorEquipamento: globalFakeMapping.valorEquipamento(),
        enderecoEquipamento: globalFakeMapping.enderecoEquipamento(),
        status: globalFakeMapping.status(),
    });
}

  const resultados = await Reserva.collection.insertMany(reservas);
  console.log(Object.keys(resultados.insertedIds).length + "Reservas concluídas!");
  
  return Reserva.find();
}  


export default SeedReserva;
