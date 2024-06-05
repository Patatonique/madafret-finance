import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://czdsmhmsyzjthnyrtjnw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZHNtaG1zeXpqdGhueXJ0am53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1MDY5NjMsImV4cCI6MjAzMzA4Mjk2M30.xHNKI-LWussdrV8kxhaePjisYJhNSHpIGsWV46SlGUo'
export const supabase = createClient(supabaseUrl, supabaseKey)
