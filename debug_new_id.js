const fs = require('fs');
async function debug() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let supabaseUrl = ''; let supabaseKey = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  }
  
  const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` };
  const newId = '9ea8edbb-a8d6-4a1a-a82e-905cc5119d0e'; // Aufar's ID

  const res = await fetch(`${supabaseUrl}/rest/v1/conversations?or=(buyer_id.eq.${newId},seller_id.eq.${newId})&select=id`, { 
    headers: { ...headers, 'Prefer': 'count=exact' } 
  });
  console.log(`New ID Conversations: ${res.headers.get('content-range')?.split('/')[1] || 0}`);
}
debug();
