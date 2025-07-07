-- Check if trigger exists and fix the issue
SELECT tgname, tgenabled FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- First, let's assign roles to existing users manually
INSERT INTO public.user_roles (user_id, role)
SELECT 
    p.id,
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN 'admin'::app_role
        ELSE 'resource'::app_role
    END
FROM public.profiles p
WHERE p.id NOT IN (SELECT user_id FROM public.user_roles);

-- Now let's fix the trigger function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile (with error handling)
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  
  -- Assign default role (resource) - first user becomes admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE 
      WHEN NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN 'admin'::app_role
      ELSE 'resource'::app_role
    END
  )
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();