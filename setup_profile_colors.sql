-- =============================================
-- Profile Color Customization Migration
-- =============================================
-- Run this in your Supabase SQL Editor

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS font_color TEXT DEFAULT '#1e293b';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bg_color TEXT DEFAULT '#f8fafc';
