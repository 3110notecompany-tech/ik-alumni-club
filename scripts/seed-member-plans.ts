/**
 * member_plansテーブルに初期データを投入するスクリプト
 *
 * 使用方法:
 * pnpm tsx scripts/seed-member-plans.ts
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

const memberPlansData = [
  {
    plan_code: 'individual',
    plan_name: 'Individual Membership',
    display_name: '個人会員',
    description: '個人向けの標準会員プランです。基本的なコンテンツにアクセスできます。',
    price: '3000.00',
    hierarchy_level: 1,
    is_business_plan: false,
    features: JSON.stringify([
      'ニュースレター購読',
      '限定コンテンツ閲覧',
      'イベント優先予約',
    ]),
    color: '#3B82F6',
    is_active: true,
  },
  {
    plan_code: 'business',
    plan_name: 'Business Membership',
    display_name: '法人会員',
    description: '法人向けの会員プランです。個人会員の全特典に加え、法人限定コンテンツにアクセスできます。',
    price: '10000.00',
    hierarchy_level: 2,
    is_business_plan: true,
    features: JSON.stringify([
      '個人会員の全特典',
      '法人限定コンテンツ',
      'ビジネスセミナー参加',
      '企業ロゴ掲載',
    ]),
    color: '#10B981',
    is_active: true,
  },
  {
    plan_code: 'platinum_individual',
    plan_name: 'Platinum Individual Membership',
    display_name: 'プラチナ個人会員',
    description: 'プレミアム個人会員プランです。全コンテンツにアクセスでき、特別な特典が付与されます。',
    price: '30000.00',
    hierarchy_level: 3,
    is_business_plan: false,
    features: JSON.stringify([
      '全コンテンツアクセス',
      'VIPイベント招待',
      '個別相談サービス',
      '限定グッズプレゼント',
    ]),
    color: '#A855F7',
    is_active: true,
  },
  {
    plan_code: 'platinum_business',
    plan_name: 'Platinum Business Membership',
    display_name: 'プラチナ法人会員',
    description: 'プレミアム法人会員プランです。全コンテンツと最高レベルの特典をご利用いただけます。',
    price: '30000.00',
    hierarchy_level: 3,
    is_business_plan: true,
    features: JSON.stringify([
      '全コンテンツアクセス',
      '法人向けVIPイベント',
      '専任コンサルタント',
      '広告掲載優先権',
      'カスタマイズサポート',
    ]),
    color: '#F59E0B',
    is_active: true,
  },
];

async function seedMemberPlans() {
  const sql = postgres(DATABASE_URL as string);

  try {
    console.log('🔍 データベースに接続中...');

    // 既存データの確認
    const existingPlans = await sql`
      SELECT plan_code FROM member_plans
    `;
    const existingCodes = new Set(existingPlans.map((p: any) => p.plan_code));

    console.log('\n📋 既存のプラン:');
    if (existingPlans.length > 0) {
      existingPlans.forEach((p: any) => {
        console.log(`  - ${p.plan_code}`);
      });
    } else {
      console.log('  (データなし)');
    }

    // データ投入
    console.log('\n✅ プランデータを投入中...');
    let insertedCount = 0;
    let skippedCount = 0;

    for (const plan of memberPlansData) {
      if (existingCodes.has(plan.plan_code)) {
        console.log(`  - ${plan.plan_code} は既に存在します（スキップ）`);
        skippedCount++;
        continue;
      }

      await sql`
        INSERT INTO member_plans ${sql(plan)}
      `;
      console.log(`  ✓ ${plan.plan_code} (${plan.display_name}) を追加しました`);
      insertedCount++;
    }

    console.log(`\n📊 結果:`);
    console.log(`  追加: ${insertedCount}件`);
    console.log(`  スキップ: ${skippedCount}件`);

    // 投入後のデータ確認
    console.log('\n📋 投入後のプラン一覧:');
    const allPlans = await sql`
      SELECT id, plan_code, display_name, price, hierarchy_level
      FROM member_plans
      ORDER BY hierarchy_level, is_business_plan
    `;

    allPlans.forEach((p: any) => {
      console.log(`  ${p.id}. ${p.plan_code} - ${p.display_name} (¥${p.price}, Level ${p.hierarchy_level})`);
    });

    console.log('\n✨ 初期データの投入が完了しました！');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// スクリプトを実行
seedMemberPlans();
