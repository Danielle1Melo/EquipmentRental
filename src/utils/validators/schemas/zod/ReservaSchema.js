import { z } from 'zod';
import objectIdSchema from './ObjectIdSchema.js';

const ReservaSchema = z.object({
  dataInicial: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Data inicial inválida',
    })
    .transform((val) => new Date(val)),
  dataFinal: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Data final inválida',
    })
    .transform((val) => new Date(val)),
  dataFinalAtrasada: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Data final atrasada inválida',
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  valorEquipamento: z.number()
    .positive({ message: 'Valor do equipamento deve ser um número positivo' }),
  quantidadeEquipamento: z
    .number().int()
    .positive({ message: 'Quantidade de equipamento deve ser um número inteiro positivo' }),
  enderecoEquipamento: z
    .string()
    .min(1, { message: 'Endereço do equipamento é obrigatório' }),
  statusReserva: z
    .enum(['pendente', 'confirmada', 'cancelada'])
    .default('pendente'),
  equipamentos: z.array(objectIdSchema).default([]),
  usuarios: z.array(objectIdSchema).default([]),
})

const ReservaUpdateSchema = ReservaSchema.partial();

export { ReservaSchema, ReservaUpdateSchema };