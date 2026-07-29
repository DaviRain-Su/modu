-- 划线共读：同一句 quote 上可有多人想法（用 annotations 聚合，无需新主表）
-- 可选回复父节点，方便「在别人的想法下接一句」
alter table annotations add column if not exists parent_id text;
create index if not exists annotations_quote_idx
  on annotations (book_id, quote)
  where is_public = true;
