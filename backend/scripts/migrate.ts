import { execSync } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 環境の型定義
type Environment = "local" | "develop" | "production";

// 環境を取得
const env = (process.env.NODE_ENV || "local") as Environment;
console.log(`environment: ${env}`);

// 環境変数をロード
dotenv.config({ path: path.resolve(__dirname, `../.env.${env}`) });

// マイグレーションディレクトリのパス
const migrationDir = path.resolve(__dirname, "../../supabase/migrations");

// マイグレーションファイルを時間順に取得
const migrationFiles = fs
  .readdirSync(migrationDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

console.log("migration start");

// マイグレーションファイルを順に適用
if (env === "local") {
  migrationFiles.forEach((file) => {
    const filePath = path.join(migrationDir, file);
    console.log(`${file}を適用中`);

    try {
      execSync(
        `cat ${filePath} | docker-compose exec -T db psql -U postgres -d postgres`,
      );
      console.log(`${file} を適用しました`);
    } catch (error) {
      console.error(`${file} の適用中にエラーが発生しました:`, error);
      process.exit(1);
    }
  });
} else {
  // リモート環境
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  if (!SUPABASE_URL) {
    console.error("環境変数が不足しています: SUPABASE_URL");
    process.exit(1);
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error("環境変数が不足しています: SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  // supabase Rest APIを使用してSQL実行
  migrationFiles.forEach((file) => {
    const filePath = path.join(migrationDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");
    console.log(`${file}を適用中`);

    try {
      const curl = `curl -X POST '${SUPABASE_URL}/rest/v1/rpc/execute_sql' \\
        -H 'apikey: ${SUPABASE_SERVICE_ROLE_KEY}' \\
        -H 'Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}' \\
        -H 'Content-Type: application/json' \\
        -d '{"sql": ${JSON.stringify(sql)}}'`;

      execSync(curl, { stdio: "inherit" });
      console.log(`${file} を適用しました`);
    } catch (error) {
      console.error(`${file} の適用中にエラーが発生しました:`, error);
      process.exit(1);
    }
  });
}

console.log("migration end");
