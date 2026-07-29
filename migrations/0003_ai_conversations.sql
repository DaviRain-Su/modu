-- Per-user AI companion conversations (liber-style) + optional R2 archive key

create table if not exists ai_conversations (
  id            text primary key,
  user_id       text not null,
  book_id       text not null,
  chapter_id    text,
  title         text not null default '伴读对话',
  lens          text not null default 'companion',
  storage_key   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists ai_conversations_user_book_idx
  on ai_conversations (user_id, book_id, updated_at desc);

create table if not exists ai_messages (
  id               text primary key,
  conversation_id  text not null references ai_conversations(id) on delete cascade,
  user_id          text not null,
  role             text not null,
  -- user | assistant | system
  content          text not null,
  kind             text not null default 'chat',
  -- chat | explain | summary | translate | insight
  quote            text,
  created_at       timestamptz not null default now()
);
create index if not exists ai_messages_convo_idx
  on ai_messages (conversation_id, created_at asc);
