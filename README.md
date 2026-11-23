# Neuroquiz

Protótipo inicial de uma plataforma de quizzes em português, com visual futurista.

## Arquivos
- `index.html`: estrutura do site
- `styles.css`: visual responsivo
- `app.js`: perguntas, pontuação e perfil local

## Publicar gratuitamente no GitHub Pages
1. Envie os três arquivos (`index.html`, `styles.css`, `app.js`) para a raiz do repositório público `neuroquiz`.
2. No GitHub, abra **Settings** → **Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch **main** e a pasta **/(root)**; clique em **Save**.
5. Aguarde a publicação. O endereço será `https://neuroquizbr.github.io/neuroquiz/` (se esse for o nome de usuário da conta).

## Importante sobre contas e privacidade
Este primeiro protótipo guarda nome e histórico apenas no armazenamento local do navegador (`localStorage`). Isso **não é um cadastro seguro** e os dados não sincronizam entre dispositivos. Não use senha nem dados sensíveis nesta versão.

A próxima etapa é conectar autenticação e banco de dados com Supabase, configurar as regras de segurança (RLS) e só então habilitar cadastro/login reais. Nunca coloque uma `service_role` key no código do navegador. Use apenas a chave pública/anon ou publishable, com políticas RLS corretas.

## Personalização
As perguntas iniciais estão no objeto `quizData` dentro de `app.js`. Edite os textos e alternativas mantendo o índice `c` apontando para a alternativa correta (começa em zero).
