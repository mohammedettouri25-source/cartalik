-- Add products table for Business Showcase
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price TEXT,
    image_url TEXT,
    external_link TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Select policy: Anyone can see products of an active profile
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = products.profile_id AND profiles.is_active = true
    )
);

-- Manage policy: Owners can manage their own products, but restricted to business card_type in application logic
-- Here we just check ownership to satisfy RLS
CREATE POLICY "Users can manage own products" 
ON public.products FOR ALL
TO authenticated
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- Add index
CREATE INDEX IF NOT EXISTS products_profile_id_idx ON public.products(profile_id);
