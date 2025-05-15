import { z } from 'zod';
import objectIdSchema from './ObjectIdSchema.js';

const ReservaSchema = z.object({
  dataInicial: z.coerce.date({
    required_error: 'Campo data inicial é obrigatório.',
    invalid_type_error: 'A data inicial deve ser uma data válida.',
  }),
  dataFinal: z.coerce.date({
    required_error: 'Campo data final é obrigatório.',
    invalid_type_error: 'A data final deve ser uma data válida.',
  }),
  dataFinalAtrasada: z.coerce.date({
    invalid_type_error: 'A data final atrasada deve ser uma data válida.',
  }).optional(),
  quantidadeEquipamento: z.number({
    required_error: 'Campo quantidade de equipamento é obrigatório.',
    invalid_type_error: 'A quantidade de equipamento deve ser um número.',
  }).min(1, 'A quantidade de equipamento deve ser pelo menos 1.'),
  valorEquipamento: z.number({
    required_error: 'Campo valor do equipamento é obrigatório.',
    invalid_type_error: 'O valor do equipamento deve ser um número.',
  }).min(0, 'O valor do equipamento não pode ser negativo.'),
  enderecoEquipamento: z.string().min(1, 'Campo endereço do equipamento é obrigatório.'),
  status: z.enum(['pendente', 'confirmada', 'cancelada'], {
    invalid_type_error: 'O status deve ser pendente, confirmada ou cancelada.',
  }).default('pendente'),
  equipamento: objectIdSchema,
  usuario: objectIdSchema,
}).refine(
  (data) => data.dataFinal > data.dataInicial,
  {
    message: 'A data final da reserva deve ser posterior à data inicial.',
    path: ['dataFinal'],
  }
);

const ReservaUpdateSchema = ReservaSchema.partial();

export { ReservaSchema, ReservaUpdateSchema };