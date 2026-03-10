-- Cartalik Supabase Database Schema

-- Custom Types
CREATE TYPE card_type AS ENUM ('personal', 'business');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'canceled');
CREATE TYPE analytics_event_type AS ENUM ('tap', 'view', 'link_click', 'contact_save');

-- 0. Card Orders Table
CREATE TABLE public.card_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  card_type card_type NOT NULL DEFAULT 'personal',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1. Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  card_type card_type NOT NULL DEFAULT 'personal',
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
  is_active BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Links Table
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Subscriptions Table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status subscription_status DEFAULT 'expired',
  current_period_end TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Analytics Events Table
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_type analytics_event_type NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.card_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Card Orders Policies
-- Anyone can insert a card order (when requesting a card)
CREATE POLICY "Anyone can insert card orders" 
  ON public.card_orders FOR INSERT 
  WITH CHECK (true);

-- Profiles Policies
-- Anyone can view active profiles
CREATE POLICY "Public Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (is_active = true);

-- Users can view their own profile regardless of status
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Users can insert their own profile on signup
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Links Policies
-- Anyone can view links for active profiles
CREATE POLICY "Links for active profiles are viewable by everyone" 
  ON public.links FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = links.profile_id AND profiles.is_active = true
    )
  );

-- Users can manage their own links
CREATE POLICY "Users can insert own links" 
  ON public.links FOR INSERT 
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own links" 
  ON public.links FOR UPDATE 
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own links" 
  ON public.links FOR DELETE 
  USING (auth.uid() = profile_id);

-- Subscriptions Policies
-- Only users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" 
  ON public.subscriptions FOR SELECT 
  USING (auth.uid() = profile_id);

-- Analytics Policies
-- Users can view their own analytics
CREATE POLICY "Users can view own analytics" 
  ON public.analytics_events FOR SELECT 
  USING (auth.uid() = profile_id);

-- Anyone can insert an analytics event (when they tap a card)
CREATE POLICY "Anyone can insert analytics events" 
  ON public.analytics_events FOR INSERT 
  WITH CHECK (true);

-- Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, name)
  VALUES (
    NEW.id,
    -- generate a default random username
    'user_' || substr(NEW.id::text, 1, 8),
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  -- Create an expired subscription by default
  INSERT INTO public.subscriptions (profile_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Helper Functions for Triggering Updated_At
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_subscriptions
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Add Indexes for Performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_links_profile_id ON public.links(profile_id);
CREATE INDEX idx_subscriptions_profile_id ON public.subscriptions(profile_id);
CREATE INDEX idx_analytics_profile_id_created_at ON public.analytics_events(profile_id, created_at);
