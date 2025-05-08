import fs from "fs"
import Usuario from "../models/Usuario.js"
// import getGlobalFakeMapping from "../globalFakeMapping"
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";


import DbConnect from "../config/Dbconnect.js";

// await DbConect.conectar();

export function gerarSenhaHash(senhaPura){
    return bcrypt.hashSync(senhaPura, 8);
}

const senhaPura = "AISDAIEF#t4";
const senhaHash = gerarSenhaHash(senhaPura) //usar essa

async function SeedUsuario(){

    await Usuario.deleteMany();
    const usuarios = [];

    for (let i = 0; i < 5; i++) {
        const nome = faker.person.fullName();
        const email = faker.internet.email();
        const telefone = faker.phone.number();
        const senhaHash = await bcrypt.hash("Senha123@", 10);
        const dataNascimento = faker.date.birthdate({ min: 18, max: 60, mode: "age" });
        const CPF = faker.string.numeric(11); // Geração de CPF fictício
        const notaMedia = faker.number.float({ min: 0, max: 10 });

        usuarios.push({
            nome,
            email,
            telefone,
            senha: senhaHash,
            dataNascimento,
            CPF,
            notaMedia
        });
    }

    // Inserir no banco
    await Usuario.collection.insertMany(usuarios);
    console.log(`${usuarios.length} usuários inseridos com sucesso!`);

    // Fechar conexão
    return await Usuario.find()

}

export default SeedUsuario


