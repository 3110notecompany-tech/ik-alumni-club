import { db } from '@/db';
import { sql } from 'drizzle-orm';

async function checkMigrationStatus() {
  try {
    // マイグレーション履歴を確認
    const migrations = await db.execute(
      sql`SELECT * FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 5`
    );

    console.log('最近のマイグレーション履歴:');
    console.log(migrations);

    // テーブルのカラムを確認
    const memberPlansColumns = await db.execute(
      sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'member_plans'`
    );

    const membersColumns = await db.execute(
      sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'members'`
    );

    console.log('\nmember_plansのカラム:');
    console.log(memberPlansColumns);

    console.log('\nmembersのカラム:');
    console.log(membersColumns);

  } catch (error) {
    console.error('エラー:', error);
  } finally {
    process.exit(0);
  }
}

checkMigrationStatus();
