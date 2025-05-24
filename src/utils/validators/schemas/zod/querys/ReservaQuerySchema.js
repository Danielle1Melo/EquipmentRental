import { z } from 'zod';
import mongoose from 'mongoose';

export const ReservaIdSchema = z.string().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    { message: "ID inválido" }
);

export const ReservaQuerySchema = z.object({
  _id: ReservaIdSchema.optional(),
  equipamentoNome: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length > 0, {
      message: 'Nome do equipamento não pode ser vazio',
    })
    .transform((val) => val?.trim()),
  dataInicial: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Data inicial inválida',
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  dataFinal: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Data final inválida',
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  statusReserva: z
    .enum(['pendente', 'confirmada', 'cancelada'])
    .optional(),
  usuarioNome: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length > 0, {
      message: 'Nome do usuário não pode ser vazio',
    })
    .transform((val) => val?.trim()),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => Number.isInteger(val) && val > 0, {
      message: 'Page deve ser um número inteiro maior que 0',
    }),
  limite: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => Number.isInteger(val) && val > 0 && val <= 100, {
      message: 'Limite deve ser um número inteiro entre 1 e 100',
    }),
});