-- Atlas95 short share links. Run this once in Supabase > SQL Editor > New query.
-- Each shared game (a doodle, a Pin Drop or Closest Wins challenge) is saved as one row, and the link is /s/<id>.
create table if not exists public.shares (
  id text primary key check (char_length(id) between 6 and 16),
  game text not null check (char_length(game) <= 20),
  data jsonb not null check (octet_length(data::text) < 20000),
  owner uuid not null default auth.uid(),
  created_at timestamptz not null default now()
);
alter table public.shares enable row level security;

-- anyone with a link can open it
drop policy if exists "Anyone can read shares" on public.shares;
create policy "Anyone can read shares" on public.shares for select using (true);

-- signed-in players (the app signs everyone in anonymously) can add their own; nobody can edit or delete others'
drop policy if exists "Players add their own shares" on public.shares;
create policy "Players add their own shares" on public.shares for insert to authenticated with check (owner = auth.uid());

grant select on public.shares to anon, authenticated;
grant insert on public.shares to authenticated;
