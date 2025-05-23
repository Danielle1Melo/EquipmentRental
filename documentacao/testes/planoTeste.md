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

## 5 - Estratégia de Teste

## 6 -	Ambiente e Ferramentas

## 7 - Classificação de Bugs

### 8 - Definição de Pronto 