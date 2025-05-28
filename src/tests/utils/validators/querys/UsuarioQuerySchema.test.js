import { UsuarioIdSchema, UsuarioQuerySchema } from "../../../../utils/validators/schemas/zod/querys/UsuarioQuerySchema";
import mongoose from "mongoose";

describe('UsuarioQuerySchema', ()=>{
    let usuarioQuerySchema;
    beforeEach(() => {
        usuarioQuerySchema = UsuarioQuerySchema
    })
   describe('Nome', () =>{
    it('deve validar o nome', () =>{
        const SchemaQueryNome = usuarioQuerySchema.partial()
        const NomeValido = {nome: "Usuario"}
        const resultado = SchemaQueryNome.parse(NomeValido)
        expect(resultado).toEqual(NomeValido)
    });
    it('deve retornar uma mensagem de erro ao validar nome', async () =>{
        const SchemaQueryNome = usuarioQuerySchema.partial()
        const NomeInvalido = {nome: " "}
        await expect(SchemaQueryNome.parseAsync(NomeInvalido)).rejects.toThrow("Nome não pode ser vazio ou apenas espaços")
    });
   });
   describe('Email', () => {
    it('deve validar um email', () =>{
        const SchemaQueryEmail = usuarioQuerySchema.partial()
        const EmailValido = {nome:"usuario@gmail.com"}
        const resultado = SchemaQueryEmail.parse(EmailValido)
        expect(resultado).toEqual(EmailValido)
    });
    it('deve retornar uma mensagem de erro para um email inválido', async() =>{
        const SchemaQueryEmail = usuarioQuerySchema.partial()
        const EmailInvalido = {email:"email-invalido"}
        await expect(SchemaQueryEmail.parseAsync(EmailInvalido)).rejects.toThrow("Formato de email inválido")
    });
   });
   describe('Page', () =>{
    it('deve validar uma página', () =>{
        const SchemaQueryPage = usuarioQuerySchema.partial();
        const PaginaValida = { page: "1" };
        const resultado = SchemaQueryPage.parse(PaginaValida);
        expect(resultado).toEqual({ page: 1 });
    });
    it('deve falhar se page for inválida', async()=> {
        const SchemaQueryPage = usuarioQuerySchema.partial();
        const PaginaInvalida = { page: "abc" }; // Texto inválido
        await expect(SchemaQueryPage.parseAsync(PaginaInvalida)).rejects.toThrow("Page deve ser um número inteiro maior que 0");
    });
    it('deve aplicar valor padrão se page não for fornecida', () => {
        const SchemaQueryPage = usuarioQuerySchema.partial();
        const PaginaVazia = {page: ""}
        const resultado = SchemaQueryPage.parse(PaginaVazia);
        expect(resultado.page).toBe(1); // Confere se usa o default do schema
    });

   });
   describe('Limite', () =>{
    it('deve validar um limite de página', () =>{
        const SchemaQueryLimit = usuarioQuerySchema.partial()
        const LimiteValido = {limite: "10"}
        const resultado = SchemaQueryLimit.parse(LimiteValido)
        expect(resultado).toEqual({limite: 10}) 
    });
    it('deve falhar se o limite for inválido, ex: maior que 100', async() =>{
        const SchemaQueryLimit = usuarioQuerySchema.partial()
        const LimiteInvalido = {limite: "101"}
        await expect(SchemaQueryLimit.parseAsync(LimiteInvalido)).rejects.toThrow("Limite deve ser um número inteiro entre 1 e 100")
    });
    it('deve falhar se o limite for inválido, ex: menor que 0', async() =>{
        const SchemaQueryLimit = usuarioQuerySchema.partial()
        const LimiteInvalido = {limite: "-101"}
        await expect(SchemaQueryLimit.parseAsync(LimiteInvalido)).rejects.toThrow("Limite deve ser um número inteiro entre 1 e 100")
    });
    it('deve falhar se o limite for inválido, ex: não for um numero', async() =>{
        const SchemaQueryLimit = usuarioQuerySchema.partial()
        const LimiteInvalido = {limite: "abc"}
        await expect(SchemaQueryLimit.parseAsync(LimiteInvalido)).rejects.toThrow("Limite deve ser um número inteiro entre 1 e 100")
    });
    it('deve aplicar o valor padrão se limite não for fornecido', () =>{
        const SchemaQueryLimit = usuarioQuerySchema.partial()
        const resultado = usuarioQuerySchema.parse({})
        expect(resultado.limite).toBe(10)
    })
   })
})