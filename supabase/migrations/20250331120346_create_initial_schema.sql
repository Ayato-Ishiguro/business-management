-- ロール用ENUM型の作成
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('一般', '管理者', 'システム管理者');
  END IF;
END
$$;

-- ユーザーテーブル作成
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT '一般',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- オフィス訪問テーブル作成
CREATE TABLE IF NOT EXISTS public.office_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  is_visited_this_month BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLSの設定
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_visits ENABLE ROW LEVEL SECURITY;

-- ユーザーポリシー設定
DROP POLICY IF EXISTS "ユーザーは全員閲覧可能" ON public.users;
CREATE POLICY "ユーザーは全員閲覧可能" ON public.users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "管理者はユーザー情報を管理可能" ON public.users;
CREATE POLICY "管理者はユーザー情報を管理可能" ON public.users
  FOR ALL USING (auth.jwt() ? 'role' IN ('管理者', 'システム管理者'));

-- オフィス訪問ポリシー設定
DROP POLICY IF EXISTS "オフィス訪問は全員閲覧可能" ON public.office_visits;
CREATE POLICY "オフィス訪問は全員閲覧可能" ON public.office_visits
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "自分の訪問記録のみ編集可能" ON public.office_visits;
CREATE POLICY "自分の訪問記録のみ編集可能" ON public.office_visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "管理者は全ての訪問記録を管理可能" ON public.office_visits;
CREATE POLICY "管理者は全ての訪問記録を管理可能" ON public.office_visits
  FOR ALL USING (auth.jwt() ? 'role' IN ('管理者', 'システム管理者'));