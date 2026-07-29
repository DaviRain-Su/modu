-- 阅读进度云同步 + 公版弹幕批注

create table if not exists reading_progress_cloud (
  user_id     text not null,
  book_id     text not null,
  progress    double precision not null default 0,
  chapter_id  text,
  page        integer,
  cfi         text,
  updated_at  timestamptz not null default now(),
  primary key (user_id, book_id)
);
create index if not exists reading_progress_user_idx
  on reading_progress_cloud (user_id, updated_at desc);

-- 公版书「弹幕」：挂在章节段落上，阅读时浮在句下
create table if not exists reading_danmaku (
  id           text primary key,
  book_id      text not null,
  chapter_id   text not null default '',
  para_index   integer not null default 0,
  quote        text not null default '',
  body         text not null,
  user_id      text not null,
  created_at   timestamptz not null default now()
);
create index if not exists reading_danmaku_book_ch_idx
  on reading_danmaku (book_id, chapter_id, para_index, created_at desc);
create index if not exists reading_danmaku_user_idx
  on reading_danmaku (user_id, created_at desc);
