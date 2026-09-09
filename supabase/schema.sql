-- L'Enclos Poesia Erotica · Supabase schema
-- Paste this entire file into: Supabase Dashboard → SQL Editor → New query → Run

create table if not exists public.poems (
  id text primary key,
  title_fr text not null default '',
  title_ar text not null default '',
  author_fr text not null default '',
  author_ar text not null default '',
  translator_fr text not null default '',
  translator_ar text not null default '',
  intro_fr text not null default '',
  intro_ar text not null default '',
  dedication_fr text not null default '',
  dedication_ar text not null default '',
  place_fr text not null default '',
  place_ar text not null default '',
  body_fr text not null default '',
  body_ar text not null default '',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id text primary key,
  poem_id text not null references public.poems (id) on delete cascade,
  author text not null default '',
  body text not null,
  avatar text,
  created_at timestamptz not null default now()
);

create table if not exists public.reactions (
  id text primary key,
  poem_id text not null references public.poems (id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  unique (poem_id, visitor_id)
);

create table if not exists public.submissions (
  id text primary key,
  author text not null,
  title_fr text not null default '',
  title_ar text not null default '',
  body_fr text not null default '',
  body_ar text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists comments_poem_id_idx on public.comments (poem_id);
create index if not exists reactions_poem_id_idx on public.reactions (poem_id);
create index if not exists submissions_status_idx on public.submissions (status);

alter table public.poems enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;
alter table public.submissions enable row level security;

drop policy if exists poems_read on public.poems;
create policy poems_read on public.poems for select using (true);

drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments for select using (true);

drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert with check (true);

drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments for delete using (true);

drop policy if exists reactions_read on public.reactions;
create policy reactions_read on public.reactions for select using (true);

drop policy if exists reactions_insert on public.reactions;
create policy reactions_insert on public.reactions for insert with check (true);

drop policy if exists reactions_delete on public.reactions;
create policy reactions_delete on public.reactions for delete using (true);

drop policy if exists submissions_read on public.submissions;
create policy submissions_read on public.submissions for select using (true);

drop policy if exists submissions_insert on public.submissions;
create policy submissions_insert on public.submissions for insert with check (true);

drop policy if exists submissions_update on public.submissions;
create policy submissions_update on public.submissions for update using (true) with check (true);

create or replace function public.exec_sql(q text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  trimmed text := ltrim(q, E' \n\t\r');
  result jsonb;
  n int;
begin
  if trimmed ~* '^(select|with|explain|show|values|table)([^[:alnum:]_]|$)' then
    execute 'select coalesce(jsonb_agg(row_to_json(t)), ''[]''::jsonb) from (' || rtrim(trimmed, E' \n\t;') || ') as t'
      into result;
    return jsonb_build_object('ok', true, 'type', 'rows', 'rows', coalesce(result, '[]'::jsonb));
  else
    execute rtrim(trimmed, E' \n\t;');
    get diagnostics n = row_count;
    return jsonb_build_object('ok', true, 'type', 'ok', 'rowCount', n);
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', sqlerrm);
end;
$$;

revoke all on function public.exec_sql(text) from public;
revoke all on function public.exec_sql(text) from anon, authenticated;
grant execute on function public.exec_sql(text) to service_role;
