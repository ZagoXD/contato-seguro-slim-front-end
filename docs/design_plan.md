# Plano de design — Pessoa

## Resumo

O primeiro épico será desenvolvido na branch `feat/people`. A proposta é criar um cadastro central de pessoas, com os dados necessários para que elas possam ser vinculadas a relatos no próximo épico.

Nesta etapa, o membro de comitê deve conseguir cadastrar uma pessoa e consultar as pessoas já cadastradas. Cada pessoa pertence ao sistema, sem vínculo com uma empresa específica.

## Objetivo da entrega

- Permitir o cadastro de nome completo, CPF, e-mail e data de nascimento.
- Mostrar esses dados em uma listagem.
- Permitir editar e excluir pessoas cadastradas.
- Informar quando um CPF já estiver cadastrado.
- Manter a organização e o padrão visual das telas existentes.

Edição e exclusão serão incluídas como melhorias, utilizando os endpoints existentes. A busca poderá ser avaliada depois. O vínculo com relatos e os tipos de envolvimento serão tratados no épico 2.

## O que já existe

A tela de Empresas será a principal referência. Hoje ela separa a apresentação da página, o controle dos dados, as chamadas à API e os componentes do formulário.

O fluxo funciona assim:

1. A página é aberta e monta o contexto.
2. O contexto busca os dados por meio de um serviço.
3. O serviço usa o `Request` para chamar a API.
4. A resposta atualiza o estado e a tabela mostra os registros.

No cadastro, o modal envia os dados e solicita uma nova listagem depois que a API confirma a criação.

### Organização do código

| Parte | Responsabilidade |
| --- | --- |
| Página | Organizar o título, a tabela, o botão de cadastro e o modal. |
| Contexto | Compartilhar a lista, o carregamento, os erros e a abertura do modal. |
| Serviço | Representar uma operação da API e definir seus tipos de entrada e resposta. |
| Request | Montar a URL, enviar a requisição e ler o JSON retornado. |
| Formulário | Apresentar os campos e validar os valores antes do envio. |

## Tela de Pessoas

A tela seguirá o padrão de Empresas: título, botão Cadastrar pessoa e tabela. A listagem mostrará nome, CPF, e-mail e data de nascimento.

A tabela compartilhada será reaproveitada, com ID como chave e paginação local de cinco itens. A API retorna a lista completa.

A tela deve distinguir três situações:

1. Carregamento: exibir indicador de progresso.
2. Lista vazia: informar que não há pessoas cadastradas.
3. Falha na consulta: exibir mensagem de erro e permitir nova tentativa.

A exibição do ID como coluna auxiliar fica para a revisão da tela.

## Cadastro de pessoa

O botão Cadastrar pessoa abrirá um modal com os quatro campos obrigatórios. O usuário poderá cadastrar ou cancelar.

Durante o envio, o botão deve indicar carregamento e impedir novas submissões. Se houver erro, o formulário continuará aberto com os valores preenchidos. Após o sucesso, o modal será fechado, uma mensagem confirmará o cadastro e a listagem será atualizada.

### Regras dos campos

| Campo | Comportamento esperado |
| --- | --- |
| Nome completo | Obrigatório, sem exigir uma quantidade mínima de palavras. |
| CPF | Obrigatório, com 11 dígitos e sem pontuação no envio. Será tratado como texto para preservar zeros à esquerda. |
| E-mail | Obrigatório, com validação de formato. |
| Data de nascimento | Obrigatória. Exibição em `DD/MM/YYYY` e envio em `YYYY-MM-DD`. |

A entrada de CPF seguirá inicialmente o padrão do CNPJ na tela de Empresas: campo de texto com limite de caracteres e validação numérica. A API não verifica os dígitos verificadores do CPF, então essa regra não será acrescentada no front-end.

Para a data, será utilizado o seletor do Ant Design com Dayjs. A conversão para o formato da API será feita antes do envio, sem converter a data para UTC.

Idade mínima e bloqueio de datas futuras não estão definidos no PRD e ficam fora do escopo inicial.

## Edição e exclusão
### Nota
`A implementação do fluxo de Edição e exclusão não estavam previstas no épico, mas eu decidi implementar mesmo assim, reaproveitando os fluxos existentes das Empresas e Registros`

Cada linha terá ações para editar e excluir. A edição abrirá um modal com os dados atuais e reutilizará os campos e as validações do cadastro. O envio deverá conter os quatro campos, mesmo quando apenas um for alterado. Manter o CPF da própria pessoa é permitido; usar o de outra pessoa retorna conflito.

A exclusão exigirá confirmação, com indicação de carregamento e bloqueio de cliques repetidos. Após sucesso, a lista será atualizada e a seleção será limpa. Pessoa não encontrada (404) deverá gerar uma mensagem e atualização da lista.

A API faz exclusão lógica, sem remover fisicamente o registro. O CPF continua reservado pelo índice único do banco. A validação atual não considera pessoas excluídas, portanto uma tentativa de reutilizar esse CPF pode resultar em erro de banco em vez de conflito 409. Esse caso deverá receber tratamento de falha sem indicar sucesso.

Os envolvimentos não são excluídos junto com a pessoa, mas a relação pode retornar `person: null`. No épico 2, a interface deverá apresentar “Pessoa indisponível” nesses vínculos. Reutilização do CPF e recuperação dos dados de pessoas excluídas nos vínculos dependeriam de mudanças no back-end e não fazem parte desta implementação.

## Integração com a API

Os contratos estão descritos em API.md.

| Operação | Endpoint | Uso nesta entrega |
| --- | --- | --- |
| Listar pessoas | `GET /people` | Carregar a tabela e atualizá-la após um cadastro. |
| Cadastrar pessoa | `POST /people` | Enviar os quatro campos do formulário. |
| Consultar por ID | `GET /people/{id}` | Disponível, mas desnecessário para a listagem proposta. |
| Editar pessoa | `PUT /people/{id}` | Atualizar os quatro campos e retornar `data.person`. |
| Excluir pessoa | `DELETE /people/{id}` | Excluir logicamente o registro e atualizar a tabela. |

O modelo terá `id`, `name`, `cpf`, `email`, `birth_date`, `created_at`, `updated_at` e `deleted_at`. Os dois últimos podem ser nulos. O ID e as datas de controle são gerados pelo servidor; apenas os quatro dados do formulário serão enviados no cadastro.

A listagem retorna HTTP 200 com `data.people`. O cadastro retorna HTTP 201 com `data.person`.

A edição retorna `statusCode: 200` e `data.person`. A exclusão retorna `statusCode: 200`, sem `data`; seu serviço não deve exigir uma pessoa no retorno.

### Tratamento de erros

- CPF duplicado (409): exibir mensagem "CPF já cadastrado" junto ao campo CPF.
- Dados inválidos (422): informar o problema sem fechar o formulário.
- Pessoa não encontrada (404): informar a indisponibilidade e atualizar a lista.
- Falha de conexão ou servidor: informar a falha correspondente e permitir nova tentativa.

Serão reaproveitados `hasServiceError` e `handleServiceError`.

A unicidade do CPF será garantida pelo servidor. Uma consulta prévia no navegador não substitui essa validação.

## Arquivos envolvidos

A estrutura de Pessoas ficará em `client/src/domain/person/`.

| Arquivo | O que será feito |
| --- | --- |
| `client/src/pages/People.page.tsx` | Substituir o conteúdo de teste pela listagem e pelo acesso ao cadastro. |
| `person.type.ts` | Definir o modelo de pessoa. |
| `People.context.tsx` | Controlar a lista, o carregamento, os erros, a pessoa selecionada e os modais. |
| `api/list-people.service.ts` | Implementar a chamada de listagem. |
| `api/create-person.service.ts` | Implementar a chamada de cadastro. |
| `api/update-person.service.ts` | Implementar a edição. |
| `api/delete-person.service.ts` | Implementar a exclusão, com resposta sem `data`. |
| `components/PersonFields.tsx` | Criar os campos e suas validações. |
| `components/CreatePersonModal.tsx` | Controlar o envio e o resultado do cadastro. |
| `components/EditPersonModal.tsx` | Preencher o formulário e controlar a edição. |
| `components/PeopleActionsCell.tsx` | Apresentar edição e confirmação de exclusão. |

Os componentes compartilhados serão reaproveitados; qualquer alteração neles deve considerar os fluxos de Empresas e Relatos.

## Cuidados durante a implementação

`sleep(1000)` artificial.

Falhas no cadastro != Falhas na listagem. Devem possuir mensagems/fluxos diferentes: se o POST tiver sucesso e a busca falhar, tratar como se a pessoa ja estiver sido criada.

Os dados do formulário não devem aparecer em logs desnecessários. As chamadas de hooks devem seguir as regras do React, sem depender de condições.


# Plano de design — Envolvimento

## Resumo

Permite vincular pessoas a relatos e consultar o papel de cada envolvido.

## Objetivo da entrega

- Consultar os envolvidos de um relato.
- Vincular uma pessoa como relatante, testemunha, vítima ou denunciado.
- Impedir vínculos duplicados da mesma pessoa no mesmo relato.
- Mostrar claramente se o relato é anônimo ou identificado.
- Permitir remover um vínculo, utilizando o endpoint existente.

## Acesso aos envolvidos

A tabela de Relatos terá uma ação Envolvidos em cada linha. A ação abrirá um modal com a identificação do relato, a indicação de anonimato, a tabela de envolvidos e o botão Vincular pessoa.

A tabela mostrará nome, CPF, e-mail e tipo de envolvimento. A remoção terá confirmação e excluirá somente o vínculo, sem excluir a pessoa ou o relato.

Carregamento, lista vazia e falha de consulta terão estados distintos. Em caso de falha, será possível tentar novamente. Ao abrir outro relato, os dados da seleção anterior não deverão permanecer na tela.

## Tipos de envolvimento

1. Relatante (`whistleblower`).
2. Testemunha (`witness`).
3. Vítima (`victim`).
4. Denunciado (`denounced`).


## Vincular pessoa

O botão Vincular pessoa abrirá um formulário com pessoa e tipo de envolvimento, ambos obrigatórios.

O seletor utilizará as pessoas retornadas por `GET /people`, com pesquisa por nome ou CPF. Pessoas já vinculadas ao relato ficarão indisponíveis para seleção. A validação do servidor continuará sendo necessária para tratar alterações feitas em outra sessão.

Se não houver pessoas disponíveis, será exibida uma orientação para cadastrar na tela de Pessoas. Uma falha nessa consulta deverá permitir nova tentativa sem impedir a visualização dos envolvidos já carregados.

Durante o envio, novas submissões serão bloqueadas. Em falha, os campos serão preservados. Após sucesso, o formulário será fechado e a lista de envolvidos e o anonimato serão consultados novamente.

## Anonimato

A indicação Anônimo ou Identificado ficará no modal, junto à identificação do relato, usando `data.is_anonymous` retornado pela API.

Não haverá campo de anonimato no formulário do relato. Um relato sem relatante é anônimo, mesmo que possua testemunhas, vítimas ou denunciados. A remoção do último relatante deve atualizar essa indicação após uma nova consulta.

Enquanto a consulta estiver pendente ou com erro, o anonimato não deverá ser apresentado como confirmado. O indicador não será calculado a partir da quantidade de envolvidos nem da disponibilidade dos dados de uma pessoa.

A listagem geral de Relatos será preservada; a consulta de envolvimentos acontecerá ao abrir o modal, sem uma requisição adicional para cada linha da tabela.

## Integração com a API

Os contratos estão descritos em API.md.

| Operação | Endpoint | Resposta de sucesso |
| --- | --- | --- |
| Consultar envolvidos | `GET /records/{record_id}/involvements` | `data.involvements` e `data.is_anonymous`, com `statusCode: 200`. |
| Vincular pessoa | `POST /records/{record_id}/involvements` | `data.involvement`, com `statusCode: 201`. |
| Remover vínculo | `DELETE /records/{record_id}/involvements/{id}` | `statusCode: 200`, sem `data`. |
| Consultar pessoas | `GET /people` | `data.people`, com `statusCode: 200`. |

O POST receberá apenas `person_id` e `type`. O relato será identificado pela URL. No DELETE, `id` é o ID do envolvimento, não o da pessoa.

O modelo do vínculo terá `id`, `record_id`, `person_id`, `type`, `created_at`, `updated_at` e `deleted_at`. Os dois últimos podem ser nulos. Na listagem, haverá também `person`, do tipo `Person.Model | null`. O retorno do cadastro não inclui necessariamente essa relação, por isso a lista será buscada novamente após o envio.

Os serviços seguirão o padrão existente de `Request`, tipos de resposta e tratamento de erros. A exclusão deverá aceitar o sucesso sem `data` e verificar o `statusCode` antes de confirmar a remoção.

### Tratamento de erros

- Vínculo duplicado (409): informar que a pessoa já está vinculada e atualizar as opções disponíveis.
- Dados inválidos (422): informar o problema e manter o formulário aberto.
- Pessoa, relato ou vínculo não encontrado (404): atualizar a consulta correspondente. Se o relato não existir mais, fechar o modal, limpar a seleção e atualizar Relatos.
- Falha de conexão ou servidor: informar a falha e permitir nova tentativa.

Se o envio ou a remoção tiver sucesso e a consulta seguinte falhar, a mensagem deverá identificar a falha na atualização da lista, sem repetir a operação automaticamente.

## Limitações da API

A remoção do envolvimento é lógica. O índice único de `record_id` e `person_id` continua reservado após a exclusão. Uma tentativa de vincular novamente a mesma pessoa ao mesmo relato pode gerar erro de banco em vez de conflito 409. Remover e recriar não será oferecido como forma de alterar o papel.

Se uma pessoa for excluída, o envolvimento poderá continuar na resposta com `person: null`. Nesse caso, a tabela mostrará Pessoa indisponível, mantendo o papel e a ação de remover o vínculo. Se o vínculo for de relatante, o relato continuará identificado conforme o valor calculado pelo servidor.

Esses comportamentos serão tratados na interface, sem alterações no back-end.

## Arquivos envolvidos

A estrutura de envolvimentos ficará em `client/src/domain/involvement/`. A organização e a formatação seguirão os domínios existentes.

| Arquivo | O que será feito |
| --- | --- |
| `involvement.type.ts` | Definir os tipos do vínculo, dos papéis e da listagem com pessoa. |
| `api/list-involvements.service.ts` | Consultar envolvidos e anonimato por relato. |
| `api/create-involvement.service.ts` | Enviar pessoa e papel. |
| `api/delete-involvement.service.ts` | Remover o vínculo pelo seu ID. |
| `Involvements.context.tsx` | Controlar consulta, pessoas disponíveis, carregamento, erros e formulário do relato selecionado. |
| `components/InvolvementsModal.tsx` | Apresentar anonimato, listagem e acesso ao formulário. |
| `components/InvolvementFields.tsx` | Apresentar os seletores de pessoa e papel. |
| `components/CreateInvolvementModal.tsx` | Controlar validação, envio e retorno do formulário. |
| `components/InvolvementsActionsCell.tsx` | Confirmar e executar a remoção do vínculo. |
| `client/src/domain/record/Records.context.tsx` | Adicionar o controle de abertura do modal de envolvidos, reutilizando a seleção de relato. |
| `client/src/domain/record/components/RecordsActionsCell.tsx` | Adicionar a ação Envolvidos. |
| `client/src/pages/Records.page.tsx` | Montar o modal para o relato selecionado. |