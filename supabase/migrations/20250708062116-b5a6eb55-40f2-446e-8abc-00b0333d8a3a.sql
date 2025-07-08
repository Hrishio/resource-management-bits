-- Fix profiles table to ensure all auth users have profiles
-- Handle missing profiles for users who were created before the trigger

-- First, let's insert profiles for any auth users who don't have them
-- We'll use a direct insert with ON CONFLICT to handle any potential duplicates safely

INSERT INTO public.profiles (id, email, full_name)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email, 'Unknown User')
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- Add a security policy to prevent unauthorized profile creation
CREATE POLICY "Prevent unauthorized profile creation" 
ON public.profiles 
FOR INSERT 
WITH CHECK (false);

-- Update the trigger to ensure it always creates profiles properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile for new user (no automatic role assignment)
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Unknown User')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;