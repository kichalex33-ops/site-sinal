const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  }
});

const normalize = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);

async function verifyTurnstile(token, secret, ip) {
  if (!secret) return false;
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token || "");
  if (ip) form.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  if (!res.ok) return false;
  const result = await res.json();
  return result.success === true;
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ comments: [], enabled: false });
  const url = new URL(request.url);

  if (url.searchParams.get("featured") === "1") {
    const result = await env.DB.prepare(
      `SELECT id, chapter_id, display_name, comment_text, created_at
       FROM comments
       WHERE status = 'approved'
       ORDER BY created_at DESC
       LIMIT 6`
    ).all();
    return json({ comments: result.results || [], enabled: true });
  }

  const chapterId = normalize(url.searchParams.get("chapter_id"), 80);
  if (!chapterId) return json({ error: "chapter_id obrigatório" }, 400);

  const result = await env.DB.prepare(
    `SELECT id, chapter_id, display_name, comment_text, created_at
     FROM comments
     WHERE chapter_id = ? AND status = 'approved'
     ORDER BY created_at DESC
     LIMIT 60`
  ).bind(chapterId).all();

  return json({ comments: result.results || [], enabled: true });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "Comentários ainda não configurados." }, 503);
  if (!env.TURNSTILE_SECRET_KEY && env.COMMENTS_ALLOW_UNVERIFIED !== "1") {
    return json({ error: "Proteção anti-spam ainda não configurada." }, 503);
  }

  let payload;
  try { payload = await request.json(); }
  catch { return json({ error: "JSON inválido." }, 400); }

  if (normalize(payload.website, 200)) return json({ ok: true, pending: true }); // honeypot

  const chapterId = normalize(payload.chapter_id, 80);
  const displayName = normalize(payload.display_name, 40);
  const commentText = normalize(payload.comment_text, 1200);
  const token = normalize(payload.turnstile_token, 4096);

  if (!/^chapter-[1-3]$/.test(chapterId)) return json({ error: "Capítulo inválido." }, 400);
  if (displayName.length < 2) return json({ error: "Informe um nome ou apelido." }, 400);
  if (commentText.length < 8) return json({ error: "O comentário está curto demais." }, 400);

  if (env.TURNSTILE_SECRET_KEY) {
    const ip = request.headers.get("CF-Connecting-IP") || "";
    const verified = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip);
    if (!verified) return json({ error: "Verificação anti-spam não concluída." }, 400);
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO comments (id, chapter_id, display_name, comment_text, status, created_at)
     VALUES (?, ?, ?, ?, 'pending', ?)`
  ).bind(id, chapterId, displayName, commentText, createdAt).run();

  return json({ ok: true, pending: true, message: "Comentário recebido e enviado para moderação." }, 201);
}
