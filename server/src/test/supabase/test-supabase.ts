import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
// 環境変数の読み込み
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is not set');
}

if (!supabaseKey) {
  throw new Error('SUPABASE_SERVICE_ANON_KEY is not set');
}

// supabaseのクライアントを作成
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Supabase connecting ...');

  try {
    // 認証状態を確認するだけで接続テスト
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    console.log('Supabase connected successfully', data);
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
}

void testConnection();
