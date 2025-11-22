import { db } from '@/db';
import { memberPlans } from '@/db/schemas/member-plans';
import { eq } from 'drizzle-orm';

async function updateStripePriceIds() {
  try {
    console.log('Stripe Price IDを更新します...\n');

    // 個人会員プラン
    const individualResult = await db
      .update(memberPlans)
      .set({ stripePriceId: 'price_1SNbQqFhSXHz6aqQCpwfWg47' })
      .where(eq(memberPlans.planCode, 'individual'))
      .returning();

    console.log('✓ 個人会員プラン:', individualResult[0]?.planName, '- price_1SNbQqFhSXHz6aqQCpwfWg47');

    // 法人会員プラン
    const businessResult = await db
      .update(memberPlans)
      .set({ stripePriceId: 'price_1SNbnYFhSXHz6aqQbHOIdV4D' })
      .where(eq(memberPlans.planCode, 'business'))
      .returning();

    console.log('✓ 法人会員プラン:', businessResult[0]?.planName, '- price_1SNbnYFhSXHz6aqQbHOIdV4D');

    // プラチナ個人会員プラン
    const platinumIndividualResult = await db
      .update(memberPlans)
      .set({ stripePriceId: 'price_1SNboBFhSXHz6aqQPnKxBwVS' })
      .where(eq(memberPlans.planCode, 'platinum_individual'))
      .returning();

    console.log('✓ プラチナ個人会員プラン:', platinumIndividualResult[0]?.planName, '- price_1SNboBFhSXHz6aqQPnKxBwVS');

    // プラチナ法人会員プラン
    const platinumBusinessResult = await db
      .update(memberPlans)
      .set({ stripePriceId: 'price_1SW9heFhSXHz6aqQyVlxwdxV' })
      .where(eq(memberPlans.planCode, 'platinum_business'))
      .returning();

    console.log('✓ プラチナ法人会員プラン:', platinumBusinessResult[0]?.planName, '- price_1SW9heFhSXHz6aqQyVlxwdxV');

    console.log('\n✅ すべてのPrice IDを更新しました！');

    // 確認のため全プランを表示
    console.log('\n現在のプラン一覧:');
    const allPlans = await db.select().from(memberPlans);
    allPlans.forEach(plan => {
      console.log(`  ${plan.planName} (${plan.planCode}): ${plan.stripePriceId || '未設定'}`);
    });

  } catch (error) {
    console.error('エラー:', error);
  } finally {
    process.exit(0);
  }
}

updateStripePriceIds();
