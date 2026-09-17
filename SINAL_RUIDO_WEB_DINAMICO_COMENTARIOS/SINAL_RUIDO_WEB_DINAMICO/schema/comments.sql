-- SINAL/RUÍDO — comentários literários
-- Execute uma vez no banco D1 vinculado ao projeto Cloudflare Pages.
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TEXT NOT NULL,
  moderated_at TEXT,
  moderation_note TEXT
);

CREATE INDEX IF NOT EXISTS idx_comments_public
  ON comments (chapter_id, status, created_at DESC);
