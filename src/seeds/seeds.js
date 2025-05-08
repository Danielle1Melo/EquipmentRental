import "dotenv/config";
import mongoose from "mongoose";

import { faker } from "@faker-js/faker";

import DbConnect from "../config/dbconnect.js";

// Models principais
// import Reserva from "../models/Reserva.js";
import Usuario from "../models/Usuario.js";
import Avaliacao from "../models/Avaliacao.js";
// import Equipamento from "../models/Equipamento.js";
// import Endereco from "../models/Endereco.js";


import SeedReserva from "./seedReserva.js"
import SeedUsuario from "./seedUsuario.js"
import SeedAvaliacao from "./seed_avaliacao.js"

await DbConnect.conectar();

async function main(){
    try {
        // await SeedReserva();
        const usuario = await SeedUsuario();
        await SeedAvaliacao(usuario)

        console.log(">>> SEED FINALIZADO COM SUCESSO! <<<");
      } catch (err) {
        console.error("Erro ao executar SEED:", err);
      } finally {
        mongoose.connection.close();
        process.exit(0);
      }
}

main();

