# Calendário, aparência e tutorial

Integração incremental no mesmo projeto, com as tabelas `records` e `files` existentes. Nenhuma migração anterior foi alterada e nenhum dado atual foi substituído.

## Calendário

`event` armazena título, início, fim, dia inteiro, prioridade, cor, anotações, local, curso opcional e origem. Datas com horário são UTC; a interface usa America/Sao_Paulo. Eventos de dia inteiro têm início inclusivo e fim exclusivo. Formulários e servidor validam datas reais, duração positiva, título, prioridade e cor. A relação com o curso é validada por proprietário no servidor.

O calendário oferece mês e lista, navegação por mês, eventos de múltiplos dias, seleção de um dia, criação/edição/exclusão, filtros e prioridades textuais além das cores. Atividades, avaliações e prazos do TCC aparecem como referências somente de leitura e levam à área original. Os novos eventos participam da busca e do backup completo. Alterações usam a proteção de versão já existente contra conflitos entre abas.

## Agenda Google: transferência manual, sem sincronização automática

A descoberta de elegibilidade de plugins para Sites não está disponível no ambiente desta atualização. Por isso não foi declarada uma integração de workspace, não foram copiadas credenciais de terceiros e não foi implementado um OAuth fictício.

Cada evento oferece um link para abrir o formulário da Agenda Google com dados preenchidos; o usuário precisa confirmar em Salvar. O calendário também exporta ICS e importa arquivos ICS com conferência e seleção antes de salvar. As instruções seguem o fluxo oficial do Google em Configurações → Importar e exportar. Não há leitura da conta Google, sincronização em segundo plano, envio de convites, chave de API ou serviço pago.

As cores não são sincronizadas; a prioridade é incluída na descrição. Alterações e exclusões precisam ser feitas em cada agenda. Importações não substituem eventos anteriores. Recorrências viram ocorrências independentes no intervalo selecionado de até um ano. O limite é 2 MB, 3.000 componentes no arquivo, 1.000 eventos no intervalo e 20.000 passos de expansão. Frequências horárias, por minuto ou segundo são informadas e ignoradas. Eventos sem dados válidos são identificados na conferência. Fuso declarado e exceções de recorrência são tratados por ical.js; horários sem fuso usam São Paulo. O usuário deve conferir antes de importar.

## Aparência

Escolha Branco/Preto explícita no cabeçalho e em Configurações. As cores de fundo principais são branco e preto; cartões e contrastes reaproveitam o padrão existente. `settings` com preference `appearance` guarda o tema por conta. O armazenamento local é apenas fallback visual do dispositivo. Escritas de preferência são serializadas.

## Tutorial

`settings` com preference `tutorial` guarda `seen`, `enabled` e `completed`. Sem escolha registrada, aparece um convite com Quero tutorial / Não quero tutorial. Concluir, pular ou fechar registra a escolha; o guia não reabre automaticamente. Em falha de rede, fechar não bloqueia o aplicativo e a pessoa é informada de que a escolha pode reaparecer.

Um guia de sete passos destaca as áreas e botões reais, sem cadastrar dados ou alterar materiais durante a demonstração. A navegação aguarda o salvamento de textos abertos. As dicas contextuais são opcionais e aparecem sobre os botões ao passar o mouse ou usar foco. Configurações permite desativar/ativar dicas ou repetir o guia. A aba Tutorial é permanente e contém dez assuntos com passos, pesquisa e atalhos às áreas.

Calendário, prévia de importação e tutorial possuem rótulos acessíveis, controle por teclado, tratamento de foco e layouts adaptados a celular. No celular, o mês mostra contagens e os detalhes aparecem na lista do dia.

## Verificação

TypeScript, compilação de produção e testes com os endpoints reais/SQLite: cadastro, edição, conflitos, validação, exclusão, propriedade dos eventos e preferências por usuário. Testes verificam horário de São Paulo, limites de datas, múltiplos dias, ICS UTF-8 e ida/volta, recorrências/exceções, URLs preenchidas do Google e renderização do calendário/manual/convite opcional. A interação em navegador e a confirmação final na conta Google são realizadas pelo usuário; não foram anunciadas como sincronização validada.
