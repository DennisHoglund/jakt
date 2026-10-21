-- Jaktvind – databas för jaktloggen i Supabase
-- Kör hela filen i Supabase: SQL Editor → New query → klistra in → Run.
-- Filen går att köra flera gånger.
--
-- Rättigheter: bara inloggade användare kommer åt något, och varje användare
-- ser och ändrar bara sina egna poster. Den publika nyckeln i appen ger
-- ingen åtkomst utan inloggning.

create table if not exists public.logg (
  id            text primary key,                         -- skapas i appen, så poster kan sparas offline först
  user_id       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  t             timestamptz not null,                     -- när det hände
  typ           text not null check (typ in ('obs', 'kill', 'note')),
  art           text,                                     -- art-id, t.ex. 'alg', 'radjur'
  kon           text[] not null default '{}',             -- t.ex. {Tjur,Kalv}
  antal         integer not null default 1 check (antal between 1 and 99),
  avstand       integer check (avstand between 0 and 5000),
  vapen         text,
  pass          text,
  anteckning    text,
  lat           double precision check (lat between -90 and 90),
  lon           double precision check (lon between -180 and 180),
  noggrannhet   real,
  placerad      boolean not null default false,           -- true = placerad för hand på kartan
  vader         jsonb,                                    -- vind, temperatur, vädertyp vid tillfället
  ljus          text,
  inom_skjuttid boolean,
  mane          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists logg_user_t on public.logg (user_id, t desc);

alter table public.logg enable row level security;

-- Bara egna poster. (select auth.uid()) är Supabase rekommenderade form för bättre prestanda.
drop policy if exists "logg_select" on public.logg;
drop policy if exists "logg_insert" on public.logg;
drop policy if exists "logg_update" on public.logg;
drop policy if exists "logg_delete" on public.logg;
create policy "logg_select" on public.logg for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "logg_insert" on public.logg for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "logg_update" on public.logg for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "logg_delete" on public.logg for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Anonyma anrop får inga rättigheter alls på tabellen
revoke all on public.logg from anon;

-- ---------------------------------------------------------------------------
-- Platser: pass, torn, åtlar, saltstenar och viltkameror
create table if not exists public.platser (
  id          text primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  namn        text not null,
  typ         text not null default 'pass' check (typ in ('pass', 'torn', 'atel', 'salt', 'kamera', 'annat')),
  lat         double precision not null check (lat between -90 and 90),
  lon         double precision not null check (lon between -180 and 180),
  bevakar     smallint[] not null default '{}',             -- varifrån viltet väntas, 0 = N, 1 = NO ... 7 = NV
  anteckning  text,
  placerad    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists platser_user on public.platser (user_id);

alter table public.platser enable row level security;

drop policy if exists "platser_select" on public.platser;
drop policy if exists "platser_insert" on public.platser;
drop policy if exists "platser_update" on public.platser;
drop policy if exists "platser_delete" on public.platser;
create policy "platser_select" on public.platser for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "platser_insert" on public.platser for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "platser_update" on public.platser for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "platser_delete" on public.platser for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.platser from anon;
