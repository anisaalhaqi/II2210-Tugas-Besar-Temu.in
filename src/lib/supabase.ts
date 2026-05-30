import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Hardcoded for debugging to bypass env loading issues
const supabaseUrl = 'https://gjyktpnujftupzkerxez.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqeWt0cG51amZ0dXB6a2VyeGV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDI1MDYsImV4cCI6MjA5NTExODUwNn0.D_pfeYsV182Rx6QGc5yrcMAE63NK9kiwTrqLxqU41gU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
