import "dotenv/config";
import mongoose from "mongoose";

import { faker } from "@faker-js/faker";

import DbConnect from "../config/Dbconnect.js";

// Models principais
// import Reserva from "../models/Reserva.js";
import Usuario from "../models/Usuario.js";
import Avaliacao from "../models/Avaliacao.js";
import Equipamento from "../models/Equipamento.js";
// import Endereco from "../models/Endereco.js";

//Seeds
import SeedReserva from "./seedReserva.js"
import SeedUsuario from "./seedUsuario.js"
import SeedAvaliacao from "./seedAvaliacao.js"
import SeedEquipamentos from "./seedEquipamento.js";
import SeedEndereco from "./seedEndereco.js";
import Endereco from "../models/Endereco.js";

await DbConnect.conectar();

async function main(){
    try {
        const usuario = await SeedUsuario();
        const enderecos = await SeedEndereco(usuario);   
        const avaliacoes = await SeedAvaliacao(usuario);
        await SeedEquipamentos(usuario, enderecos, avaliacoes);
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

