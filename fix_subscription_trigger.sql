-- 1. REPAIR: Fix the trigger to provide active 6-month subscription by default
-- and ensure is_admin is ALWAYS false for new signups.

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, username, email, name, is_admin, is_active)
  VALUES (
    NEW.id,
    'user_' || substr(NEW.id::text, 1, 8),
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    false, -- CRITICAL: Ensure new users are NOT admins
    true   -- Active profile by default
  );
  
  -- Create an ACTIVE 6-month subscription record
  INSERT INTO public.subscriptions (profile_id, status, current_period_end)
  VALUES (
    NEW.id, 
    'active', 
    NOW() + INTERVAL '6 months'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. DATA REPAIR: Fix any users currently showing "Status=none"
-- This inserts a subscription record for any profile that is missing one.
INSERT INTO public.subscriptions (profile_id, status, current_period_end)
SELECT id, 'expired', NOW() 
FROM public.profiles p
WHERE NOT EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.profile_id = p.id)
ON CONFLICT (profile_id) DO NOTHING;

-- 3. SANITY CHECK: Set all existing non-admin users to is_admin=false 
-- (Just in case some were accidentally set to true)
-- Note: Ensure you don't lock yourself out! Only targets users that shouldn't be admins.
-- UPDATE public.profiles SET is_admin = false WHERE email != 'your-admin-email@example.com';
