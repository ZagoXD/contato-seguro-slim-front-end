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