# TCC e estágio: integração incremental

O módulo utiliza as tabelas existentes `records` (registros com owner, kind, JSON, version e updated) e `files` (metadados de arquivos privados armazenados no R2). Nenhuma tabela ou migração aplicada foi substituída. Os cursos existentes continuam válidos; opções ausentes são apresentadas como “Ainda não sei”.

## Entidades

- `course.data.requiresTcc` e `requiresInternship`: Sim / Não / Ainda não sei.
- `tccProject`: course, title, institution, theme, type, advisor, deadline, status, author e preferências de exportação. A inicialização usa um ID derivado do curso; backups criam um curso independente.
- `tccIdea`: course, title, description, subjectName, interest, notes, links, date, sourceId/sourceKind e convertedProject. Independe da existência de projeto.
- `tccResearch`: project/course e campos independentes do planejamento.
- `tccSection`: project/course, title, order, content TipTap e comentários.
- `tccReference`: project/course, dados bibliográficos manuais, PDF opcional e fichamento. Não há geração de referências nem normalização automática para ABNT.
- `tccRules`: project/course, exigências institucionais; os arquivos ficam vinculados como regras.
- `tccGuidance`: project/course, data, professor, assunto, comentários, alterações, tarefas, prazo e situação.
- `tccTask`: project/course, título, tipo, prazo, observações e situação; pode referenciar orientação.
- `tccProgress`: project/course, parte configurável e percentual de 0 a 100. Progresso geral é a média das partes.
- `tccLink`: project/course, targetKind/targetId, papel e observações. Arquivos e conteúdos existentes não são duplicados.
- `revision`: reutilizada, com target, sourceKind, project/course, snapshot e data. Compatibilidade mantida com histórico de resumos via summary/subject.
- `internship`: course e acompanhamento básico de empresa, área, supervisor, período, horas, atividades, relatórios e documentos pendentes.

## Persistência e segurança

A autenticação e isolamento por owner continuam nos endpoints existentes. Relações TCC são validadas no servidor; curso e projeto original não podem ser trocados silenciosamente. Alterações usam comparação de versão e transação; conflitos preservam o conteúdo local. Salvamento individual e em lote preservam até 30 versões por registro. Restaurar grava uma nova versão. Formulários e editor fazem autosave, aguardam a conclusão ao navegar e alertam antes de fechar com alterações pendentes.

Uploads permanecem privados, com validação de assinatura/tipo, até 10 MB por arquivo e 200 MB por conta. Exclusões são bloqueadas para arquivos usados em conteúdo, ideias, referências ou histórico. A exclusão explícita de uma seção exige confirmação e remove suas versões; exporte backup antes de excluir se precisar preservá-las.

O backup ZIP inclui dados, versões e arquivos. A restauração remapeia cursos, projetos, seções, referências, vínculos, imagens e snapshots para IDs novos; não substitui registros atuais. Em falhas durante a restauração, itens já restaurados permanecem e o erro é apresentado. Backups antigos JSON não contêm bytes de materiais.

## Navegação e exportação

Área dentro do curso: Painel, Ideias, Pesquisa, Referências, Escrita, Regras, Orientações, Cronograma, Progresso, Vínculos, Exportar e ChatGPT. Ideias são acessíveis antes da ativação do TCC. Busca global inclui todos os registros novos, exceto snapshots históricos. Identidade visual e temas existentes são reaproveitados.

PDF e DOCX são produzidos localmente no navegador por bibliotecas gratuitas, com prévia, autoria configurável, ordem das seções, imagens, tabelas, grifos e paginação. Margens e tipografia são configuráveis. A paginação DOCX pode variar no Word. Não se presume conformidade com um modelo institucional; o usuário confere o manual.

O contexto para ChatGPT é composto apenas pelos campos marcados e mostrado integralmente antes da cópia. Não há API de IA, chave, transmissão automática ou assinatura externa obrigatória.

## Verificação desta integração

TypeScript, build de produção e testes dos endpoints reais com SQLite: conflitos, propriedade dos registros/arquivos, validação dos uploads, bloqueio de exclusão, snapshots e restauração. Testes de exportação verificam DOCX válido, ordem, tabelas, grifos, autoria, páginas; PDF é gerado e inspecionado. Utilitários verificam seleção exclusiva do contexto e remapeamento do backup. Testes existentes de planejamento, métricas, importação e revisão foram mantidos e executados. Interação visual em navegador permanece para o teste do usuário.
