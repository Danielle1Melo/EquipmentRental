import "dotenv/config";
import mongoose from "mongoose";

import { faker } from "@faker-js/faker";

import DbConnect from "../config/dbconnect.js";

// Models principais
// import Reserva from "../models/Reserva.js";
// import Usuario from "../models/Usuario.js";
// import Avaliacao from "../models/Avaliacao.js";
// import Equipamento from "../models/Equipamento.js";
// import Endereco from "../models/Endereco.js";

import Usuario from "../models/Usuario.js";
import SeedUsuario from "./seed_usuario.js";
import SeedAvaliacao from "./seed_avaliacao.js";

DbConnect.conectar();

async function main() {
    try{
        const usuario = await SeedUsuario()
        await SeedAvaliacao(usuario)
    } catch (err) {
        console.log(err)
    }


}

await main()
DbConnect.desconectar();
