-- Per-user shelf membership + uploaded book metadata.
-- Binary files stay in object storage / IndexedDB; only validated metadata is synced.

create table if not exists user_books (
  user_id         text not null,
  id              text not null,
  metadata        jsonb not null,
  storage_key     text not null,
  storage_backend text not null default 'indexeddb',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  primary key (user_id, id)
);
create index if not exists user_books_user_updated_idx
  on user_books (user_id, updated_at desc);

create table if not exists user_shelf (
  user_id  text not null,
  book_id  text not null,
  added_at timestamptz not null default now(),
  primary key (user_id, book_id)
);
create index if not exists user_shelf_user_added_idx
  on user_shelf (user_id, added_at desc);
