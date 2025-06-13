import { z } from "zod";

const categoriasValidas = [
  "Furadeira",
  "Serra Elétrica",
  "Multímetro",
  "Parafusadeira",
  "Lixadeira",
  "Compressor de Ar",
  "Soldador",
  "Betoneira",
];

export const equipamentoSchema = z.object({
  equiNome: z.string({ required_error: 'Nome obrigatório' }).min(2, 'Nome deve ter pelo menos 2 caracteres'),
  equiDescricao: z.string({ required_error: 'Descrição obrigatória' }),
  equiValorDiaria: z.number({
    required_error: "Valor da diária é obrigatório",
    invalid_type_error: "Valor da diária deve ser um número",
  }).positive({ message: "Valor da diária deve ser maior que 0" }),
  equiQuantidadeDisponivel: z.number({
    required_error: "Quantidade é obrigatória",
    invalid_type_error: "Quantidade deve ser um número",
  }).int({ message: "Quantidade deve ser um número inteiro" }).nonnegative({ message: "Quantidade deve ser maior ou igual a 0" }),
  equiCategoria: z.enum(categoriasValidas, {
    errorMap: () => ({ message: 'Categoria inválida' }),
  }),
  equiFoto: z.array(
    z.string().url({ message: "Cada item deve ser uma URL válida" })
  ).min(1, "Pelo menos uma foto é obrigatória"),
});

export const equipamentoUpdateSchema = z.object({
  equiValorDiaria: z.number({
    invalid_type_error: "Valor da diária deve ser um número",
  }).positive({ message: "Valor da diária deve ser maior que 0" }).optional(),
  equiQuantidadeDisponivel: z.number({
    invalid_type_error: "Quantidade disponível deve ser um número",
  }).int({ message: "Quantidade disponível deve ser um número inteiro" }).nonnegative({ message: "Quantidade disponível deve ser maior ou igual a 0" }).optional(),
  equiStatus: z.enum(['ativo', 'inativo'], {
    invalid_type_error: "Status deve ser 'ativo' ou 'inativo'",
  }).optional(),
}).strict({ message: "Campos não permitidos no objeto" });

export const motivoReprovacaoSchema = z.object({
  motivoReprovacao: z.string({ required_error: 'Motivo de reprovação é obrigatório' }).min(5, 'Motivo deve ter pelo menos 5 caracteres'),
});