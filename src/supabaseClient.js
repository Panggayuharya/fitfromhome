import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fnydkyayxfpiqavvgyth.supabase.co' 

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZueWRreWF5eGZwaXFhdnZneXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NzMyODgsImV4cCI6MjA2NTA0OTI4OH0._ltTS4ZtqK2sVCW2O9gCK7aoWN5aWXpeUPISVLuBJH8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
