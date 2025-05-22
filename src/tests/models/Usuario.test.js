import {it, describe} from '@jest/globals'
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Usuario from '../../models/Usuario';

let mongoServer;

// Configuração antes de todos os testes
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        // Opções de conexão não são necessárias no Mongoose 6+
    });
});

// Limpeza após todos os testes
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// Limpeza após cada teste para garantir isolamento
afterEach(async () => {
    jest.clearAllMocks();
    await Usuario.deleteMany({});
});


describe('Modelo de Usuário', () =>{
    it('Deve criar um usuário com dados válidos', async()=>{
        const userData = {
            nome: "Fulano de Tal",
            email: "fulano@gmail.com",
            telefone: "+55 (69) 9999-8888",
            senha: "Fulano@123",
            dataNascimento: new Date(),
            CPF:"54425888065",
            status: "ativo",
            tipoUsuario:"usuario",
            fotoUsuario:"https://s3.amazonaws.com/uifaces/faces/twitter/johannesneu/128.jpg"

        }
        const user = new Usuario(userData)
        await user.save()
        
        const savedUser = await Usuario.findById(user._id).select('-senha')
        // console.log(savedUser.dataNascimento)
        // console.log(userData.dataNascimento)
        expect(savedUser.nome).toBe(userData.nome)
        expect(savedUser.email).toBe(userData.email)
        expect(savedUser.telefone).toBe(userData.telefone)
        expect(savedUser.dataNascimento).toStrictEqual(userData.dataNascimento)
        expect(savedUser.CPF).toBe(userData.CPF)
        expect(savedUser.status).toBe(userData.status)
        expect(savedUser.tipoUsuario).toBe(userData.tipoUsuario)
        expect(savedUser.fotoUsuario).toBe(userData.fotoUsuario)
    })
    it('Não deve criar um usuário com email duplicado', async () =>{
        const userData = {
            nome: "Fulano de Tal",
            email: "fulano@gmail.com",
            telefone: "+55 (69) 9999-8588",
            senha: "Fulano@123",
            dataNascimento: new Date(),
            CPF:"54425888065",
            status: "ativo",
            tipoUsuario:"usuario",
            fotoUsuario:"https://s3.amazonaws.com/uifaces/faces/twitter/johannesneu/128.jpg"
        }
        const userData2 = {
            nome: "Fulano de Tal",
            email: "fulano@gmail.com",
            telefone: "+55 (69) 9999-7888",
            senha: "Fulano@123",
            dataNascimento: new Date(),
            CPF:"27793868005",
            status: "ativo",
            tipoUsuario:"usuario",
            fotoUsuario:"https://s3.amazonaws.com/uifaces/faces/twitter/johannesneu/128.jpg"
        }
        const user1 = new Usuario(userData)
        await user1.save()

        const user2 = new Usuario(userData2)
        await expect(user2.save()).rejects.toThrowErrorMatchingInlineSnapshot(`"E11000 duplicate key error collection: test.usuarios index: email_1 dup key: { email: "fulano@gmail.com" }"`)
    })
    it('Não deve criar um usuário com telefone duplicado', async () =>{
        const userData = {
            nome: "Fulano de Tal",
            email: "fulano@gmail.com",
            telefone: "+55 (69) 9999-8888",
            senha: "Fulano@123",
            dataNascimento: new Date(),
            CPF:"54425888065",
            status: "ativo",
            tipoUsuario:"usuario",
            fotoUsuario:"https://s3.amazonaws.com/uifaces/faces/twitter/johannesneu/128.jpg"
        }
        const userData2 = {
            nome: "Fulano de Tal",
            email: "fulano1@gmail.com",
            telefone: "+55 (69) 9999-8888",
            senha: "Fulano@123",
            dataNascimento: new Date(),
            CPF:"27793868005",
            status: "ativo",
            tipoUsuario:"usuario",
            fotoUsuario:"https://s3.amazonaws.com/uifaces/faces/twitter/johannesneu/128.jpg"
        }
        const user1 = new Usuario(userData)
        await user1.save()

        const user2 = new Usuario(userData2)
        await expect(user2.save()).rejects.toThrowErrorMatchingInlineSnapshot(`"E11000 duplicate key error collection: test.usuarios index: telefone_1 dup key: { telefone: "+55 (69) 9999-8888" }"`)
    })
    it('Não deve criar um usuário com CPF duplicado', async () =>{
        const userData = {
            nome: "Fulano de Tal",
            email: "fulano@gmail.com",
            telefone: "+55 (69) 9999-5888",
            senha: "Fulano@123",
            dataNascimento: new Date(),
            CPF:"54425888065",
            status: "ativo",
            tipoUsuario:"usuario",
            fotoUsuario:"https://s3.amazonaws.com/uifaces/faces/twitter/johannesneu/128.jpg"
        }
        const userData2 = {
            nome: "Fulano de Tal",
            email: "fulano1@gmail.com",
            telefone: "+55 (69) 9999-4888",
            senha: "Fulano@123",
            dataNascimento: new Date(),
            CPF:"54425888065",
            status: "ativo",
            tipoUsuario:"usuario",
            fotoUsuario:"https://s3.amazonaws.com/uifaces/faces/twitter/johannesneu/128.jpg"
        }
        const user1 = new Usuario(userData)
        await user1.save()

        const user2 = new Usuario(userData2)
        await expect(user2.save()).rejects.toThrowErrorMatchingInlineSnapshot(`"E11000 duplicate key error collection: test.usuarios index: CPF_1 dup key: { CPF: "54425888065" }"`)
    })
})