# Ary Estudos — código-fonte

Este diretório contém o código-fonte do aplicativo publicado em https://ary-estudos.anarabjs.chatgpt.site.

## Para editar com Claude

Abra o projeto dentro de `ary-estudos/`, preservando os demais arquivos do repositório Meu-site. A interface principal está em `app/study-app.tsx`; a aparência está em `app/globals.css`. O projeto usa React/TypeScript e Vinext com APIs compatíveis com Next.js.

Instale as dependências com `pnpm install --frozen-lockfile`. Verifique tipos com `pnpm exec tsc --noEmit`. Há testes de comportamento em `tests/`.

## Hospedagem e dados

O aplicativo ativo continua no ChatGPT Sites. Um commit neste GitHub não publica automaticamente mudanças no Sites. O backend usa Cloudflare D1 e R2 e autenticação do ChatGPT Sites; GitHub Pages não executa essas APIs. Dados de usuários, arquivos enviados, credenciais e banco de produção não fazem parte desta cópia.

A configuração de hospedagem nesta cópia mantém os nomes dos bindings, sem vincular um novo deploy ao projeto de produção. Não altere os dados nem substitua a autenticação ao realizar mudanças visuais.

## Escopo solicitado

Modificar apenas o banner superior conforme a referência enviada: gradiente lavanda, saudação, cronômetro à esquerda, ilustração de notebook e livros ao centro e cartão motivacional à direita. Preserve os controles do cronômetro e as demais funcionalidades.
