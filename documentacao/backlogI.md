# PROJETO DE SOFTWARE - Aluguel de Equipamentos

## REQUISITOS DO SISTEMA

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



## TAREFAS - Milestone 1

- [x] Requisitos (revisão)
- [x] Modelagem do Banco (revisão)
- [x] Protótipo Figma (revisão)
- [x] Documentação de cada rota (incluindo regras de negócio)

## TAREFAS - Milestone 2

- [ ] Requisitos Implementados na API (explicar como se deu a escolha e quantos vão ficar para a próxima milestone) 
- [ ] Documentação das rota implementadas (incluindo regras de negócio) 
- [ ] Plano de Teste do projeto com cenários de teste implementados (explicar o fluxo principal associando a regra de negócio aos testes)
- [ ] Teste unitário das funcionalidades implementadas (explicação do teste do fluxo principal, demonstrar a cobertura de testes unitários)



