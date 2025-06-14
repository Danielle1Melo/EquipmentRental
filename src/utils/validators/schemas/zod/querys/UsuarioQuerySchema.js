import { z } from "zod";
import mongoose from 'mongoose';

export const UsuarioIdSchema = z.string().refine((id) => id!==undefined && id.trim() !== "",{
    message:`ID não pode ser undefined ou vazio`
})
.refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "ID inválido",
});
const regexCPF = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/
export const UsuarioQuerySchema = z.object({
    nome: z
        .string()
        .optional()
        .refine((val) => !val || val.trim().length > 0, {
            message: "Nome não pode ser vazio ou apenas espaços",
        })
        .transform((val) => val?.trim()),
    email: z
        .union([z.string().email("Formato de email inválido"), z.undefined()])
        .optional(),
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => Number.isInteger(val) && val > 0, {
            message: "Page deve ser um número inteiro maior que 0",
        }),
    limite: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => Number.isInteger(val) && val > 0 && val <= 100, {
            message: "Limite deve ser um número inteiro entre 1 e 100",
        }),
});
