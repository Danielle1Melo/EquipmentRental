# Plano de Teste

**Projeto Aluguel de Equipamentos**

*versão 2.0*    

## Histórico das alterações 

   Data    | Versão |    Descrição   | Autor(a)
-----------|--------|----------------|-----------------
20/05/2025 |  1.0   | Primeira Versão Da API | Danielle Melo
27/05/2025 |  2.0   | Primeira Versão Da API | Danielle Melo

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


### REQUISITOS FUNCIONAIS

| IDENTIFICADOR | NOME                                      | DESCRIÇÃO                                                                                                                                                                                                                                                                              | PRIORIDADE |
|:--------------|:------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------|
| RF-001        | Cadastrar Usuário                         | O sistema deve permitir o cadastro de usuários, coletando informações como nome completo, e-mail, senha, número de telefone e endereço. A senha deve ser validada com critérios de segurança, e um e-mail de confirmação deve ser enviado para ativação da conta.                      | Essencial  |
| RF-002        | Realizar Login                            | O sistema deve permitir que usuários façam login com autenticação via senha. Deve haver a opção de recuperação de senha em caso de esquecimento.                                                                                                                                       | Essencial  |
| RF-003        | Gerenciar Perfil do Usuário               | O sistema deve permitir que o usuário acesse e edite seu perfil, incluindo nome, e-mail, telefone, endereço e senha. O usuário também poderá visualizar o histórico de reservas, anúncios de locação criados e mensagens no chat.                                                      | Importante |
| RF-004        | Anunciar Equipamento para Aluguel         | O sistema deve permitir que usuários anunciem equipamentos para locação. Será necessário um processo de verificação para garantir que os dados do equipamento estejam completos. O usuário poderá definir o preço, o período de locação e outras características relevantes.           | Essencial  |
| RF-005        | Realizar Reserva de Equipamento           | O sistema deve permitir que usuários realizem a reserva de equipamentos com verificação de disponibilidade em tempo real. O pagamento será de responsabilidade do locador e deverá ser acordado via chat, podendo ser efetuado durante ou após o período de locação.                    | Essencial  |
| RF-006        | Exibir Equipamentos para Aluguel          | O sistema deve exibir de forma clara e organizada os anúncios de equipamentos disponíveis para locação na tela inicial. Deve haver filtros por categoria, faixa de preço e data de disponibilidade para facilitar a busca.                                                             | Essencial  |
| RF-007        | Comunicar-se via Chat                     | O sistema deve disponibilizar um chat para que usuários possam se comunicar com os responsáveis pelos anúncios de locação, pagamentos e entregas. O chat deve contar com notificações em tempo real para garantir agilidade na comunicação, possibilitando acordos e esclarecimento. | Desejável  |
| RF-008        | Visualizar Disponibilidade no Calendário  | O sistema deve exibir um calendário com os dias e horários disponíveis para locação dos equipamentos. Datas já reservadas devem ser automaticamente bloqueadas e atualizadas em tempo real.                                                     | Essencial  |
| RF-009        | Restringir Reserva sem Cadastro           | O sistema deve impedir que usuários não cadastrados realizem reservas. Caso tentem reservar um equipamento, serão redirecionados para a página de cadastro.                                                                                                                            | Essencial  |
| RF-010        | Restringir Anúncio sem Cadastro           | O sistema deve impedir que usuários não cadastrados anunciem equipamentos para aluguel. O cadastro completo será exigido antes da criação do anúncio.                                                                                            | Essencial  |
| RF-011        | Aprovar ou Rejeitar Anúncios              | O sistema deve permitir que administradores aprovem ou desaprovem anúncios de equipamentos para locação criados por usuários. O administrador poderá visualizar todas as informações do anúncio e deverá justificar a rejeição, com envio automático da justificativa ao usuário.     | Desejável  |
| RF-012        | Gerenciar Conflitos de Reserva por Atraso | O sistema deve identificar situações em que o atraso na devolução de um equipamento comprometa a reserva de outro usuário. A nova reserva deverá ser automaticamente cancelada. O sistema deve notificar imediatamente o usuário afetado com orientações para nova tentativa.            | Desejável  |


### REQUISITOS NÃO FUNCIONAIS

| IDENTIFICADOR | NOME | DESCRIÇÃO | PRIORIDADE |
|:---|:---|:---|:---|
|RNF-001|Segurança| O sistema deve garantir a proteção dos dados dos usuários e das reservas, utilizando práticas adequadas de segurança da informação, como firewalls, backups regulares e controle de acesso rigoroso.|Essencial|
|RNF-002|Criptografia de Dados Sensíveis|  Todos os dados sensíveis, como informações de pagamento e dados pessoais dos usuários, devem ser criptografados utilizando protocolos modernos e seguros, como SSL/TLS, para garantir a privacidade e integridade das informações.|Essencial|
|RNF-003| Interoperabilidade|O sistema deve ser acessível e funcional em diferentes dispositivos, como smartphones, tablets e computadores desktop. O design deve ser adaptável a diferentes tamanhos de tela, garantindo tanto uma boa experiência do usuário quanto uma navegação intuitiva e rápida.|Essencial|
|RNF-004| Usabilidade e Navegação |  A interface do sistema deve ser intuitiva e de fácil utilização para todos os usuários, incluindo administradores. O design deve seguir as melhores práticas de usabilidade, visando uma navegação eficiente e agradável.|Essencial|
|RNF-005| Plataforma Mobile |  O sistema deve ser desenvolvido como uma aplicação móvel, com versões compatíveis para iOS e Android, garantindo uma experiência de usuário consistente e de alta qualidade em dispositivos móveis.|Essencial|

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
