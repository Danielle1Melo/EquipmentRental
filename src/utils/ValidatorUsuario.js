
class UsuarioValidator {
    constructor(){

    }
    static validarCPF(cpf){
        const cleanCPF = cpf.replace(/\D/g, "");

  // Verificar se tem 11 dígitos
        if (cleanCPF.length !== 11) return false;

        // Evitar CPFs com números repetidos (ex: 111.111.111-11)
        if (/^(\d)\1+$/.test(cleanCPF)) return false;

        // Cálculo do primeiro dígito verificador
        const calcularDigito = (slice, peso) => {
            const soma = slice.split("").reduce((acc, digit, index) => {
            return acc + parseInt(digit) * (peso - index);
            }, 0);
            const resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        const primeiroDigito = calcularDigito(cleanCPF.slice(0, 9), 10);
        const segundoDigito = calcularDigito(cleanCPF.slice(0, 10), 11);

        // Verifica se os dígitos calculados correspondem aos últimos do CPF
        return primeiroDigito === parseInt(cleanCPF[9]) && segundoDigito === parseInt(cleanCPF[10]);
    }
    static validarData(data){
        const hoje = new Date()
        const dataAtualSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
        const dataNascimento = new Date(data)

        let idade = dataAtualSemHora.getFullYear() - dataNascimento.getFullYear()

        const aniversarioEsteAno = new Date(dataAtualSemHora.getFullYear(), dataNascimento.getMonth(), dataNascimento.getDate())
        if(dataAtualSemHora < aniversarioEsteAno){
            idade --
        }
        return idade >=18
    }
}
export default UsuarioValidator