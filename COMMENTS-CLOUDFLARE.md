# Comentários literários — Cloudflare Pages + D1 + Turnstile

Os comentários existem somente em `/livro/amostra/`. Não reutilize este sistema nos dossiês factuais.

## 1. D1

Crie um banco D1 (ex.: `sinal-ruido-comments`) e aplique `schema/comments.sql`.
Vincule o banco ao Pages/Workers com o binding exatamente `DB`.

## 2. Turnstile

Crie um widget Turnstile para `sinalruido.com.br`.
- coloque a **site key pública** em `public/comments-config.js`;
- configure a **secret key** como variável secreta `TURNSTILE_SECRET_KEY` no Cloudflare;
- nunca coloque a secret key no Git.

Sem `TURNSTILE_SECRET_KEY`, POSTs são recusados em produção. Para teste local deliberado, `COMMENTS_ALLOW_UNVERIFIED=1` pode ser usado temporariamente.

## 3. Moderação

Todo comentário nasce como `pending`. Não existe painel administrativo público nesta fase.
A moderação pode ser feita pelo console D1:

```sql
SELECT id, chapter_id, display_name, comment_text, created_at
FROM comments
WHERE status = 'pending'
ORDER BY created_at ASC;
```

Aprovar:

```sql
UPDATE comments
SET status='approved', moderated_at=datetime('now')
WHERE id='ID_DO_COMENTARIO';
```

Rejeitar:

```sql
UPDATE comments
SET status='rejected', moderated_at=datetime('now')
WHERE id='ID_DO_COMENTARIO';
```

## 4. Privacidade

O banco não armazena e-mail nem IP. Armazena somente nome/apelido, comentário, capítulo, status e datas de moderação. A infraestrutura Cloudflare pode processar dados técnicos de conexão para entregar e proteger o serviço. Mantenha `/privacidade/` coerente com a configuração real.
