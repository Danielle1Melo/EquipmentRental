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
   equiValorDiaria: z.number({
    required_error: "Valor da diária é obrigatório",
    invalid_type_error: "Valor da diária deve ser um número",
  }),
  equiQuantidadeDisponivel: z.number({
    required_error: "Quantidade é obrigatória",
    invalid_type_error: "Quantidade deve ser um número",
  }),
  equiCategoria: z.enum(categoriasValidas),
   equiFoto: z.array(
  z.string().url({ message: "Cada item deve ser uma URL válida" })
).min(1, "Pelo menos uma foto é obrigatória")
});

export const equipamentoUpdateSchema = z.object({
  equiValorDiaria: z.number().positive().optional(),
  equiQuantidadeDisponivel: z.number().int().nonnegative().optional(),
  equiStatus: z.boolean().optional()
}).strict();
