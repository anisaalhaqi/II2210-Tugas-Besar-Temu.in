const fs = require('fs');
async function debug() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let supabaseUrl = ''; let supabaseKey = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  }
  
  console.log("--- CHECKING OLD ID DATA ---");
  
  const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` };
  const oldId = '7b27154b-884e-4a05-a89f-0654d0fed203';

  // 1. Check products
  const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?seller_id=eq.${oldId}&select=id`, { 
    headers: { ...headers, 'Prefer': 'count=exact' } 
  });
  console.log(`Old Products: ${prodRes.headers.get('content-range')?.split('/')[1] || 0}`);

  // 2. Check conversations
  const convRes = await fetch(`${supabaseUrl}/rest/v1/conversations?or=(buyer_id.eq.${oldId},seller_id.eq.${oldId})&select=id`, { 
    headers: { ...headers, 'Prefer': 'count=exact' } 
  });
  console.log(`Old Conversations: ${convRes.headers.get('content-range')?.split('/')[1] || 0}`);
}
debug();
