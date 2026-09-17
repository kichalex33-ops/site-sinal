const root = document.querySelector('[data-home-comments-root]');
if (root) {
  const list = root.querySelector('[data-home-comments-list]');
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
  const formatDate = (iso) => {
    try { return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(iso)); }
    catch { return ''; }
  };

  fetch('/api/comments?featured=1', { headers: { accept: 'application/json' } })
    .then((r) => r.json())
    .then((data) => {
      if (!data.enabled || !Array.isArray(data.comments) || data.comments.length === 0) return;
      list.innerHTML = data.comments.map((c) => `
        <article class="reader-comment">
          <div class="reader-comment__meta"><strong>${escapeHtml(c.display_name)}</strong><time>${escapeHtml(formatDate(c.created_at))}</time></div>
          <p>${escapeHtml(c.comment_text)}</p>
        </article>`).join('');
      root.querySelector('[data-home-comments-empty]')?.remove();
    })
    .catch(() => {});
}
