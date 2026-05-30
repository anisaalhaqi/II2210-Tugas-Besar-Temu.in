const fs = require('fs');
async function run() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let url = ''; let key = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
  }
  const cid = 'ca11ec7f-2e74-4d17-bf9a-38514b132fa7';
  const res = await fetch(`${url}/rest/v1/messages?conversation_id=eq.${cid}&select=content&limit=1&order=created_at.desc`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const data = await res.json();
  console.log(data[0]?.content);
}
run();
