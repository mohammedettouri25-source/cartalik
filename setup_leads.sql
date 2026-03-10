-- Create the leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company TEXT,
    message TEXT,
    source TEXT DEFAULT 'NFC', -- e.g., 'NFC' or 'QR'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert leads
-- (We'll check the associated user_id in the application logic before insertion)
CREATE POLICY "Anyone can insert leads" 
ON public.leads FOR INSERT 
TO public
WITH CHECK (true);

-- Allow users to read only their own leads
CREATE POLICY "Users can read own leads" 
ON public.leads FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to delete their own leads
CREATE POLICY "Users can delete own leads" 
ON public.leads FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);
