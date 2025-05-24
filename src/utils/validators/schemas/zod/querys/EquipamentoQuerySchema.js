import { z } from "zod";

export const EquipamentoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "ID inválido",
});

export const EquipamentoQuerySchema = z.object({
  categoria: z.string().optional(),
  status: z.enum(["ativo", "inativo", "pendente"]).optional(),
  minValor: z.coerce.number().min(0).optional(),
  maxValor: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});
