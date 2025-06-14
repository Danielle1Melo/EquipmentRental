import Equipamento from "../models/Equipamento.js";
import getGlobalFakeMapping from "./globalFakeMapping.js";

async function SeedEquipamentos(usuarios, enderecos) {
  await Equipamento.deleteMany();

  const fake = await getGlobalFakeMapping();

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

  const equipamentos = [];

  for (let i = 0; i < usuarios.length; i++) {
    const status = fake.equiStatus();
    equipamentos.push({
      equiNome: fake.equiNome(),
      equiDescricao: fake.equiDescricao(),
      equiValorDiaria: fake.equiValorDiaria(),
      equiQuantidadeDisponivel: fake.equiQuantidadeDisponivel(),
      equiCategoria: categoriasValidas[Math.floor(Math.random() * categoriasValidas.length)],
      equiStatus: status,
      equiUsuario: usuarios[i]._id,
      equiFoto: fake.equiFoto(),
      equiNotaMediaAvaliacao: 0,
      equiAvaliacoes: [],
    });
  }

  const result = await Equipamento.insertMany(equipamentos);
  console.log(`${result.length} Equipamentos inseridos com sucesso!`);
  return result;
}

export default SeedEquipamentos;