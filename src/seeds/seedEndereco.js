import Endereco from "../models/Endereco.js";
import getGlobalFakeMapping from "./globalFakeMapping.js";

async function SeedEndereco(usuario) {
  await Endereco.deleteMany();

  const fake = await getGlobalFakeMapping();

  const enderecos = [];

  for (let i = 0; i < usuario.length; i++) {
    enderecos.push({
      endeLogradouro: fake.endeLogradouro(),
      endeNumero: fake.endeNumero(),
      endeBairro: fake.endeBairro(),
      endeUf: fake.endeUf(),
      endeCep: fake.endeCep(),
      endeCidade: fake.endeCidade(),
      endeComplemento: fake.endeComplemento(),
      usuario: usuario[i]._id,
    });
  }

  await Endereco.insertMany(enderecos);

  // console.log(`${enderecos.length} endereços inseridos com sucesso.`);

  return await Endereco.find();
}

export default SeedEndereco;
