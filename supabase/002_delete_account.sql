-- Lucir Estudio · permite que cada usuario elimine su propia cuenta desde la app.
-- Ejecuta en Supabase → SQL Editor. Borra el usuario de auth.users; el resto de sus datos
-- (perfil, marcas, piezas, chispas, aperturas, consumo) se elimina en cascada.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
