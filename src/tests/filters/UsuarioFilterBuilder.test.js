import UsuarioFilterBuilder from "../../repositories/filters/UsuarioFilterBuilder";
import Usuario from "../../models/Usuario";
jest.mock("../../models/Usuario")

describe('UsuarioFilterBuilder', () =>{
    let usuarioFilterBuilder;
    beforeEach(() => {
        usuarioFilterBuilder = new UsuarioFilterBuilder
    })
    afterEach(() => {
        jest.clearAllMocks()
    });
    describe('comNome', () => {
        it('deve setar filtro de nome quando comNome é chamado', () => {
            usuarioFilterBuilder.comNome('Luan');
            const filtros = usuarioFilterBuilder.build()
            expect(filtros).toHaveProperty('nome')
            expect(filtros.nome).toEqual({$regex: 'Luan', $options: 'i'})
        });
        it('não deve setar filtro de nome se nome for vazio ou undefined', ()=> {
            usuarioFilterBuilder.comNome('');
            usuarioFilterBuilder.comNome(undefined)
            const filtros = usuarioFilterBuilder.build()
            expect(filtros).not.toHaveProperty('nome')
        });
    describe('comEmail', () => {
        it('deve setar filtro de email quando comEmail é chamado', () => {
            usuarioFilterBuilder.comEmail('meu@gmail.com')
            const filtros = usuarioFilterBuilder.build()
            expect(filtros).toHaveProperty('email')
            expect(filtros.email).toEqual({$regex: 'meu@gmail.com', $options: 'i'})
        });
        it('não deve setar filtro de email se for vazio ou undefined', () => {
            usuarioFilterBuilder.comEmail('')
            usuarioFilterBuilder.comEmail(undefined)
            const filtros = usuarioFilterBuilder.build()
            expect(filtros).not.toHaveProperty('email')
        });
    });
    describe('comStatus', () => {
        it('deve setar status ativo quando valor é "ativo"', () => {
            usuarioFilterBuilder.comStatus("ativo")
            const filtros = usuarioFilterBuilder.build()
            expect(filtros).toHaveProperty('status')
            expect(filtros.status).toEqual({$eq: "ativo"})
        });
        it('deve setar status ativo quando valor é "inaativo"', () => {
            usuarioFilterBuilder.comStatus("inativo")
            const filtros = usuarioFilterBuilder.build()
            expect(filtros).toHaveProperty('status')
            expect(filtros.status).toEqual({$eq: "inativo"})
        });
        it('não deve setar status ativo quando valor é vazio ou undefined', () => {
            usuarioFilterBuilder.comStatus('')
            usuarioFilterBuilder.comStatus(undefined)
            const filtros = usuarioFilterBuilder.build()
            expect(filtros).not.toHaveProperty('status')
        });
    });
    describe('comTipoUsuario', () =>{
        it('deve setar tipoUsuario quando o valor é "usuario"', () => {
            usuarioFilterBuilder.comTipoUsuario('usuario')
            const filtros = usuarioFilterBuilder.build()
            expect(filtros).toHaveProperty('tipoUsuario')
            expect(filtros.tipoUsuario).toEqual({$eq: 'usuario'})
        });
        it('não deve setar tipoUsuario quando o valor for vazio ou undefined', () => {
            usuarioFilterBuilder.comTipoUsuario('')
            usuarioFilterBuilder.comTipoUsuario(undefined)
            const filtros = usuarioFilterBuilder.build()
            expect(filtros).not.toHaveProperty('tipoUsuario')
        });
    })
    });
})