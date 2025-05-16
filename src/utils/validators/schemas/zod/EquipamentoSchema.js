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
  nome: z.string().min(2, "Nome obrigatório"),
  descricao: z.string().min(5, "Descrição obrigatória"),
  valorDiaria: z.coerce.number().positive("Valor da diária deve ser positivo"),
  quantidadeDisponivel: z.coerce.number().int().nonnegative(),
  categoria: z.enum(categoriasValidas),
  foto: z.string().url().optional(), 
});

export const equipamentoUpdateSchema = z.object({
  nome: z.string().min(2).optional(),
  descricao: z.string().min(5).optional(),
  valorDiaria: z.coerce.number().positive().optional(),
  quantidadeDisponivel: z.coerce.number().int().nonnegative().optional(),
  categoria: z.enum(categoriasValidas).optional(),
  foto: z.string().url().optional(),
});
