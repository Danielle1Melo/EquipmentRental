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

await DbConect.conectar();