-- Live, Kahoot-style multiplayer quiz sessions.
-- Question content lives in the app's static vocabulary word-sets (not the
-- database), so `question_order` stores the shuffled word list for a given
-- topic at session-creation time, and every client derives question text,
-- images and correct answers from that same shared static data. This keeps
-- content authoring simple (no new admin UI needed) at the cost of trusting
-- the client to self-report whether an answer was correct — acceptable for a
-- casual classroom game, not appropriate for a high-stakes assessment.

create table public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  room_code text unique not null,
  topic text not null,
  question_order jsonb not null,
  status text not null default 'lobby' check (status in ('lobby', 'question', 'reveal', 'leaderboard', 'finished')),
  current_question_index int not null default -1,
  question_started_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.game_players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  nickname text not null,
  score int not null default 0,
  joined_at timestamptz not null default now()
);

create table public.game_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  player_id uuid not null references public.game_players(id) on delete cascade,
  question_index int not null,
  is_correct boolean not null,
  points_awarded int not null default 0,
  answered_at timestamptz not null default now(),
  unique (player_id, question_index)
);

alter table public.game_sessions enable row level security;
alter table public.game_players enable row level security;
alter table public.game_answers enable row level security;

-- Sessions: anyone with the room code/link can read status; only the admin
-- (the teacher, from /admin) can create or control a session.
create policy "game_sessions_public_read" on public.game_sessions for select using (true);
create policy "game_sessions_admin_insert" on public.game_sessions for insert
  with check ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "game_sessions_admin_update" on public.game_sessions for update
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "game_sessions_admin_delete" on public.game_sessions for delete
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');

-- Players: public read for live leaderboards; anyone can join (insert their
-- own nickname). Score changes only ever happen through submit_answer()
-- below, so there is no public update policy on this table at all.
create policy "game_players_public_read" on public.game_players for select using (true);
create policy "game_players_public_join" on public.game_players for insert
  to anon, authenticated
  with check (true);
create policy "game_players_admin_delete" on public.game_players for delete
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');

-- Answers: readable (used for "X of Y answered" counts); all writes happen
-- via the security-definer function only, so no direct insert/update policy.
create policy "game_answers_public_read" on public.game_answers for select using (true);

-- Runs with elevated privileges so it can update a player's score safely,
-- while enforcing "one answer per player per question" and computing
-- time-based points from the server's own clock (never the client's).
create or replace function public.submit_answer(
  p_session_id uuid,
  p_player_id uuid,
  p_question_index int,
  p_is_correct boolean
)
returns table(points_awarded int, already_answered boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_question_started_at timestamptz;
  v_time_limit constant int := 20;
  v_elapsed numeric;
  v_points int;
begin
  if exists (
    select 1 from game_answers
    where player_id = p_player_id and question_index = p_question_index
  ) then
    return query select 0, true;
    return;
  end if;

  select gs.question_started_at into v_question_started_at
  from game_sessions gs
  where gs.id = p_session_id;

  v_elapsed := greatest(0, extract(epoch from (now() - coalesce(v_question_started_at, now()))));

  if p_is_correct then
    v_points := greatest(500, round(1000 - (least(v_elapsed, v_time_limit) / v_time_limit) * 500)::int);
  else
    v_points := 0;
  end if;

  insert into game_answers (session_id, player_id, question_index, is_correct, points_awarded)
  values (p_session_id, p_player_id, p_question_index, p_is_correct, v_points);

  update game_players set score = score + v_points where id = p_player_id;

  return query select v_points, false;
end;
$$;

grant execute on function public.submit_answer(uuid, uuid, int, boolean) to anon, authenticated;

-- Enable realtime so host screens and player phones stay in sync.
alter publication supabase_realtime add table public.game_sessions;
alter publication supabase_realtime add table public.game_players;
alter publication supabase_realtime add table public.game_answers;
