import fs from "fs"
import Usuario from "../models/Usuario.js"
// import getGlobalFakeMapping from "../globalFakeMapping"
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import getGlobalFakeMapping from "./globalFakeMapping.js";


// await DbConect.conectar();



export async function gerarSenhaHash(senhaPura){
    return bcrypt.hashSync(senhaPura, 8);
}

const senhaPura = "AISDAIEF#t4";
const senhaHash = await gerarSenhaHash(senhaPura) //usar essa



async function SeedUsuario(){

    await Usuario.deleteMany();
    const usuarios = [];
    const fake = await getGlobalFakeMapping()


    for (let i = 0; i < 25; i++) {
        const nome = fake.nome();
        const email = fake.email();
        const telefone = fake.telefone();
        const senha = senhaHash;
        const dataNascimento = fake.dataNascimento();
        const CPF = fake.CPF(); // Geração de CPF fictício
        const notaMedia = fake.notaMediaAvaliacao();
        const status = fake.status();
        const tipoUsuario = fake.tipoUsuario();
        const fotoUsuario = fake.fotoUsuario()

        usuarios.push({
            nome,
            email,
            telefone,
            senha: senha,
            dataNascimento,
            CPF,
            notaMedia,
            status,
            tipoUsuario,
            fotoUsuario
        });
    }
    const dev = {
        nome: "Dev",
        email: "dev@gmail.com",
        telefone: "69 98191-4471",
        senha:  await bcrypt.hash('Dev@1234', 8),
        dataNascimento: fake.dataNascimento(),
        CPF: "12345612345", // Geração de CPF fictício
        notaMedia: 0,
        status: "ativo",
        tipoUsuario: "admin",
        fotoUsuario:'https://pt.quizur.com/_image?href=https://img.quizur.com/f/img63365b54eee492.52029189.png?lastEdited=1664506795&w=600&h=600&f=webp'
        
    }
    usuarios.push({...dev})
    // Inserir no banco
    await Usuario.collection.insertMany(usuarios);
    // console.log(`${usuarios.length} usuários inseridos com sucesso!`);

    // Fechar conexão
    return await Usuario.find()

}

export default SeedUsuario
