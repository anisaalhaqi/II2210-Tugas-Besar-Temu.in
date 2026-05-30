const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function debug() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let supabaseUrl = ''; let supabaseKey = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log("--- DEBUGGING USER AND DATA ---");
  
  // 1. Check if aufar exists
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name')
    .eq('email', 'aufarfk5@gmail.com')
    .single();
    
  if (userError) {
    console.error("User aufarfk5@gmail.com NOT FOUND in public.users table.", userError.message);
    return;
  }
  
  const aufarId = userData.id;
  console.log(`Found User: ${userData.full_name} (${aufarId})`);
  
  // 2. Check products for this ID
  const { count: productCount, error: prodError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('seller_id', aufarId);
    
  console.log(`Products owned: ${productCount || 0}`);
  
  // 3. Check notifications
  const { count: notifCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', aufarId);
    
  console.log(`Notifications: ${notifCount || 0}`);

  // 4. Check conversations
  const { data: convs } = await supabase
    .from('conversations')
    .select('id')
    .or(`buyer_id.eq.${aufarId},seller_id.eq.${aufarId}`);
    
  console.log(`Conversations: ${convs?.length || 0}`);
}

debug();
