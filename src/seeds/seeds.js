import "dotenv/config";
import mongoose from "mongoose";

import DbConnect from "../config/DbConnect.js";

// Models principais
import Usuario from "../models/Usuario.js";
import Avaliacao from "../models/Avaliacao.js";
import Equipamento from "../models/Equipamento.js";
import Endereco from "../models/Endereco.js";

import SeedReserva from "./seedReserva.js"
import SeedUsuario from "./seedUsuario.js"
import SeedAvaliacao from "./seedAvaliacao.js"
import SeedEquipamentos from "./seedEquipamento.js";
import SeedEndereco from "./seedEndereco.js";

await DbConnect.conectar();

async function main(){
    try {

      const usuarios = await SeedUsuario();
      const enderecos = await SeedEndereco(usuarios);
      const equipamentos = await SeedEquipamentos(usuarios);
      const avaliacoes = await SeedAvaliacao(usuarios, equipamentos);
      const resevas = await SeedReserva(usuarios, equipamentos);

    console.log(">>> SEED FINALIZADO COM SUCESSO! <<<");
  } catch (err) {
    console.error("Erro ao executar SEED:", err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

main();

