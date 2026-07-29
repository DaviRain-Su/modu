-- 社区公版贡献：用户声明为公版后可申请进入书城（非私有上架）

create table if not exists community_pd_books (
  id              text primary key,
  contributor_id  text not null,
  title           text not null,
  author          text not null,
  description     text not null default '',
  category        text not null default '文学',
  format          text not null default 'text',
  cover_color     text not null default '#2c241c',
  cover_text      text,
  -- ancient | author_life_plus | pre_1929 | project_gutenberg | other
  pd_basis        text not null,
  pd_basis_note   text not null default '',
  source_url      text not null default '',
  year_or_era     text not null default '',
  -- pending | approved | rejected
  status          text not null default 'approved',
  license         text not null default '社区公版 · 用户声明',
  chapters_json   text not null default '[]',
  word_count      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists community_pd_status_idx
  on community_pd_books (status, created_at desc);
create index if not exists community_pd_contributor_idx
  on community_pd_books (contributor_id);
