import type { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// 環境に応じたファイルを読み込む
const env = process.env.NODE_ENV || "local";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);
