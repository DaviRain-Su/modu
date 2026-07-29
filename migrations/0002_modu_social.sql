-- Profiles, AI settings, subscriptions, social annotations, rankings

create table if not exists user_profiles (
  user_id     text primary key,
  display_name text not null default '',
  bio         text not null default '',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists user_ai_settings (
  user_id       text primary key,
  provider      text not null default 'official',
  -- openai | deepseek | kimi | custom | official
  api_key       text not null default '',
  base_url      text not null default '',
  model         text not null default '',
  updated_at    timestamptz not null default now()
);

create table if not exists user_subscriptions (
  user_id       text primary key,
  plan          text not null default 'free',
  -- free | plus | pro
  status        text not null default 'active',
  renews_at     timestamptz,
  updated_at    timestamptz not null default now()
);

create table if not exists ai_usage_daily (
  user_id       text not null,
  day           date not null,
  count         integer not null default 0,
  primary key (user_id, day)
);

create table if not exists book_reads (
  id            serial primary key,
  user_id       text not null,
  book_id       text not null,
  opened_at     timestamptz not null default now()
);
create index if not exists book_reads_book_id_idx on book_reads (book_id);
create index if not exists book_reads_user_id_idx on book_reads (user_id);

create table if not exists annotations (
  id            text primary key,
  user_id       text not null,
  book_id       text not null,
  chapter_id    text,
  page          integer,
  quote         text not null,
  note          text not null default '',
  kind          text not null default 'highlight',
  -- highlight | note | underline
  is_public     boolean not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists annotations_book_id_idx on annotations (book_id);
create index if not exists annotations_user_id_idx on annotations (user_id);
create index if not exists annotations_public_idx on annotations (is_public, book_id);
