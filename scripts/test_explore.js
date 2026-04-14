import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing keys");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase
    .from('explore_locations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("ERROR HAPPENED:");
    console.log(JSON.stringify(error, null, 2));
    console.log(error.message);
  } else {
    console.log("SUCCESS, rows:", data?.length);
  }
}

test();
