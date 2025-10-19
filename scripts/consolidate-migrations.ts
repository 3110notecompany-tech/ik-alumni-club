/**
 * マイグレーションファイルを統合するスクリプト
 *
 * 既に実行済みの古いマイグレーション（0000, 0001）を統合して、
 * データベースの現在の状態を反映した新しいベースラインマイグレーションを作成します。
 *
 * 使用方法:
 * pnpm tsx scripts/consolidate-migrations.ts
 */

import { readFileSync, writeFileSync, renameSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = './db/migrations';
const META_DIR = join(MIGRATIONS_DIR, 'meta');

// 既に実行済みのマイグレーション（統合対象）
const OLD_MIGRATIONS = [
  '0000_calm_rockslide',
  '0001_mute_dragon_lord',
];

// 新しいマイグレーション（保持する）
const NEW_MIGRATIONS = [
  '0002_parched_ted_forrester',
];

console.log('🔄 マイグレーションファイルの統合を開始します...\n');

// ステップ1: 古いマイグレーションファイルの内容を結合
console.log('📄 ステップ1: 古いマイグレーションファイルを結合...');
const consolidatedSql: string[] = [];

for (const migration of OLD_MIGRATIONS) {
  const filePath = join(MIGRATIONS_DIR, `${migration}.sql`);
  try {
    const content = readFileSync(filePath, 'utf-8');
    consolidatedSql.push(`-- Migration: ${migration}`);
    consolidatedSql.push(content);
    consolidatedSql.push('');
    console.log(`  ✓ ${migration}.sql を読み込みました`);
  } catch (error) {
    console.error(`  ✗ ${migration}.sql の読み込みに失敗:`, error);
  }
}

// ステップ2: 新しい0000マイグレーションファイルを作成
console.log('\n📝 ステップ2: 統合されたマイグレーションファイルを作成...');
const newBaselineName = '0000_consolidated_baseline';
const newBaselinePath = join(MIGRATIONS_DIR, `${newBaselineName}.sql`);

const consolidatedContent = `-- Consolidated baseline migration
-- This file combines the following migrations:
${OLD_MIGRATIONS.map(m => `--   - ${m}`).join('\n')}
--
-- Created: ${new Date().toISOString()}

${consolidatedSql.join('\n')}`;

writeFileSync(newBaselinePath, consolidatedContent, 'utf-8');
console.log(`  ✓ ${newBaselineName}.sql を作成しました`);

// ステップ3: 新しいマイグレーションをリナンバー
console.log('\n🔢 ステップ3: 新しいマイグレーションをリナンバー...');
NEW_MIGRATIONS.forEach((migration, index) => {
  const oldPath = join(MIGRATIONS_DIR, `${migration}.sql`);
  const newNumber = String(index + 1).padStart(4, '0');
  const newName = migration.replace(/^\d+/, newNumber);
  const newPath = join(MIGRATIONS_DIR, `${newName}.sql`);

  try {
    renameSync(oldPath, newPath);
    console.log(`  ✓ ${migration}.sql → ${newName}.sql`);
  } catch (error) {
    console.error(`  ✗ リネームに失敗:`, error);
  }
});

// ステップ4: _journal.jsonを更新
console.log('\n📋 ステップ4: マイグレーション履歴を更新...');
const journalPath = join(META_DIR, '_journal.json');

try {
  const journal = JSON.parse(readFileSync(journalPath, 'utf-8'));

  // 新しいエントリを作成
  const newEntries = [
    {
      idx: 0,
      version: '7',
      when: Date.now(),
      tag: newBaselineName,
      breakpoints: true,
    },
    ...NEW_MIGRATIONS.map((migration, index) => ({
      idx: index + 1,
      version: '7',
      when: Date.now() + index + 1,
      tag: migration.replace(/^\d+/, String(index + 1).padStart(4, '0')),
      breakpoints: true,
    })),
  ];

  journal.entries = newEntries;

  writeFileSync(journalPath, JSON.stringify(journal, null, 2), 'utf-8');
  console.log('  ✓ _journal.json を更新しました');
} catch (error) {
  console.error('  ✗ _journal.json の更新に失敗:', error);
}

console.log('\n✨ マイグレーションファイルの統合が完了しました！');
console.log('\n次のステップ:');
console.log('1. 古いマイグレーションファイルを手動で削除:');
OLD_MIGRATIONS.forEach(m => {
  console.log(`   rm ${MIGRATIONS_DIR}/${m}.sql`);
});
console.log('2. データベースのマイグレーション履歴テーブルをクリア');
console.log('3. pnpm drizzle:fix-history を実行');
console.log('4. pnpm drizzle:migrate を実行');
