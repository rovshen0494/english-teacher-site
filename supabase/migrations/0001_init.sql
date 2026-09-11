-- Content tables for the teaching resource site.
-- Single-admin model: write access is gated by matching the admin's JWT email,
-- rather than a separate roles table, since there is exactly one admin account.

create extension if not exists pgcrypto;

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  resource_type text not null,
  age_groups text[] not null default '{}',
  english_levels text[] not null default '{}',
  primary_skill text not null,
  secondary_skills text[] not null default '{}',
  topics text[] not null default '{}',
  duration text not null,
  class_size text not null,
  prep_time text not null,
  difficulty text not null,
  materials text[] not null default '{}',
  related_resources text[] not null default '{}',
  collections text[] not null default '{}',
  downloads jsonb not null default '[]',
  author text not null,
  date_created date not null default current_date,
  last_updated date not null default current_date,
  featured boolean not null default false,
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  category text not null,
  date date not null default current_date,
  author text not null,
  related_resources text[] not null default '{}',
  featured boolean not null default false,
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('photo', 'video')),
  src text not null,
  poster text,
  width integer not null,
  height integer not null,
  alt text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at accurate without relying on application code to set it.
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger resources_set_updated_at before update on public.resources
  for each row execute function public.set_updated_at();
create trigger blog_posts_set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();
create trigger collections_set_updated_at before update on public.collections
  for each row execute function public.set_updated_at();
create trigger gallery_items_set_updated_at before update on public.gallery_items
  for each row execute function public.set_updated_at();

alter table public.resources enable row level security;
alter table public.blog_posts enable row level security;
alter table public.collections enable row level security;
alter table public.gallery_items enable row level security;

-- Public, read-only access for the site itself.
create policy "resources_public_read" on public.resources for select using (true);
create policy "blog_posts_public_read" on public.blog_posts for select using (true);
create policy "collections_public_read" on public.collections for select using (true);
create policy "gallery_items_public_read" on public.gallery_items for select using (true);

-- Writes are restricted to the single admin account, identified by email.
create policy "resources_admin_insert" on public.resources for insert
  with check ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');
create policy "resources_admin_update" on public.resources for update
  using ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');
create policy "resources_admin_delete" on public.resources for delete
  using ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');

create policy "blog_posts_admin_insert" on public.blog_posts for insert
  with check ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');
create policy "blog_posts_admin_update" on public.blog_posts for update
  using ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');
create policy "blog_posts_admin_delete" on public.blog_posts for delete
  using ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');

create policy "collections_admin_insert" on public.collections for insert
  with check ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');
create policy "collections_admin_update" on public.collections for update
  using ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');
create policy "collections_admin_delete" on public.collections for delete
  using ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');

create policy "gallery_items_admin_insert" on public.gallery_items for insert
  with check ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');
create policy "gallery_items_admin_update" on public.gallery_items for update
  using ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');
create policy "gallery_items_admin_delete" on public.gallery_items for delete
  using ((auth.jwt() ->> 'email') = 'bmammet09@gmail.com');

-- Storage bucket for gallery photos/videos, uploaded directly from the admin panel.
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "gallery_bucket_public_read" on storage.objects for select
  using (bucket_id = 'gallery');
create policy "gallery_bucket_admin_insert" on storage.objects for insert
  with check (bucket_id = 'gallery' and (auth.jwt() ->> 'email') = 'bmammet09@gmail.com');
create policy "gallery_bucket_admin_update" on storage.objects for update
  using (bucket_id = 'gallery' and (auth.jwt() ->> 'email') = 'bmammet09@gmail.com');
create policy "gallery_bucket_admin_delete" on storage.objects for delete
  using (bucket_id = 'gallery' and (auth.jwt() ->> 'email') = 'bmammet09@gmail.com');
