# Testes manuais — Pessoa

| Feito | Teste | Resultado esperado | Resultado obtido |
| --- | --- | --- | --- |
| [ ] | Abrir Pessoas pelo menu e pela URL. | A tela abre e mostra os cadastros. | |
| [ ] | Conferir os dados na lista. | Nome, CPF, e-mail e nascimento corretos. | |
| [ ] | Navegar na paginação com mais de cinco pessoas. | Os registros aparecem nas páginas seguintes. | |
| [ ] | Conferir carregamento, lista vazia e erro na consulta. | Cada situação mostra a mensagem correta; permite tentar novamente após erro. | |
| [ ] | Cadastrar uma pessoa e recarregar a página. | Cadastro salvo e presente na lista. | |
| [ ] | Enviar campos vazios, CPF fora do formato e e-mail inválido. | O formulário informa os problemas e não envia. | |
| [ ] | Cadastrar CPF com zero inicial e conferir a data. | Zero preservado e nascimento sem mudança de dia. | |
| [ ] | Cadastrar CPF já existente. | Informa CPF duplicado e mantém os campos preenchidos. | |
| [ ] | Preencher, cancelar e abrir o cadastro novamente. | Não salva e abre o formulário limpo. | |
| [ ] | Clicar várias vezes em cadastrar, salvar ou excluir. | Envia uma vez enquanto estiver carregando. | |
| [ ] | Simular falha no cadastro ou na edição e tentar novamente. | Mostra erro, mantém os campos e permite novo envio. | |
| [ ] | Cadastrar com sucesso e simular erro ao atualizar a lista. | Informa falha na consulta sem tratar o cadastro como perdido. | |
| [ ] | Editar uma pessoa e recarregar a página. | Formulário abre preenchido e salva as alterações. | |
| [ ] | Editar sem mudar o CPF. | Salva normalmente. | |
| [ ] | Editar usando CPF de outra pessoa ou dados inválidos. | Informa o problema e não salva. | |
| [ ] | Cancelar a edição e abrir outra pessoa. | Descarta alterações e mostra os dados da pessoa correta. | |
| [ ] | Cancelar uma exclusão. | A pessoa continua cadastrada. | |
| [ ] | Excluir e recarregar a página. | A pessoa não aparece mais na lista. | |
| [ ] | Simular falha na exclusão e tentar novamente. | Mostra erro, mantém a linha e permite tentar novamente. | |
| [ ] | Tentar editar ou excluir uma pessoa que não existe mais. | Informa que não foi encontrada e atualiza a lista. | |
| [ ] | Cadastrar com CPF de pessoa excluída. | Mostra falha sem confirmar cadastro; o CPF continua reservado na API. | |
| [ ] | Usar a tela com teclado e em janela menor. | Campos, tabela e botões continuam utilizáveis. | |
| [ ] | Abrir Empresas e Relatos. | As telas continuam funcionando. | |
| [ ] | No épico 2, excluir uma pessoa vinculada a um relato. | O vínculo permanece e mostra “Pessoa indisponível”, sem quebrar a tela. | |
