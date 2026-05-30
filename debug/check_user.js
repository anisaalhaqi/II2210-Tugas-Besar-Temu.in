const fs = require('fs');
async function run() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let url = ''; let key = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
  }
  
  const res = await fetch(`${url}/rest/v1/users?email=eq.illona@gmail.com&select=*`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
