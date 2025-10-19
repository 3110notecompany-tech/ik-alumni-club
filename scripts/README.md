# マイグレーション履歴の修正方法

## 問題の概要

新しいテーブルを作成するたびに、`pnpm drizzle:migrate` を実行すると以下のエラーが発生します：

```
DrizzleQueryError: Failed query: CREATE TABLE "accounts" ...
PostgresError: relation "accounts" already exists
```

これは、データベースには既にテーブルが存在するのに、Drizzleのマイグレーション履歴テーブル (`__drizzle_migrations`) にそれらのマイグレーションが記録されていないために発生します。

## 解決方法

### ステップ1: マイグレーション履歴を修正

以下のコマンドを実行して、既に実行済みのマイグレーションを履歴テーブルに記録します：

```bash
pnpm drizzle:fix-history
```

このスクリプトは以下を実行します：
1. 現在のマイグレーション履歴を表示
2. 既に実行済みのマイグレーション（`0000_calm_rockslide` と `0001_mute_dragon_lord`）を履歴に追加
3. 更新後の履歴を表示

### ステップ2: 新しいマイグレーションを実行

履歴を修正した後、通常通りマイグレーションを実行できます：

```bash
pnpm drizzle:migrate
```

これで、最新のマイグレーション（`0002_parched_ted_forrester` 以降）のみが実行されます。

## 今後の運用

### 新しいテーブルを追加する場合

1. スキーマファイルを編集 (例: `db/schemas/informations.ts`)
2. マイグレーションを生成: `pnpm drizzle:generate`
3. マイグレーションを実行: `pnpm drizzle:migrate`

または、一度に実行：

```bash
pnpm drizzle:gm
```

### 既に実行済みのマイグレーションを追加する場合

`scripts/fix-migration-history.ts` の `completedMigrations` 配列を編集して、記録したいマイグレーションを追加します：

```typescript
const completedMigrations = [
  '0000_calm_rockslide',
  '0001_mute_dragon_lord',
  // 新しいマイグレーションをここに追加
];
```

その後、再度 `pnpm drizzle:fix-history` を実行します。

## トラブルシューティング

### エラー: DATABASE_URLが設定されていません

`.env` ファイルに `DATABASE_URL` が正しく設定されているか確認してください。

### エラー: テーブルが存在しません

マイグレーション履歴を記録しようとしているテーブルが実際にデータベースに存在するか確認してください。

```bash
# データベースに接続して確認
psql $DATABASE_URL -c "\dt"
```

## 参考

- [Drizzle Kit Migration](https://orm.drizzle.team/kit-docs/commands#migration)
- [scripts/fix-migration-history.ts](./fix-migration-history.ts)
