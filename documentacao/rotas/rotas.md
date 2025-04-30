## 1. Login de Usuário

### 1.1 POST /login 

#### Caso de Uso
- Permitir que os usuários (ou sistemas externos) entrem no sistema e obtenham acesso às funcionalidades internas.

#### Regras de Negócio
- Verificação de Credenciais: Validar login/senha.
- Bloqueio de Usuários:  Impedir o acesso de usuários desativados ou não confirmados.
- Gestão de Tokens: Gerar e armazenar tokens de acesso e refresh de forma segura, permitindo revogação futura.

#### Resultado Esperado
- Retorno dos tokens de acesso e refresh.
- Em caso de erro, mensagem de erro: "E-mail já cadastrado" ou "Dados inválidos".

### 1.2 POST  /register

#### Caso de Uso
- Permitir que novos usuários se cadastrem no sistema para acessar as funcionalidades do aplicativo, criando uma conta com suas informações pessoais.

#### Regras de Negócio
- Validação de Dados: Verificar se os campos obrigatórios (nome, e-mail, senha, telefone) 
- Confirmação de Cadastro: Enviar um e-mail de confirmação com um link para validar a conta antes de permitir o login
- Criptografia de Senha: Armazenar a senha de forma segura.

#### Caso de Uso
- Usuário cadastrado com sucesso.
- Em caso de erro, mensagem de erro: "E-mail já cadastrado" ou "Dados inválidos".

## 2. Equipamentos

### 2.1 POST /equipamentos

#### Caso de Uso
- Cadastrar um novo equipamento para locação.

#### Regras de Negócio
- Atributos obrigatórios: nome, descrição, categoria, valor da diária/semanal/mensal, disponibilidade.
- Equipamentos ficam inativos até aprovação do administrador.

#### Resultado Esperado
- Equipamento cadastrado.
- Aguardando aprovação.


### 2.2 GET  /equipamentos

#### Caso de Uso
- Listar equipamentos cadastrados.

#### Regras de Negócio
- Filtros: categoria, status, faixa de valor.
- Paginação.

#### Resultado Esperado
- Lista de equipamentos com filtros.
- Metadados de paginação.


### 2.3 GET /equipamentos/:id

#### Caso de Uso
- Detalhar equipamento específico.

#### Regras de Negócio
- Mostrar somente equipamentos ativos ou se for o proprietário.

#### Resultado Esperado
- Detalhes do equipamento.


### 2.4 PATCH /equipamentos/:id

#### Caso de Uso
- Atualizar dados do equipamento.

#### Regras de Negócio
- Apenas o locador pode editar.
- Mudanças críticas requerem nova aprovação.

#### Resultado Esperado
- Dados atualizados.


### 2.5 DELETE /equipamentos/:id

#### Caso de Uso
- Inativar um equipamento.

#### Regras de Negócio
- Não pode estar com locações ativas.

#### Resultado Esperado
- Equipamento inativado.

## 3. Reservas

### 3.1 POST /reservas

#### Caso de Uso
- Realizar uma nova reserva de equipamento.

#### Regras de Negócio
- Verificar disponibilidade no período.
- O equipamento deve estar aprovado.
- Gerar notificação para o locador.

#### Resultado Esperado
- Reserva criada com status "pendente" até a aprovação do locador.

### 3.2 GET /reservas

#### Caso de Uso
- Listar reservas do usuário ou dos seus equipamentos.

#### Regras de Negócio
- Filtro por status, data, locador ou locatário.

#### Resultado Esperado
- Lista dos equipamentos reservados. 

## 4. Usuario

### 4.1 GET /usuario/:id

#### Caso de Uso
- Obter detalhes de um usuário específico.

#### Regras de Negócio
- Validação de Existência: verificar se o usuário existe.
- Controle de Permissão: o próprio usuário ou administradores podem visualizar.

#### Resultado Esperado
- Detalhamento completo: nome, e-mail, status, foto.
- Erro caso não encontrado ou sem permissão.

### 4.2 PATCH /usuario/:id

#### Caso de Uso
- Atualizar informações do usuário.

#### Regras de Negócio
- Garantir a existência do usuário.
- Garantir que os dados estejam em formato válido. 

#### Resultado Esperado
- Dados atualizados com sucesso.
- Erro em caso de duplicidade ou violação de regras.


## Considerações Finais

- Segurança: Implementação de mecanismos de autenticação, autorização e registro de logs.

- Validação e Tratamento de Erros: Validar entradas dos usuários e retornar mensagens de erro claras.

- Escalabilidade e Performance: Aplicação de filtros, paginação e caching para otimizar o desempenho.

- Documentação e Monitoramento: Manter uma documentação atualizada dos endpoints e monitorar as requisições.





