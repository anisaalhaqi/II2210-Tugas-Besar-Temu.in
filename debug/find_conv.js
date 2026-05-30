const fs = require('fs');
async function run() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let url = ''; let key = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
  }
  const uid = '9ea8edbb-a8d6-4a1a-a82e-905cc5119d0e';
  const res = await fetch(`${url}/rest/v1/conversations?or=(buyer_id.eq.${uid},seller_id.eq.${uid})&select=id,buyer:buyer_id(full_name),seller:seller_id(full_name)&limit=1`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const data = await res.json();
  console.log(JSON.stringify(data[0]));
}
run();
