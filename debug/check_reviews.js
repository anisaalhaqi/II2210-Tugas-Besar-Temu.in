const fs = require('fs');
async function run() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let url = ''; let key = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
  }
  
  // Find Anisa Gunawan
  const uRes = await fetch(`${url}/rest/v1/users?full_name=eq.Anisa%20Gunawan&select=id`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const uData = await uRes.json();
  if (uData.length === 0) { console.log("User Anisa Gunawan not found"); return; }
  const aid = uData[0].id;
  console.log("Anisa Gunawan ID:", aid);

  // Find reviews for her
  const rRes = await fetch(`${url}/rest/v1/reviews?reviewee_id=eq.${aid}&select=*,reviewer:reviewer_id(full_name)`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const rData = await rRes.json();
  console.log("Reviews for her:", JSON.stringify(rData, null, 2));
}
run();
