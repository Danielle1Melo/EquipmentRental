import UsuarioValidator from "../../../utils/ValidatorUsuario";

describe('ValidatorUsuario', () =>{
    let usuarioValidator;
    beforeEach(()=>{
        usuarioValidator =  UsuarioValidator
    });
    afterEach(() => {
        jest.clearAllMocks()
    });
    describe('validarCPF', ()=>{
        it('deve validar um cpf válido e retornar true', () =>{
            const resultado = usuarioValidator.validarCPF('22790660093')
            expect(resultado).toEqual(true)
        });
        it('não deve validar um cpf cujo o tamanho ultrapasse 11 caracteres e retornar false', ()=> {
            const resultado = usuarioValidator.validarCPF('227906600933')
            expect(resultado).toEqual(false)
        });
        it('não deve validar um cpf com numeros repetidos e retornar false', ()=> {
            const resultado = usuarioValidator.validarCPF('33333333333')
            expect(resultado).toEqual(false)
        });
        it('não deve validar um CPF com menos de 11 caracteres', () => {
        const resultado = usuarioValidator.validarCPF('22790660'); // Apenas 8 dígitos
        expect(resultado).toEqual(false);
        });
    });
    describe('validarData', () => {
        it('retornar true se a data de nascimento for igual ou maior que 18', () =>{
            const resultado = usuarioValidator.validarData('2000-01-01')
            expect(resultado).toEqual(true)
        });
        
        it('retornar false se a data de nascimento for menor que 18', () =>{
            const resultado = usuarioValidator.validarData('2010-01-01')
            expect(resultado).toEqual(false)
        });
    })
})