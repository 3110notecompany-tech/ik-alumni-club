/**
 * マイグレーション履歴を修正するスクリプト
 *
 * 既にデータベースに存在するテーブルに対応するマイグレーションを
 * __drizzle_migrations テーブルに記録します。
 *
 * 使用方法:
 * pnpm tsx scripts/fix-migration-history.ts
 */

import { config } from 'dotenv';
import postgres from 'postgres';

// .envファイルを読み込む
config({ path: '.env' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URLが設定されていません');
  process.exit(1);
}

// 既に実行済みのマイグレーション（テーブルが既に存在する）
const completedMigrations = [
  '0000_calm_rockslide',      // accounts, sessions, users, verifications, pets
  '0001_mute_dragon_lord',    // 追加のマイグレーション
];

async function fixMigrationHistory() {
  // TypeScriptの型チェックのために、DATABASE_URLが存在することを保証
  const sql = postgres(DATABASE_URL as string);

  try {
    console.log('🔍 データベースに接続中...');

    // 現在のマイグレーション履歴を確認
    console.log('\n📋 現在のマイグレーション履歴:');
    const currentMigrations = await sql`
      SELECT hash, created_at
      FROM drizzle.__drizzle_migrations
      ORDER BY created_at
    `;

    if (currentMigrations.length > 0) {
      currentMigrations.forEach((m: any) => {
        console.log(`  - ${m.hash} (${new Date(Number(m.created_at)).toLocaleString()})`);
      });
    } else {
      console.log('  (履歴なし)');
    }

    // 既に記録されているマイグレーションを取得
    const existingHashes = new Set(currentMigrations.map((m: any) => m.hash));

    // 未記録のマイグレーションを追加
    console.log('\n✅ 未記録のマイグレーションを追加中...');
    let addedCount = 0;

    for (const migration of completedMigrations) {
      if (!existingHashes.has(migration)) {
        const timestamp = Date.now();
        await sql`
          INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
          VALUES (${migration}, ${timestamp})
        `;
        console.log(`  ✓ ${migration} を追加しました`);
        addedCount++;
      } else {
        console.log(`  - ${migration} は既に記録済みです`);
      }
    }

    if (addedCount === 0) {
      console.log('  すべてのマイグレーションが既に記録されています');
    }

    // 更新後のマイグレーション履歴を表示
    console.log('\n📋 更新後のマイグレーション履歴:');
    const updatedMigrations = await sql`
      SELECT hash, created_at
      FROM drizzle.__drizzle_migrations
      ORDER BY created_at
    `;

    updatedMigrations.forEach((m: any) => {
      console.log(`  - ${m.hash} (${new Date(Number(m.created_at)).toLocaleString()})`);
    });

    console.log('\n✨ マイグレーション履歴の修正が完了しました！');
    console.log('次回から pnpm drizzle:migrate を実行すると、新しいマイグレーションのみが適用されます。');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// スクリプトを実行
fixMigrationHistory();
