create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text,
  interest text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Anyone (including anonymous visitors) can submit the contact form.
create policy "contact_submissions_public_insert" on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);

-- Only the admin can read, update (mark as read) or delete messages.
create policy "contact_submissions_admin_select" on public.contact_submissions for select
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "contact_submissions_admin_update" on public.contact_submissions for update
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "contact_submissions_admin_delete" on public.contact_submissions for delete
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
