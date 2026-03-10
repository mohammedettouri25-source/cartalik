-- ==========================================
-- CARTALIK COMPLETE DATABASE RESET SCRIPT
-- WARNING: THIS WILL DELETE ALL DATA
-- ==========================================

-- 1. DROP EVERYTHING
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS handle_updated_at_subscriptions ON public.subscriptions;
DROP FUNCTION IF EXISTS public.handle_updated_at();

DROP TABLE IF EXISTS public.analytics_events;
DROP TABLE IF EXISTS public.subscriptions;
DROP TABLE IF EXISTS public.links;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.card_orders;

DROP TYPE IF EXISTS public.card_type;
DROP TYPE IF EXISTS public.subscription_status;
DROP TYPE IF EXISTS public.analytics_event_type;

-- 2. CREATE TYPES
CREATE TYPE public.card_type AS ENUM ('personal', 'business');
CREATE TYPE public.subscription_status AS ENUM ('active', 'expired', 'trialing');
CREATE TYPE public.analytics_event_type AS ENUM ('page_view', 'link_click', 'contact_save');

-- 3. CREATE TABLES
CREATE TABLE public.card_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  card_type public.card_type NOT NULL DEFAULT 'personal',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  card_type public.card_type NOT NULL DEFAULT 'personal',
  name TEXT,
  title TEXT,
  company TEXT,
  bio TEXT,
  description TEXT,
  photo_url TEXT,
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  location_url TEXT,
  google_reviews_url TEXT,
  is_active BOOLEAN DEFAULT true, -- Start active for testing ease
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status public.subscription_status DEFAULT 'active', -- Start active for testing ease
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_type public.analytics_event_type NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ENABLE RLS
ALTER TABLE public.card_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 5. CREATE POLICIES (Simplified - No Admin Role)
-- Profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Links
CREATE POLICY "Links are viewable by everyone" ON public.links FOR SELECT USING (true);
CREATE POLICY "Users can manage own links" ON public.links FOR ALL USING (auth.uid() = profile_id);

-- Card Orders
CREATE POLICY "Anyone can insert orders" ON public.card_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can manage orders" ON public.card_orders FOR ALL USING (auth.role() = 'authenticated');

-- 6. FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, name)
  VALUES (
    NEW.id,
    'user_' || substr(NEW.id::text, 1, 8),
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  INSERT INTO public.subscriptions (profile_id, status)
  VALUES (NEW.id, 'active');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========================================================
-- BOOTSTRAP: RUN THIS AFTER LOGIN IF YOU ARE NOT ADMIN
-- REPLACE 'your-email@example.com' WITH YOUR EMAIL
-- ========================================================
-- UPDATE public.profiles SET is_admin = true WHERE email = 'your-email@example.com';
