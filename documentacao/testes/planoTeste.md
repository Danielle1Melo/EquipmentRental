# Plano de Teste

**Projeto Aluguel de Equipamentos**

*versão 1.0*    

## Histórico das alterações 

   Data    | Versão |    Descrição   | Autor(a)
-----------|--------|----------------|-----------------
20/05/2025 |  1.0   | Primeira Versão Da API | Danielle Melo

## 1 - Introdução

O presente sistema tem como objetivo informatizar a gestão de aluguel de equipamentos, oferecendo funcionalidades que incluem o cadastro de equipamentos, gerenciamento de usuários, criação e controle de reservas, criação de publicações de equipamentos para aluguel e a finalização dos aluguéis. Qualquer usuário logado no aplicativo pode criar publicações de equipamentos, que devem ser confirmadas por um administrador antes de serem disponibilizadas para aluguel.

Este plano de teste descreve os cenários, critérios de aceitação e verificações que serão aplicados às principais funcionalidades do sistema, visando garantir o correto funcionamento das regras de negócio, a integridade dos dados e a experiência do usuário.

## 2 - Arquitetura da API

A aplicação adota uma arquitetura modular em camadas, implementada com as tecnologias Node.js, Express, MongoDB (via Mongoose) e Zod para validação de dados. O objetivo é garantir uma estrutura clara, escalável e de fácil manutenção, com separação de responsabilidades e aderência a boas práticas de desenvolvimento backend.

### Camadas;

**Routes**: Responsável por definir os endpoints da aplicação e encaminhar as requisições para os controllers correspondentes. Cada recurso do sistema possui um arquivo de rotas dedicado.

**Controllers**: Gerenciam a entrada das requisições HTTP, realizam a validação de dados com Zod e invocam os serviços adequados. Também são responsáveis por formatar e retornar as respostas.

**Services**: Esta camada centraliza as regras de negócio do sistema. Ela abstrai a lógica do domínio, orquestra operações e valida fluxos antes de interagir com a base de dados.

**Repositories**: Encapsulam o acesso aos dados por meio dos modelos do Mongoose, garantindo que a manipulação do banco esteja isolada da lógica de negócio.

**Models**: Definem os esquemas das coleções do MongoDB, com o uso de Mongoose, representando as entidades principais do sistema como livros, leitores e empréstimos.

**Validations**: Utiliza Zod para garantir que os dados recebidos nas requisições estejam no formato esperado, aplicando validações personalizadas e mensagens de erro claras.

**Middlewares**: Implementam funcionalidades transversais, como autenticação de usuários com JWT, tratamento global de erros, e controle de permissões por tipo de perfil.

## 3 - Categorização  dos  Requisitos  em  Funcionais  x  Não Funcionais

## 4 - Casos de Teste

Os casos de teste serão implementados ao longo do desenvolvimento, organizados em arquivos complementares. De forma geral, serão considerados cenários de sucesso, cenários de falha e as regras de negócio associadas a cada funcionalidade.

## 5 - Estratégia de Teste

A estratégia de teste adotada neste projeto busca garantir a qualidade funcional e estrutural do sistema da biblioteca por meio da aplicação de testes em múltiplos níveis, alinhados ao ciclo de desenvolvimento.

Serão executados testes em todos os níveis conforme a descrição abaixo.

**Testes Unitários**: Focados em verificar o comportamento isolado das funções, serviços e regras de negócio, o código terá uma cobertura de 60% de testes unitários, que são de responsabilidade dos desenvolvedores.

**Testes de Integração**: Verificarão a interação entre diferentes camadas (ex: controller + service + repository) e a integração com o banco de dados, serão executados testes de integração em todos os endpoints, e esses testes serão dos desenvolvedores.

**Testes Manuais**: Realizados pontualmente na API por meio do Swagger ou Postman, com o objetivo de validar diferentes fluxos de uso e identificar comportamentos inesperados durante o desenvolvimento. A execução desses testes é de responsabilidade dos desenvolvedores, tanto durante quanto após a implementação das funcionalidades.

Os testes serão implementados de forma incremental, acompanhando o desenvolvimento das funcionalidades. Cada funcionalidade terá seu próprio plano de teste específico, com os casos detalhados, critérios de aceitação e cenários de sucesso e falha.

## 6 -	Ambiente e Ferramentas

Os testes serão feitos do ambiente de desenvolvimento, e contém as mesmas configurações do ambiente de produção.

As seguintes ferramentas serão utilizadas no teste:

Ferramenta | 	Time |	Descrição 
-----------|--------|--------
POSTMAN, Swagger UI 	| Desenvolvimento|	Ferramenta para realização de testes manuais de API
Jest|	Desenvolvimento |Framework utilizada para testes unitários e integração
Supertest|	Desenvolvimento|	Framework utilizada para testes de endpoints REST
MongoDB Memory Server|	Desenvolvimento|	Para testes com banco em memória, garantindo isolamento dos dados

## 7 - Classificação de Bugs

Os Bugs serão classificados com as seguintes severidades:

ID 	|Nivel de Severidade |	Descrição 
-----------|--------|--------
1	|Blocker |	●	Bug que bloqueia o teste de uma função ou feature causa crash na aplicação. <br>●	Botão não funciona impedindo o uso completo da funcionalidade. <br>●	Bloqueia a entrega. 
2	|Grave |	●	Funcionalidade não funciona como o esperado <br>●	Input incomum causa efeitos irreversíveis
3	|Moderada |	●	Funcionalidade não atinge certos critérios de aceitação, mas sua funcionalidade em geral não é afetada <br>●	Mensagem de erro ou sucesso não é exibida
4	|Pequena |	●	Quase nenhum impacto na funcionalidade porém atrapalha a experiência  <br>●	Erro ortográfico<br>● Pequenos erros de UI

### 8 - 	Definição de Pronto

Será considerada pronta as funcionalidades que passarem pelas verificações e testes descritas nos casos de teste, não apresentarem bugs com a severidade acima de moderada, e passarem por uma validação da equipe.
