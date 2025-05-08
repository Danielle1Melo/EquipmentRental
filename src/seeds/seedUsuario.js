import fs from "fs"
import Usuario from "../models/Usuario"
import getGlobalFakeMapping from "../globalFakeMapping"
import bcrypt from "bcryptjs";

import DbConect from "../config/DbConnect.js";

await DbConect.conectar();

export function gerarSenhaHash(senhaPura){
    return bcrypt.hashSync(senhaPura, 8);
}

const senhaPura = "AISDAIEF#t4";
const senhaHash = gerarSenhaHash(senhaPura) //usar essa

async function SeedUsuario(){

    await Usuario.deleteMany();
}


