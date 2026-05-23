-- TABLE: profiles
-- Menyimpan data user tambahan
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  location TEXT DEFAULT 'ITB Ganesha',
  role TEXT DEFAULT 'Mahasiswa ITB',
  rating DECIMAL(3,2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- TABLE: products
-- Menyimpan daftar barang yang dijual
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  price BIGINT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  originality TEXT,
  usage_period TEXT,
  images TEXT[] DEFAULT '{}',
  ai_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- TABLE: favorites
-- Menampung barang yang disukai user
CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, product_id)
);

-- TABLE: cart_items
-- Menampung barang dalam keranjang belanja
CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- TABLE: activities / transactions
-- Menampung riwayat transaksi (Aktivitas)
CREATE TABLE activities (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  counterparty_id UUID REFERENCES profiles(id),
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('Jual', 'Beli')),
  status TEXT DEFAULT 'Menunggu Konfirmasi',
  price BIGINT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- TABLE: conversations
-- Grouping pesan antar dua user
CREATE TABLE conversations (
  id BIGSERIAL PRIMARY KEY,
  participant1_id UUID REFERENCES profiles(id),
  participant2_id UUID REFERENCES profiles(id),
  last_message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- TABLE: messages
-- Isi chat detail
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT DEFAULT 'text', -- text, offer, image
  content TEXT,
  metadata JSONB DEFAULT '{}', -- data tambahan untuk offer (price, status)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS (Row Level Security) - Contoh dasar
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Users can insert own products." ON products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own products." ON products FOR UPDATE USING (auth.uid() = seller_id);