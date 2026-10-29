# Testes manuais — Pessoa

| Feito | Teste | Resultado esperado | Resultado obtido |
| --- | --- | --- | --- |
| [x] | Abrir Pessoas pelo menu e pela URL. | A tela abre e mostra os cadastros. | O mesmo do esperado |
| [x] | Conferir os dados na lista. | Nome, CPF, e-mail e nascimento corretos. | O mesmo do esperado |
| [x] | Navegar na paginação com mais de cinco pessoas. | Os registros aparecem nas páginas seguintes. | O mesmo do esperado |
| [x] | Conferir carregamento, lista vazia e erro na consulta. | Cada situação mostra a mensagem correta; permite tentar novamente após erro. | Mesmo do esperado. Testado desativando a rede no f12 |
| [x] | Cadastrar uma pessoa e recarregar a página. | Cadastro salvo e presente na lista. | O mesmo do esperado |
| [x] | Enviar campos vazios, CPF fora do formato e e-mail inválido. | O formulário informa os problemas e não envia. | O mesmo do esperado |
| [x] | Cadastrar CPF já existente. | Informa CPF duplicado e mantém os campos preenchidos. | O mesmo do esperado |
| [x] | Clicar várias vezes em cadastrar, salvar ou excluir. | Envia uma vez enquanto estiver carregando. | O mesmo do esperado |
| [x] | Simular falha no cadastro ou na edição e tentar novamente. | Mostra erro, mantém os campos e permite novo envio. | Testado desativando rede no f12. O mesmo do esperado |
| [x] | Editar uma pessoa e recarregar a página. | Formulário abre preenchido e salva as alterações. | O mesmo do esperado |
| [x] | Editar usando CPF de outra pessoa ou dados inválidos. | Informa o problema e não salva. | O mesmo do esperado |
| [x] | Excluir e recarregar a página. | A pessoa não aparece mais na lista. | O mesmo do esperado |
| [x] | Simular falha na exclusão e tentar novamente. | Mostra erro, mantém a linha e permite tentar novamente. | Testado desativando rede no f12. O mesmo do esperado |

# Testes manuais — Envolvimentos

| Feito | Teste | Resultado esperado | Resultado obtido |
| --- | --- | --- | --- |
| [x] | Abrir Envolvidos em relatos diferentes. | Mostra os dados do relato escolhido, sem misturar as listas. | O mesmo do esperado |
| [x] | Abrir um relato sem envolvidos. | Mostra lista vazia e indicação Anônimo. | O mesmo do esperado |
| [ ] | Vincular pessoas com os quatro tipos e recarregar a página. | Nome, CPF, e-mail e papel corretos; vínculos salvos. | |
| [ ] | Enviar sem selecionar pessoa ou tipo. | Informa os campos obrigatórios e não envia. | |
| [ ] | Buscar uma pessoa pelo nome e pelo CPF. | Encontra a pessoa nas duas buscas. | |
| [ ] | Tentar selecionar uma pessoa já vinculada. | A pessoa fica indisponível para um novo vínculo no mesmo relato. | |
| [ ] | Vincular a mesma pessoa em outro relato. | Permite o vínculo, inclusive com outro papel. | |
| [ ] | Conferir anonimato antes e depois de vincular um relatante. | Sem relatante, Anônimo; com relatante, Identificado. Outros papéis não mudam essa indicação. | |
| [ ] | Cancelar o formulário e a confirmação de remoção. | Não cria nem remove vínculos. | |
| [ ] | Remover o último relatante e recarregar a página. | Vínculo removido e relato Anônimo; pessoa e relato continuam cadastrados. | |
| [ ] | Desativar a rede ao consultar ou vincular e tentar novamente. | Mostra erro, preserva os campos do formulário e permite nova tentativa. | |
| [ ] | Excluir uma pessoa vinculada e consultar os envolvidos. | Mostra Pessoa indisponível, mantém o papel e permite remover o vínculo. | |
