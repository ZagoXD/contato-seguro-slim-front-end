# Plano de implementação — Pessoa

## Objetivo

Implementar cadastro, consulta, edição e exclusão de pessoas na branch `feat/people`, conforme o plano de design, utilizando a API existente.

## Etapas

### 1. Modelo de pessoa

- [x] Criar `client/src/domain/person/person.type.ts` com `Person.Model`, conforme o contrato da API.

Manter CPF como string e permitir valores nulos em `updated_at` e `deleted_at`.

### 2. Serviço de listagem

- [x] Criar `domain/person/api/list-people.service.ts` com `listPeople`.

Utilizar `Request.get('/people')` e tipar a resposta com `data.people` e os erros compartilhados.

### 3. Contexto de Pessoas

- [x] Criar `domain/person/People.context.tsx` com provider, hook de acesso e `fetchPeople`.

Controlar lista, carregamento e erro. Buscar os dados ao montar o contexto e verificar a resposta antes de atualizar a lista.

### 4. Listagem na página

- [x] Substituir o conteúdo provisório de `pages/People.page.tsx` pela tabela integrada ao contexto.

Exibir nome, CPF, e-mail e nascimento em `DD/MM/YYYY`. Reaproveitar a paginação e apresentar carregamento, lista vazia e erro com nova tentativa.

Validação: acessar pelo menu e pela URL, comparar os registros com a API e conferir os estados da consulta.

### 5. Campos do formulário

- [x] Criar `domain/person/components/PersonFields.tsx`.

Adicionar os quatro campos obrigatórios, CPF com 11 dígitos, validação de e-mail e seletor de nascimento com Dayjs. Separar o tipo dos valores do formulário do formato enviado à API.

### 6. Modal de cadastro

- [x] Criar `domain/person/components/CreatePersonModal.tsx` e conectar o botão Cadastrar pessoa à página.

Adicionar o controle de abertura ao contexto. Utilizar `Form.useForm` para validar os campos e limpar o formulário ao cancelar.

Validação: abrir, cancelar e reabrir o modal; conferir obrigatoriedade e formatos inválidos.

### 7. Serviço de cadastro

- [x] Criar `domain/person/api/create-person.service.ts` com `createPerson`.

Enviar apenas `name`, `cpf`, `email` e `birth_date` pelo `Request.post('/people', body)`. Tipar o retorno com `data.person` e os erros previstos.

### 8. Envio e atualização da lista

- [x] Integrar o modal ao serviço de cadastro.

Converter o nascimento para `YYYY-MM-DD`, indicar carregamento e impedir submissões repetidas. Após sucesso, confirmar o cadastro, fechar o modal e atualizar a lista, sem atraso artificial.

Validação: cadastrar uma pessoa e confirmar a persistência após recarregar a página. Conferir CPF com zero inicial e data de nascimento.

### 9. Tratamento de erros

- [x] Tratar CPF duplicado (409), dados inválidos (422) e falhas de conexão ou servidor.

Preservar os campos em caso de falha e permitir nova tentativa. Distinguir falha no POST de falha na atualização da lista após um cadastro concluído.

Validação: enviar CPF existente, corrigir e reenviar; simular falha de conexão e verificar a preservação dos dados e a liberação do botão.

### 10. Edição de pessoa

- [x] Criar `domain/person/api/update-person.service.ts` e `components/EditPersonModal.tsx` no mesmo domínio.
- [x] Adicionar a seleção e a abertura do modal ao contexto, com ação de edição em `domain/person/components/PeopleActionsCell.tsx`.

Reutilizar `PersonFields`, converter a data recebida para Dayjs e enviar os quatro campos pelo `PUT /people/{id}`. Tratar carregamento, conflito e pessoa não encontrada. Limpar a seleção ao fechar e atualizar a lista após sucesso.

Validação: editar e recarregar a página; salvar mantendo o CPF atual; tentar usar o CPF de outra pessoa; cancelar sem salvar e conferir a preservação dos dados em falhas.

### 11. Exclusão de pessoa

- [x] Criar `domain/person/api/delete-person.service.ts` e adicionar confirmação de exclusão em `PeopleActionsCell.tsx`.

Utilizar `DELETE /people/{id}` e tipar o sucesso sem `data`. Bloquear cliques repetidos, atualizar a lista após sucesso e tratar falhas ou pessoa não encontrada. A exclusão é lógica e não libera o CPF para reutilização.

Validação: cancelar sem excluir; confirmar e verificar a ausência na lista após recarregar; conferir nova tentativa após falha. Verificar também o retorno de vínculos existentes, que podem manter o envolvimento com `person: null`, e registrar essa limitação para o épico 2.


# Plano de implementação — Envolvimento

## Objetivo

Implementar consulta, vínculo e remoção de envolvidos por relato, com indicação de anonimato, conforme o plano de design.

Os caminhos abaixo são relativos a `client/src/`, exceto quando indicado.

## Etapas

### 1. Modelo de envolvimento

- [ ] Criar `domain/involvement/involvement.type.ts`.

Definir os quatro papéis, os campos do vínculo e o tipo de listagem com `person: Person.Model | null`. Separar a resposta de listagem do retorno de criação.

### 2. Serviços da API

- [ ] Criar os serviços de listagem, criação e exclusão em `domain/involvement/api/`.

Utilizar as rotas por relato e enviar apenas `person_id` e `type` no POST. Tipar `data.involvements`, `data.is_anonymous`, `data.involvement` e o sucesso de exclusão sem `data`.

### 3. Contexto de envolvidos

- [ ] Criar `domain/involvement/Involvements.context.tsx` para o relato selecionado.

Controlar lista, anonimato, carregamento e erro. Buscar os vínculos ao abrir o modal e limpar o estado ao trocar de relato. Respostas de uma seleção encerrada não deverão atualizar a nova seleção. O anonimato só será confirmado após uma consulta bem-sucedida.

### 4. Acesso pela tela de Relatos

- [ ] Adicionar o controle do modal em `Records.context.tsx` e a ação Envolvidos em `RecordsActionsCell.tsx`.
- [ ] Criar `domain/involvement/components/InvolvementsModal.tsx` e montá-lo em `pages/Records.page.tsx`.

Exibir a identificação do relato, o indicador de anonimato e a tabela com nome, CPF, e-mail e papel. Tratar carregamento, lista vazia e falha com nova tentativa. Ao fechar, limpar a seleção.

Validação: abrir relatos diferentes e conferir que lista e anonimato correspondem à seleção, sem manter dados do relato anterior.

### 5. Pessoas disponíveis e formulário

- [ ] Reutilizar `listPeople` no contexto, com carregamento e erro próprios.
- [ ] Criar `InvolvementFields.tsx` e `CreateInvolvementModal.tsx` em `domain/involvement/components/`.

Adicionar pessoa e papel como campos obrigatórios, pesquisa local por nome/CPF e bloqueio de pessoas já vinculadas. Apresentar orientação quando não houver opções e nova tentativa quando a consulta de pessoas falhar.

Validação: conferir os quatro papéis, a seleção de pessoas e os campos vazios. Cancelar sem enviar e reabrir com o formulário limpo.

### 6. Criação do vínculo

- [ ] Integrar o formulário ao serviço de criação.

Bloquear submissões repetidas e preservar os campos em falhas. Após sucesso, fechar o formulário e consultar novamente os vínculos e o anonimato.

Validação: vincular uma pessoa, recarregar e conferir a persistência. Vincular um relatante e verificar a mudança de Anônimo para Identificado. Permitir a mesma pessoa em outro relato.

### 7. Remoção do vínculo

- [ ] Criar `domain/involvement/components/InvolvementsActionsCell.tsx` com confirmação de remoção.

Enviar o ID do vínculo, bloquear cliques repetidos e conferir o retorno antes de confirmar sucesso. Atualizar vínculos, opções disponíveis e anonimato após a remoção, sem excluir a pessoa ou o relato.

Validação: cancelar sem remover; confirmar e recarregar. Remover o último relatante e conferir a indicação Anônimo. Registrar a limitação de tentar vincular novamente o mesmo par pessoa/relato.

### 8. Erros e pessoas excluídas

- [ ] Tratar duplicidade (409), dados inválidos (422), registros indisponíveis (404) e falhas de conexão ou servidor.
- [ ] Exibir Pessoa indisponível quando `person` for nulo, preservando papel e ação de remoção.

Atualizar a consulta correspondente em caso de registro não encontrado. Distinguir falha na operação de falha na consulta seguinte. Não confirmar anonimato nem sucesso de uma operação com base em dados incompletos.

Validação:* conferir vínculo duplicado, pessoa indisponível, relato removido e nova tentativa após falha. Um relatante com `person: null` deve seguir o anonimato informado pela API.

### 9. Revisão e testes

- [ ] Revisar mensagens, uso por teclado e apresentação em janela menor.
- [ ] Conferir os fluxos existentes de Pessoas, Empresas e Relatos.
- [ ] Executar TypeScript, lint, build e testes existentes, registrando eventuais falhas anteriores ao épico.
- [ ] Conferir persistência dos vínculos, anonimato e tratamento de falhas no fluxo completo.
- [ ] Revisar o diff e confirmar que as alterações estão restritas ao fluxo e que nenhum arquivo em `server/` foi alterado.
