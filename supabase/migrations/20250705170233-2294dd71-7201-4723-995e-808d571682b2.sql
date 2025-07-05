-- Criar usuário admin no Supabase Auth
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'felipefernando94@gmail.com',
  crypt('admin456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Felipe Fernando Admin"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('admin456', gen_salt('bf')),
  email_confirmed_at = now(),
  updated_at = now();

-- Criar/atualizar perfil admin
INSERT INTO public.profiles (id, full_name, email, role, is_active)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', 'Felipe Fernando Admin'),
  email,
  'admin'::user_role,
  true
FROM auth.users 
WHERE email = 'felipefernando94@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin'::user_role,
  is_active = true,
  updated_at = now();