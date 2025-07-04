-- Criar usuário admin
-- Nota: Este usuário deve ser criado via Supabase Auth UI ou API
-- Aqui vamos apenas configurar o perfil como admin caso o usuário já exista

-- Inserir ou atualizar perfil como admin para o email especificado
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
  crypt('admin456@', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Felipe Fernando"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Atualizar perfil existente ou inserir novo com role admin
INSERT INTO public.profiles (id, full_name, email, role, is_active)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', 'Felipe Fernando'),
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