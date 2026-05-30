const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function test() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let supabaseUrl = ''; let supabaseKey = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  const ID = '7b27154b-884e-4a05-a89f-0654d0fed203';

  console.log("Fetching user...");
  const { data, error } = await supabase.from('users').select('*').eq('id', ID).single();
  if (error) console.error("Error:", error);
  else console.log("Success:", data.full_name);
}

test();
