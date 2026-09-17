const sections = [...document.querySelectorAll('[data-comments-root]')];

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const formatDate = (iso) => {
  try { return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(iso)); }
  catch { return ''; }
};

for (const section of sections) {
  const chapterId = section.dataset.chapterId || 'chapter-1';
  const list = section.querySelector('[data-comments-list]');
  const form = section.querySelector('[data-comment-form]');
  const status = section.querySelector('[data-comment-status]');
  const siteKey = window.SINAL_RUIDO_COMMENTS?.turnstileSiteKey || '';
  let turnstileWidgetId = null;

  async function loadComments() {
    if (!list) return;
    list.innerHTML = '<p class="mono comment-muted">Carregando comentários…</p>';
    try {
      const response = await fetch(`/api/comments?chapter_id=${encodeURIComponent(chapterId)}`, { headers: { accept: 'application/json' } });
      const data = await response.json();
      if (!data.enabled) {
        list.innerHTML = '<p class="comment-muted">Os comentários serão habilitados quando a área literária for publicada com moderação.</p>';
        return;
      }
      if (!Array.isArray(data.comments) || data.comments.length === 0) {
        list.innerHTML = '<p class="comment-muted">Ainda não há comentários aprovados neste capítulo.</p>';
        return;
      }
      list.innerHTML = data.comments.map((c) => `
        <article class="reader-comment">
          <div class="reader-comment__meta"><strong>${escapeHtml(c.display_name)}</strong><time>${escapeHtml(formatDate(c.created_at))}</time></div>
          <p>${escapeHtml(c.comment_text)}</p>
        </article>`).join('');
    } catch {
      list.innerHTML = '<p class="comment-muted">Comentários temporariamente indisponíveis.</p>';
    }
  }

  function setupTurnstile() {
    const host = section.querySelector('[data-turnstile]');
    if (!host || !siteKey) return;
    const tryRender = () => {
      if (!window.turnstile || host.dataset.rendered) return false;
      turnstileWidgetId = window.turnstile.render(host, { sitekey: siteKey, theme: 'auto' });
      host.dataset.rendered = 'true';
      return true;
    };
    if (!tryRender()) {
      const timer = setInterval(() => { if (tryRender()) clearInterval(timer); }, 250);
      setTimeout(() => clearInterval(timer), 10000);
    }
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector('button[type="submit"]');
    const fd = new FormData(form);
    const token = window.turnstile && turnstileWidgetId !== null ? window.turnstile.getResponse(turnstileWidgetId) : '';
    if (status) status.textContent = 'Enviando…';
    if (submit) submit.disabled = true;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          chapter_id: chapterId,
          display_name: fd.get('display_name'),
          comment_text: fd.get('comment_text'),
          website: fd.get('website'),
          turnstile_token: token
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível enviar.');
      form.reset();
      if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
      if (status) status.textContent = 'Comentário recebido. Ele aparecerá depois da moderação.';
    } catch (error) {
      if (status) status.textContent = error.message || 'Comentários ainda não estão habilitados.';
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  setupTurnstile();
  loadComments();
}
