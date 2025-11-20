-- ==========================================
-- 寿地区簡易宿泊所情報サイト - データベーススキーマ
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Profiles Table (ユーザープロフィール)
-- ==========================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ==========================================
-- 2. Lodgings Table (宿泊所情報)
-- ==========================================
CREATE TABLE public.lodgings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  vacancies INTEGER NOT NULL DEFAULT 0 CHECK (vacancies >= 0),
  price_per_night INTEGER NOT NULL CHECK (price_per_night > 0),
  facilities TEXT[] DEFAULT '{}',
  description TEXT,
  image_url TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_updated DATE DEFAULT CURRENT_DATE
);

-- Enable RLS
ALTER TABLE public.lodgings ENABLE ROW LEVEL SECURITY;

-- Lodgings policies (公開されている宿泊所は誰でも閲覧可能)
CREATE POLICY "Published lodgings are viewable by everyone"
  ON public.lodgings FOR SELECT
  USING (is_published = true);

-- ==========================================
-- 3. Owner Lodgings Junction Table (オーナーと宿泊所の関連付け)
-- ==========================================
CREATE TABLE public.owner_lodgings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lodging_id UUID REFERENCES public.lodgings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(owner_id, lodging_id)
);

-- Enable RLS
ALTER TABLE public.owner_lodgings ENABLE ROW LEVEL SECURITY;

-- Owner lodgings policies
CREATE POLICY "Owners can view their own lodgings"
  ON public.owner_lodgings FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can insert owner-lodging relationships"
  ON public.owner_lodgings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==========================================
-- 4. Additional Lodging Policies (オーナー用)
-- ==========================================

-- オーナーは自分の宿泊所を更新可能
CREATE POLICY "Owners can update their own lodgings"
  ON public.lodgings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.owner_lodgings
      WHERE lodging_id = lodgings.id
      AND owner_id = auth.uid()
    )
  );

-- オーナーは自分の宿泊所を閲覧可能（非公開でも）
CREATE POLICY "Owners can view their own lodgings"
  ON public.lodgings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.owner_lodgings
      WHERE lodging_id = lodgings.id
      AND owner_id = auth.uid()
    )
  );

-- 管理者は全ての宿泊所を閲覧・更新可能
CREATE POLICY "Admins can view all lodgings"
  ON public.lodgings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all lodgings"
  ON public.lodgings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert lodgings"
  ON public.lodgings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==========================================
-- 5. Services Table (周辺サービス情報)
-- ==========================================
CREATE TABLE public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('welfare', 'medical', 'employment', 'other')),
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Services are viewable by everyone
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (true);

-- ==========================================
-- 6. Functions & Triggers
-- ==========================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.lodgings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 完了メッセージ
-- ==========================================
-- スキーマ作成が完了しました
-- 次は初期データ移行スクリプト（supabase-seed-data.sql）を実行してください
