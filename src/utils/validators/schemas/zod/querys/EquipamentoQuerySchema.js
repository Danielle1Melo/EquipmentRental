import { z } from "zod";
import mongoose from "mongoose";

export const EquipamentoIdSchema = z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
  message: "ID inválido",
});

export const EquipamentoQuerySchema = z.object({
  categoria: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length > 0, {
      message: "Categoria não pode ser vazia",
    })
    .transform((val) => val?.trim()),

  status: z
    .string()
    .optional()
    .refine((val) => !val || val === "true" || val === "false", {
      message: "Status deve ser 'true' ou 'false'",
    }),

  minValor: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (Number.isInteger(val) && val > 0), {
      message: "minValor deve ser um número inteiro maior que 0",
    }),

  maxValor: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine((val) => val === undefined || !isNaN(val) && val >= 0, {
      message: "maxValor deve ser um número maior ou igual a 0",
    }),

  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => Number.isInteger(val) && val > 0, {
      message: "Page deve ser um número inteiro maior que 0",
    }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => Number.isInteger(val) && val > 0 && val <= 100, {
      message: "Limit deve ser um número inteiro entre 1 e 100",
    }),
});
