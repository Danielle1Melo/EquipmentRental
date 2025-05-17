export function gerarDataAleatoria(idadeMinima=18, idadeMaxima=90) {
  const hoje = new Date();

  // Define o intervalo de tempo (em anos)

  // Calcula as datas limite
  const dataMin = new Date(hoje);
  dataMin.setFullYear(dataMin.getFullYear() - idadeMaxima);

  const dataMax = new Date(hoje);
  dataMax.setFullYear(dataMax.getFullYear() - idadeMinima);

  // Gera timestamp aleatório entre as datas
  const timestampAleatorio = dataMin.getTime() + Math.random() * (dataMax.getTime() - dataMin.getTime());

  // Cria a data com o timestamp aleatório
  const dataAleatoria = new Date(timestampAleatorio);

  return dataAleatoria.toISOString().split("T")[0];
}
