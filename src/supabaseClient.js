// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl=`${process.env.REACT_APP_SUPABASE_URL}`
const supabaseAnonKey=`${process.env.REACT_APP_SUPABASE_ANON}`

// const supabaseUrl = 'https://jcvmwzualzmymhcghnro.supabase.co'; // Replace with your Supabase project URL

// const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjdm13enVhbHpteW1oY2dobnJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNjkwNTIwMiwiZXhwIjoyMDMyNDgxMjAyfQ.e_XVfOy2mOA8s8KjyJUz4q4Lc-44IbWh7PO6DQZKNBo'

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase
