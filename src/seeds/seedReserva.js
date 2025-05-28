import mongoose from "mongoose";
import Reserva from "../models/Reserva.js";
import DbConnect from "../config/Dbconnect.js";
import getGlobalFakeMapping from "./globalFakeMapping.js";

await DbConnect.conectar();

async function SeedReserva(usuarios, equipamentos) {
  try {
    await Reserva.deleteMany();
    console.log("Coleção de reservas limpa.");

    const globalFakeMapping = await getGlobalFakeMapping();
    const reservas = [];

    if (usuarios.length === 0) {
      throw new Error("Nenhum usuário encontrado. Rode o seed de usuários primeiro.");
    }

    if (equipamentos.length === 0) {
      throw new Error("Nenhum equipamento encontrado. Rode o seed de equipamentos primeiro.");
    }


    console.log("Usuários disponíveis:", usuarios.map(u => u._id.toString()));
    console.log("Equipamentos disponíveis:", equipamentos.map(e => e._id.toString()));

    for (let i = 0; i < 10; i++) {
      const usuario = usuarios[i % usuarios.length]; // Seleciona usuário ciclicamente
      const equipamento = equipamentos[i % equipamentos.length]; // Seleciona equipamento ciclicamente

      const reserva = {
        dataInicial: globalFakeMapping.dataInicial(),
        dataFinal: globalFakeMapping.dataFinal(),
        dataFinalAtrasada: globalFakeMapping.dataFinalAtrasada(),
        quantidadeEquipamento: globalFakeMapping.quantidadeEquipamento(),
        valorEquipamento: globalFakeMapping.valorEquipamento(),
        enderecoEquipamento: globalFakeMapping.enderecoEquipamento(),
        statusReserva: globalFakeMapping.statusReserva(),
        equipamento: equipamento._id, // Usa o _id do equipamento selecionado
        usuario: usuario._id // Usa o _id do usuário selecionado
      };

      console.log(`Reserva ${i + 1} gerada:`, reserva);
      reservas.push(reserva);
    }


    const resultados = await Reserva.collection.insertMany(reservas, { ordered: false, rawResult: true });
    console.log("Resultado bruto do insertMany:", resultados);
    console.log(`${Object.keys(resultados.insertedIds).length} reservas inseridas com sucesso!`);

    console.log("Nome da coleção usada:", Reserva.collection.collectionName);

    const reservasCriadas = await Reserva.find();
    console.log(`Reservas encontradas após inserção: ${reservasCriadas.length}`);
    console.log("Documentos retornados:", reservasCriadas);

    return reservasCriadas;
  } catch (error) {
    console.error("Erro ao criar reservas:", error);
    throw error;
  }
}

export default SeedReserva;