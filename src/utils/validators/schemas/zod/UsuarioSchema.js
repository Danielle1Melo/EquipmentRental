// src/utils/validators/schemas/zod/UsuarioSchema.js

import { z } from 'zod';
// import objectIdSchema from './ObjectIdSchema.js';
// import { RotaSchema } from './RotaSchema.js';
import UsuarioValidator from '../../../ValidatorUsuario.js';
/** Definição da expressão regular para a senha
 * Padrão: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial
 * Tamanho mínimo: 8 caracteres
 **/
const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const telefoneRegex = /^(\+55\s?)?(\(?[1-9]{2}\)?\s?)(9?[0-9]{4})-?([0-9]{4})$/;
const dataRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+( [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/


// Validação de array de ObjectId sem duplicações

const UsuarioSchema = z.object({
  nome: z
  .string({message:`O nome deve ser do tipo string`})
  .min(1, 'Campo nome é obrigatório.')
  .refine((nomeUsuario) => !nomeUsuario || nomeRegex.test(nomeUsuario), {message: "Nome não pode conter caracteres especiais, nem numeros e nem seguido por dois ou mais espaços."}),
  email: z
    .string({message:`O email deve ser do tipo string`})
    .email('Formato de email inválido.')
    .min(1, 'Campo email é obrigatório.'),
    telefone:z
    .string({message:`O telefone deve ser do tipo string`})
    .refine((val) => !val || telefoneRegex.test(val), {message: `O telefone deve ser algo como: +55 (XX) 9XXXX-XXXX, +55 XX 9XXXX-XXXX, (XX) 9XXXX-XXXX, XX 9XXXX-XXXX`}),
    senha: z
    .string({message:`A senha deve ser do tipo string`})
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .refine(
      (senha) => {
        // Senha é opcional
        if (!senha) return true;
        return senhaRegex.test(senha);
      },
      {
        message:
          'A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.',
      }
    ),
    dataNascimento:z
    .string({message:`A data de nascimento deve ser do tipo string`})
    .refine((data) => !data || dataRegex.test(data), {message: "Formato de data inválido, deve serguir o padrão => ano-mês-dia, Ex: 0000-00-00"})
    .refine(UsuarioValidator.validarData, {message: "Data de Nascimento inválida, o usuário deve ter 18 anos ou mais"}),
    CPF:z
    .string({message:`O CPF deve ser do tipo string`})
    .length(11, { message: "O CPF deve conter 11 caracteres numéricos"})
    .refine(UsuarioValidator.validarCPF, {message: "CPF inválido"}),
    status:z
    .enum(["ativo", "inativo"], {message: `status só pode ser do tipo 'ativo' ou 'inativo'`})
    .default("inativo"),
    notaMedia:z
    .number()
    .min(0, {message: "A nota não pode ser menor que 0"})
    .max(10, {message: "A nota não pode ser maior que 10"})
    .default(0)
    .optional(),
    tipoUsuario:z
    .enum(["usuario", "admin"], {message: `tipoUsuario só pode ser do tipo 'usuario' ou 'admin'`})
    .default("usuario"),
    fotoUsuario:z
    .string({message: "foto tem que ser do tipo string"})
    .url({message: "URL inválida"})
    .optional(),
});

const UsuarioUpdateSchema = UsuarioSchema.partial();

export { UsuarioSchema, UsuarioUpdateSchema };
