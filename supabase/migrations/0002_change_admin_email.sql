-- Switch the admin identity used by RLS write policies.
drop policy "resources_admin_insert" on public.resources;
drop policy "resources_admin_update" on public.resources;
drop policy "resources_admin_delete" on public.resources;
create policy "resources_admin_insert" on public.resources for insert
  with check ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "resources_admin_update" on public.resources for update
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "resources_admin_delete" on public.resources for delete
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');

drop policy "blog_posts_admin_insert" on public.blog_posts;
drop policy "blog_posts_admin_update" on public.blog_posts;
drop policy "blog_posts_admin_delete" on public.blog_posts;
create policy "blog_posts_admin_insert" on public.blog_posts for insert
  with check ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "blog_posts_admin_update" on public.blog_posts for update
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "blog_posts_admin_delete" on public.blog_posts for delete
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');

drop policy "collections_admin_insert" on public.collections;
drop policy "collections_admin_update" on public.collections;
drop policy "collections_admin_delete" on public.collections;
create policy "collections_admin_insert" on public.collections for insert
  with check ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "collections_admin_update" on public.collections for update
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "collections_admin_delete" on public.collections for delete
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');

drop policy "gallery_items_admin_insert" on public.gallery_items;
drop policy "gallery_items_admin_update" on public.gallery_items;
drop policy "gallery_items_admin_delete" on public.gallery_items;
create policy "gallery_items_admin_insert" on public.gallery_items for insert
  with check ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "gallery_items_admin_update" on public.gallery_items for update
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "gallery_items_admin_delete" on public.gallery_items for delete
  using ((auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');

drop policy "gallery_bucket_admin_insert" on storage.objects;
drop policy "gallery_bucket_admin_update" on storage.objects;
drop policy "gallery_bucket_admin_delete" on storage.objects;
create policy "gallery_bucket_admin_insert" on storage.objects for insert
  with check (bucket_id = 'gallery' and (auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "gallery_bucket_admin_update" on storage.objects for update
  using (bucket_id = 'gallery' and (auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
create policy "gallery_bucket_admin_delete" on storage.objects for delete
  using (bucket_id = 'gallery' and (auth.jwt() ->> 'email') = 'rovshen0494@gmail.com');
