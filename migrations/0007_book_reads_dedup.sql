-- De-duplicate daily reading activity so hot rankings cannot be trivially farmed.

alter table book_reads add column if not exists read_day date;
update book_reads set read_day = opened_at::date where read_day is null;
delete from book_reads
where id in (
  select id
  from (
    select id,
           row_number() over (
             partition by user_id, book_id, read_day
             order by opened_at asc, id asc
           ) as duplicate_number
    from book_reads
  ) ranked
  where duplicate_number > 1
);
alter table book_reads alter column read_day set default current_date;
alter table book_reads alter column read_day set not null;
create unique index if not exists book_reads_user_book_day_idx
  on book_reads (user_id, book_id, read_day);
