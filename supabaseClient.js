import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://rrrptvotntpkksharrvl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycnB0dm90bnRwa2tzaGFycnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMTY0MDIsImV4cCI6MjA3NzY5MjQwMn0.NWqcZVh6s5UBbfvdnjYipZ_iOT7V8CtZtqmoP8FUEGY'
);