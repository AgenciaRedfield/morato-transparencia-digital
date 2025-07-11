// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wsfeqhobnjygdihxsetv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzZmVxaG9ibmp5Z2RpaHhzZXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzOTYzMzIsImV4cCI6MjA2Njk3MjMzMn0.lif_M6sYq015av2uy1kxrrKNMNCkS82IBaApZRtO9fI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});