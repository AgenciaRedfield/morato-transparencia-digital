-- Criar um usuário admin temporário via função de exemplo
-- IMPORTANTE: O usuário real deve ser criado via Supabase Auth UI/API

-- Para fins de demonstração, vamos criar um perfil admin que será associado
-- quando o usuário fizer signup com o email especificado

-- Função para criar usuário admin (apenas para referência)
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email text,
  admin_name text
) RETURNS void AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Gera um UUID temporário para o admin
  user_id := gen_random_uuid();
  
  -- Insere o perfil admin
  INSERT INTO public.profiles (id, full_name, email, role, is_active)
  VALUES (user_id, admin_name, admin_email, 'admin'::user_role, true)
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin'::user_role,
    is_active = true,
    updated_at = now();
    
  RAISE NOTICE 'Perfil admin criado para %. ID: %', admin_email, user_id;
END;
$$ LANGUAGE plpgsql;

-- Executar para criar o perfil admin
SELECT create_admin_user('felipefernando94@gmail.com', 'Felipe Fernando Admin');