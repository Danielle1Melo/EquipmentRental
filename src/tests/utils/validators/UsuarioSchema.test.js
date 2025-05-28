import { exitOnError } from "winston";
import { UsuarioSchema } from "../../../utils/validators/schemas/zod/UsuarioSchema";

describe('UsuarioSchema', () => {
    let usuarioSchema
    beforeEach(() => {
        usuarioSchema = UsuarioSchema
    })
    afterEach(() => {
        jest.clearAllMocks()
    })
    describe('parse', () => {
        it('deve validar todos os dados do usuário e não retorna nenhum erro', () => {
            const mockData = {
                nome: "Usuario",
                email: "email@gmail.com",
                senha: "Senha123@",
                telefone: "(96) 9999-9999",
                dataNascimento: "2000-01-01",
                CPF: "09272083001",
                notaMedia: 7,
                status: "ativo",
                tipoUsuario: "usuario",
                fotoUsuario: "https://s3.amazonaws.com/uifaces/faces/twitter/sachacorazzi/128.jpg"
            }
            const resultado = usuarioSchema.parse(mockData)
            expect(resultado).toEqual(resultado)
        });
    describe('Nome', () =>{
        it('deve retornar erro ao tentar validar nome', async () => {
            const SchemaNome = UsuarioSchema.partial()
            const nomeInvalido = {nome:'Nome  123'}
            await expect(SchemaNome.parseAsync(nomeInvalido)).rejects.toThrow("Nome não pode conter caracteres especiais, nem numeros e nem seguido por dois ou mais espaços.")
        });
        it('deve retornar uma mensagem de erro se o nome não for uma string', async () => {
            const SchemaNome = UsuarioSchema.partial()
            const nomeInvalido = {nome:123}
            await expect(SchemaNome.parseAsync(nomeInvalido)).rejects.toThrow(`O nome deve ser do tipo string`)
        });
        it('deve retornar uma mensagem de erro se o nome for um campo vazio', async () => {
            const SchemaNome = UsuarioSchema.partial()
            const nomeInvalido = {nome:''}
            await expect(SchemaNome.parseAsync(nomeInvalido)).rejects.toThrow('Campo nome é obrigatório.')
        });
        it('deve ter sucesso ao validar o nome',  () => {
            const SchemaNome = UsuarioSchema.partial()
            const nomeValido = {nome:'Nome Usuario'}
            expect(SchemaNome.parse(nomeValido)).toEqual(nomeValido)
        });
    });
    describe("Email", () =>{
        it('deve validar um email sem retornar um erro', () =>{
            const SchemaEmail = UsuarioSchema.partial()
            const emailValido = {email: "email@gmail.com"}
            expect(SchemaEmail.parse(emailValido)).toEqual(emailValido)
        });
        it('deve retornar um erro ao inserir email em um formato inválido', async() =>{
            const SchemaEmail = UsuarioSchema.partial()
            const emailInvalido = {email: "emailInvalido"}
            await expect(SchemaEmail.parseAsync(emailInvalido)).rejects.toThrow('Formato de email inválido.')
        });
        it('deve retornar um erro ao deixar o campo email vazio', async() => {
            const SchemaEmail = UsuarioSchema.partial()
            const emailInvalido = {email: ""}
            await expect(SchemaEmail.parseAsync(emailInvalido)).rejects.toThrow('Campo email é obrigatório.')
        });
        it('deve retornar uma mensagem de erro se o email não for uma string', async() => {
            const SchemaEmail = UsuarioSchema.partial()
            const emailInvalido = {email: 123}
            await expect(SchemaEmail.parseAsync(emailInvalido)).rejects.toThrow(`O email deve ser do tipo string`)
        });
    });
    describe('Telefone', () => {
        it('deve validar um telefone ', () => {
            const SchemaTelefone = UsuarioSchema.partial()
            const telefoneValido = {telefone: "(69) 9999-9999"}
            const resultado = SchemaTelefone.parse(telefoneValido)
            expect(resultado).toEqual(telefoneValido)
        });
        it('deve retorna erro ao inserir formato inválido de telefone',async () => {
            const SchemaTelefone = UsuarioSchema.partial()
            const telefoneInvalido = {telefone: "telefoneInvalido"}
            await expect(SchemaTelefone.parseAsync(telefoneInvalido)).rejects.toThrow(`O telefone deve ser algo como: +55 (XX) 9XXXX-XXXX, +55 XX 9XXXX-XXXX, (XX) 9XXXX-XXXX, XX 9XXXX-XXXX`)
        });
        it('deve uma mensagem de erro se o telefone não for uma string',async () => {
            const SchemaTelefone = UsuarioSchema.partial()
            const telefoneInvalido = {telefone: 123456789987}
            await expect(SchemaTelefone.parseAsync(telefoneInvalido)).rejects.toThrow(`O telefone deve ser do tipo string`)
        });
    });
    describe('Senha', ()=>{
        it('deve validar uma senha', () =>{
            const SchemaSenha = usuarioSchema.partial()
            const senhaValida = {senha: "Senha123@"}
            const resultado = SchemaSenha.parse(senhaValida)
            expect(resultado).toEqual(senhaValida)
        });
        it('deve retorna uma mensgem de erro ao inserir uma senha com formato inválido', async() =>{
            const SchemaSenha = usuarioSchema.partial()
            const senhaInvalida = {senha: "SenhaInválida"}
            await expect(SchemaSenha.parseAsync(senhaInvalida)).rejects.toThrow('A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.')
        });
        it('deve retornar uma mensagem de erro caso a senha tenha menos de 8 caracteres', async() =>{
            const SchemaSenha = usuarioSchema.partial()
            const senhaInvalida = {senha: "Senha"}
            await expect(SchemaSenha.parseAsync(senhaInvalida)).rejects.toThrow('A senha deve ter pelo menos 8 caracteres.')
        });
        it('deve retornar uma mensagem de erro caso a senha seja vazio', async() =>{
            const SchemaSenha = usuarioSchema.partial()
            const senhaInvalida = {senha: ""}
            await expect(SchemaSenha.parseAsync(senhaInvalida)).rejects.toThrow('A senha deve ter pelo menos 8 caracteres.')
        });
        it('deve retornar uma mensagem de erro caso a senha não seja uma string', async() =>{
            const SchemaSenha = usuarioSchema.partial()
            const senhaInvalida = {senha: 123312}
            await expect(SchemaSenha.parseAsync(senhaInvalida)).rejects.toThrow(`A senha deve ser do tipo string`)
        });    
    });
    describe('dataNascimento', ()=>{
        it('deve validar uma data de nascimento igual ou superio a 18 anos', () =>{
            const SchemaDataNascimento = usuarioSchema.partial()
            const dataNascimentoValida = {dataNascimento: "2000-01-01"}
            const resultado = SchemaDataNascimento.parse(dataNascimentoValida)
            expect(resultado).toEqual(dataNascimentoValida)
        });
        it('deve retornar uma mensagem de erro se a data de nascimento for inválida', async () =>{
            const SchemaDataNascimento = usuarioSchema.partial()
            const dataNascimentoInvalida = {dataNascimento: "20000101"}
            await expect(SchemaDataNascimento.parseAsync(dataNascimentoInvalida)).rejects.toThrow("Formato de data inválido, deve serguir o padrão => ano-mês-dia, Ex: 0000-00-00")
        });
        it('deve retornar uma mensagem de erro se a data de nascimento for menor que 18 anos', async () =>{
            const SchemaDataNascimento = usuarioSchema.partial()
            const dataNascimentoInvalida = {dataNascimento: "2015-01-01"}
            await expect(SchemaDataNascimento.parseAsync(dataNascimentoInvalida)).rejects.toThrow("Data de Nascimento inválida, o usuário deve ter 18 anos ou mais")
        });
        it('deve retornar uma mensagem de erro se a data de nascimento não for uma string', async () =>{
            const SchemaDataNascimento = usuarioSchema.partial()
            const dataNascimentoInvalida = {dataNascimento: 45678789}
            await expect(SchemaDataNascimento.parseAsync(dataNascimentoInvalida)).rejects.toThrow(`A data de nascimento deve ser do tipo string`)
        });
    });
    describe('CPF', () => {
        it('deve validar um CPF', () => {
            const SchemaCPF = usuarioSchema.partial()
            const CPFValido = {CPF: "09272083001"}
            const resultado = SchemaCPF.parse(CPFValido)
            expect(resultado).toEqual(CPFValido)
        });
        it('deve retornar uma mensagem de erro se o CPF conter uma quantia de carcateres diferente de 11',async () => {
            const SchemaCPF = usuarioSchema.partial()
            const CPFInvalido = {CPF: "1"}
            await expect(SchemaCPF.parseAsync(CPFInvalido)).rejects.toThrow("O CPF deve conter 11 caracteres numéricos")
        });
        it('deve retornar uma mensagem de erro se o CPF for inválido',async () => {
            const SchemaCPF = usuarioSchema.partial()
            const CPFInvalido = {CPF: "00000000000"}
            await expect(SchemaCPF.parseAsync(CPFInvalido)).rejects.toThrow("CPF inválido")
        });
        it('deve retornar uma mensagem de erro se o CPF não for uma string',async () => {
            const SchemaCPF = usuarioSchema.partial()
            const CPFInvalido = {CPF: 12345789}
            await expect(SchemaCPF.parseAsync(CPFInvalido)).rejects.toThrow(`O CPF deve ser do tipo string`)
        });
    });
    describe("Status", () => {
        it('deve validar um status do tipo "ativo"', ()=>{
            const SchemaStatus = usuarioSchema.partial()
            const StatusValido = {status: "ativo"}
            const resultado = SchemaStatus.parse(StatusValido)
            expect(resultado).toEqual(StatusValido)
        });
        it('deve validar um status do tipo "inativo"', ()=>{
            const SchemaStatus = usuarioSchema.partial()
            const StatusValido = {status: "inativo"}
            const resultado = SchemaStatus.parse(StatusValido)
            expect(resultado).toEqual(StatusValido)
        });
        it('deve retornar uma mensagem de erro se for um status inválido"', async()=>{
            const SchemaStatus = usuarioSchema.partial()
            const StatusInvalido = {status: "invalido"}
            await expect(SchemaStatus.parseAsync(StatusInvalido)).rejects.toThrow(`status só pode ser do tipo 'ativo' ou 'inativo'`)
        })
        it('deve retornar uma mensagem de erro se for um status inválido"', async()=>{
            const SchemaStatus = usuarioSchema.partial()
            const StatusInvalido = {status: ""}
            await expect(SchemaStatus.parseAsync(StatusInvalido)).rejects.toThrow(`status só pode ser do tipo 'ativo' ou 'inativo'`)
        });
    });
    describe('notaMedia', () => {
        it('deve validar uma nota', () =>{
            const SchemaNotaMedia = usuarioSchema.partial()
            const NotaMediaValida = {notaMedia: 10}
            const resultado = SchemaNotaMedia.parse(NotaMediaValida)
            expect(resultado).toEqual(NotaMediaValida)
        });
        it('deve retornar uma mensagem de erro ao validar uma nota menor que 0', async() => {
            const SchemaNotaMedia = usuarioSchema.partial()
            const NotaMediaInvalida = {notaMedia: -1}
            await expect(SchemaNotaMedia.parseAsync(NotaMediaInvalida)).rejects.toThrow("A nota não pode ser menor que 0")
        });
        it('deve retornar uma mensagem de erro ao validar uma nota maior que 10', async() => {
            const SchemaNotaMedia = usuarioSchema.partial()
            const NotaMediaInvalida = {notaMedia: 11}
            await expect(SchemaNotaMedia.parseAsync(NotaMediaInvalida)).rejects.toThrow("A nota não pode ser maior que 10")
        });
    });
    describe('tipoUsuario', () => {
        it('deve validar tipo "usuario"', ()=>{
            const SchemaTipoUsuario = usuarioSchema.partial()
            const TipoUsuario = {tipoUsuario: "usuario"}
            const resultado = SchemaTipoUsuario.parse(TipoUsuario)
            expect(resultado).toEqual(TipoUsuario)
        });
        it('deve validar tipo "admin"', ()=>{
            const SchemaTipoUsuario = usuarioSchema.partial()
            const TipoUsuario = {tipoUsuario: "admin"}
            const resultado = SchemaTipoUsuario.parse(TipoUsuario)
            expect(resultado).toEqual(TipoUsuario)
        });
        it('deve retornar uma mensagem de erro para um tipo de usuario inexistente', async()=>{
            const SchemaTipoUsuario = usuarioSchema.partial()
            const TipoUsuarioInvalido = {tipoUsuario: "inexistente"}
            await expect(SchemaTipoUsuario.parseAsync(TipoUsuarioInvalido )).rejects.toThrow(`tipoUsuario só pode ser do tipo 'usuario' ou 'admin'`)
        });
    });
    describe('fotoUsuario', () => {
        it('deve validar a url da foto de um usuario', () =>{
            const SchemaUsuarioFoto = usuarioSchema.partial()
            const FotoUsuarioValido = {fotoUsuario: "https://s3.amazonaws.com/uifaces/faces/twitter/sachacorazzi/128.jpg"}
            const resultado = SchemaUsuarioFoto.parse(FotoUsuarioValido)
            expect(resultado).toEqual(FotoUsuarioValido)
        })
        it('deve retornar uma mensagem de erro para um caminho de url inválida', async() =>{
            const SchemaUsuarioFoto = usuarioSchema.partial()
            const FotoUsuarioInvavalido = {fotoUsuario: "dawd;çdoaijwdg"}
            await expect(SchemaUsuarioFoto.parseAsync(FotoUsuarioInvavalido)).rejects.toThrow("URL inválida")
        });
        it('deve retornar uma mensagem de erro se foto não for uma string', async() =>{
            const SchemaUsuarioFoto = usuarioSchema.partial()
            const FotoUsuarioInvavalido = {fotoUsuario: 123}
            await expect(SchemaUsuarioFoto.parseAsync(FotoUsuarioInvavalido)).rejects.toThrow("foto tem que ser do tipo string")
        });
    })
})
})