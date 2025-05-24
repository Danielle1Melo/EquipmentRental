import { z } from "zod";

const categoriasValidas = [
  "Furadeira",
  "Serra Elétrica",
  "Multímetro",
  "Parafusadeira",
  "Lixadeira",
  "Compressor de Ar",
  "Soldador",
  "Betoneira"
];

export const equipamentoSchema = z.object({
  equiNome: z.string().min(2, "Nome obrigatório"),
  equiDescricao: z.string().min(5, "Descrição obrigatória"),
  equiValorDiaria: z.coerce.number().positive("Valor da diária deve ser positivo"),
  equiQuantidadeDisponivel: z.coerce.number().int().nonnegative(),
  equiCategoria: z.enum(categoriasValidas),
  equiFoto: z.string().url().optional(), 
});

export const equipamentoUpdateSchema = z.object({
  equiNome: z.string().min(2).optional(),
  equiDescricao: z.string().min(5).optional(),
  equiValorDiaria: z.coerce.number().positive().optional(),
  equiQuantidadeDisponivel: z.coerce.number().int().nonnegative().optional(),
  equiCategoria: z.enum(categoriasValidas).optional(),
  equiFoto: z.string().url().optional(),
  avaliacao: z.string().length(24).optional()
});