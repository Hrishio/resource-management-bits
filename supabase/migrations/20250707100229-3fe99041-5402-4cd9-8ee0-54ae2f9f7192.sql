-- Remove automatic role assignment from the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile only (no automatic role assignment)
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  
  -- No automatic role assignment - roles will be assigned manually by admins
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the enum to include 'user' role alongside 'admin' and 'resource'  
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'user';

-- Create a function for admins to assign roles to users
CREATE OR REPLACE FUNCTION public.assign_user_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can assign roles';
  END IF;
  
  -- Insert or update the user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;