// src/utils/validators/schemas/zod/UsuarioSchema.js

import { z } from 'zod';
import objectIdSchema from './ObjectIdSchema.js';
import { RotaSchema } from './RotaSchema.js';

/** Definição da expressão regular para a senha
 * Padrão: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial
 * Tamanho mínimo: 8 caracteres
 **/
const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const telefoneRegex = /^(\+55\s?)?(\(?[1-9]{2}\)?\s?)(9?[0-9]{4})-?([0-9]{4})$/

// Validação de array de ObjectId sem duplicações
const distinctObjectIdArray = z
  .array(objectIdSchema)
  .refine(
    (arr) => new Set(arr.map((id) => id.toString())).size === arr.length,
    { message: 'Não pode conter ids repetidos.' }
  );

const UsuarioSchema = z.object({
  nome: z.string().min(1, 'Campo nome é obrigatório.'),
  email: z
    .string()
    .email('Formato de email inválido.')
    .min(1, 'Campo email é obrigatório.'),
    telefone:z
    .string()
    .refine((val) => !val || telefoneRegex.test(val), {message: `O telefone deve ser algo como: +55 (XX) 9XXXX-XXXX, +55 XX 9XXXX-XXXX, (XX) 9XXXX-XXXX, XX 9XXXX-XXXX`}),
    senha: z
    .string()
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
    link_foto: z.string().optional(),
    dataNascimento:z
    .string()
    .date(),
    cpf:z
    .string()
    .min(11, { message: "O CPF deve conter 11 caracteres"}),
    notaMedia:z
    .number()
    .max(10, {message: "A nota não pode ser maior que 10"})
    .default(0)
    .optional(),
    tipoUsuario:z
    .string()
    .includes(["ativo", "inativo"],{message: "Usuario só pode ser do tipo 'ativo' ou 'inativo'"})
    .default("inativo"),
    fotoUsuario:z
    .string()
    .optional(),
});

const UsuarioUpdateSchema = UsuarioSchema.partial();

export { UsuarioSchema, UsuarioUpdateSchema };
