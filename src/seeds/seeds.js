import "dotenv/config";
import mongoose from "mongoose";

import { faker } from "@faker-js/faker";

import DbConect from "../config/DbConnect.js";

// Models principais
import Reserva from "../models/Reserva.js";
import Usuario from "../models/Usuario.js";
import Avaliacao from "../models/Avaliacao.js";
import Equipamento from "../models/Equipamento.js";
import Endereco from "../models/Endereco.js";

import SeedReserva from "./seedReserva.js"

await DbConect.conectar();

async function main(){
    try {
        await SeedReserva();

        console.log(">>> SEED FINALIZADO COM SUCESSO! <<<");
      } catch (err) {
        console.error("Erro ao executar SEED:", err);
      } finally {
        mongoose.connection.close();
        process.exit(0);
      }
}

main();

