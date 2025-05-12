import Endereco from "../models/Endereco.js";
import getGlobalFakeMapping from "./globalFakermapping.js";

async function SeedEndereco(usuarios) {
  await Endereco.deleteMany();

  const fake = await getGlobalFakeMapping();

  const enderecos = [];

  for (let i = 0; i < usuarios.length; i++) {
    enderecos.push({
      endeLogarduro: fake.endeLogarduro(),
      endeNumero: fake.endeNumero(),
      endeBairro: fake.endeBairro(),
      endeUf: fake.endeUf(),
      endeCep: fake.endeCep(),
      endeCidade: fake.endeCidade(),
      endeComplemento: fake.endeComplemento(),
      usuario: usuarios[i]._id,
    });
  }

  await Endereco.insertMany(enderecos);

  console.log(`${enderecos.length} endereços inseridos com sucesso.`);
}

export default SeedEndereco;
