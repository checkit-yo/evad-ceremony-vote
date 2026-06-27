-- Add youtube_url column to categories table
-- This field stores the YouTube video URL for each category

alter table public.categories
  add column youtube_url text;

comment on column public.categories.youtube_url is 'YouTube video URL for the category presentation';
