const fs = require('fs');
async function debug() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let supabaseUrl = ''; let supabaseKey = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  }
  
  const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` };

  // Check total products
  const res = await fetch(`${supabaseUrl}/rest/v1/products?select=id,seller_id&limit=5`, { headers });
  const data = await res.json();
  console.log("Sample Products:", data);
}
debug();
