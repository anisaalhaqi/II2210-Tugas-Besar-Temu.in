const fs = require('fs');
async function debug() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let supabaseUrl = ''; let supabaseKey = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  }
  
  console.log("--- REST DEBUGGING ---");
  
  const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` };

  // 1. Check user
  const userRes = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.aufarfk5@gmail.com&select=id,full_name`, { headers });
  const userData = await userRes.json();
  
  if (userData.length === 0) {
    console.error("User aufarfk5@gmail.com not found in public.users!");
    return;
  }
  
  const uid = userData[0].id;
  console.log(`User: ${userData[0].full_name} (${uid})`);

  // 2. Check products
  const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?seller_id=eq.${uid}&select=id`, { 
    headers: { ...headers, 'Prefer': 'count=exact' } 
  });
  console.log(`Products: ${prodRes.headers.get('content-range')?.split('/')[1] || 0}`);

  // 3. Check notifications
  const notifRes = await fetch(`${supabaseUrl}/rest/v1/notifications?user_id=eq.${uid}&select=id`, { 
    headers: { ...headers, 'Prefer': 'count=exact' } 
  });
  console.log(`Notifications: ${notifRes.headers.get('content-range')?.split('/')[1] || 0}`);

  // 4. Check conversations
  const convRes = await fetch(`${supabaseUrl}/rest/v1/conversations?or=(buyer_id.eq.${uid},seller_id.eq.${uid})&select=id`, { 
    headers: { ...headers, 'Prefer': 'count=exact' } 
  });
  console.log(`Conversations: ${convRes.headers.get('content-range')?.split('/')[1] || 0}`);
}
debug();
