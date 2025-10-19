# お知らせ管理機能 実装ガイド

**作成日**: 2025-10-19
**機能名**: informations（お知らせ管理）
**参考**: petテーブルの実装パターン

---

## 📋 目次

1. [概要](#概要)
2. [実装フェーズ一覧](#実装フェーズ一覧)
3. [各フェーズの詳細と注意点](#各フェーズの詳細と注意点)
4. [発生した問題と解決策](#発生した問題と解決策)
5. [ベストプラクティス](#ベストプラクティス)
6. [チェックリスト](#チェックリスト)

---

## 概要

### 実装の目的

管理者がお知らせを作成・編集・削除し、一般ユーザーに公開できる機能を実装する。

### 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **ORM**: Drizzle ORM
- **データベース**: PostgreSQL
- **バリデーション**: Zod
- **UI**: shadcn/ui + Tailwind CSS
- **認証**: Better Auth

### アーキテクチャパターン

```
View Layer (Pages)
    ↓
Component Layer (UI Components)
    ↓
Action Layer (Server Actions) ← POST/PUT/DELETE
    ↓
Data Layer (Data Access) ← GET
    ↓
Validation Layer (Zod)
    ↓
Database Layer (Drizzle Schema)
    ↓
PostgreSQL
```

---

## 実装フェーズ一覧

| フェーズ | 内容 | ファイル |
|---------|------|---------|
| **1. データベース層** | スキーマ定義・マイグレーション | `db/schemas/informations.ts` |
| **2. バリデーション層** | Zodスキーマ定義 | `zod/information.ts` |
| **3. 型定義層** | TypeScript型定義 | `types/information.ts` |
| **4. データアクセス層** | GET操作 | `data/information.ts` |
| **5. サーバーアクション層** | POST/PUT/DELETE操作 | `actions/information.ts` |
| **6. コンポーネント層** | UI コンポーネント | `components/information-*.tsx` |
| **7. ページ層** | ページコンポーネント | `app/[locale]/admin/informations/**` |
| **8. 統合** | レイアウト・メニュー・表示 | `layout.tsx`, `admin-sidebar.tsx` |

---

## 各フェーズの詳細と注意点

### フェーズ1: データベース層の設計

#### 実装内容

**ファイル**: `db/schemas/informations.ts`

```typescript
export const informations = pgTable("informations", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  date: date("date").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  url: text("url"),
  published: boolean("published").notNull().default(false),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
```

#### ⚠️ 注意点

##### 1. `date` vs `timestamp` の使い分け

**問題**: 投稿日と作成日時で型が異なる

**解決策**:
- `date`: ユーザーが指定する投稿日（時刻不要）→ `date("date")`
- `createdAt/updatedAt`: システムが記録する正確な日時 → `timestamp()`

##### 2. `createdBy` の外部キー設定

**問題**: 作成者が削除されたらお知らせも削除すべきか？

**解決策**: `onDelete: "set null"`
- お知らせは残す（組織全体の資産）
- 作成者情報だけnullにする（履歴として記録）

```typescript
// ❌ 悪い例: 作成者削除でお知らせも削除
createdBy: text("created_by").references(() => users.id, { onDelete: "cascade" })

// ✅ 良い例: お知らせは残す
createdBy: text("created_by").references(() => users.id, { onDelete: "set null" })
```

##### 3. スキーマのインポート忘れ

**問題**: `db/index.ts`にスキーマを追加し忘れるとクエリが動かない

**解決策**: 必ず追加する

```typescript
// db/index.ts
import * as informationSchema from './schemas/informations';

export const db = drizzle({
  client,
  schema: {
    ...authSchema,
    ...petSchemas,
    ...memberSchema,
    ...informationSchema  // ← 追加必須
  },
});
```

#### マイグレーション

```bash
pnpm drizzle:generate  # マイグレーションファイル生成
pnpm drizzle:migrate   # マイグレーション実行
```

**確認ポイント**:
- テーブルが作成されたか
- 外部キー制約が正しく設定されたか
- デフォルト値が設定されたか

---

### フェーズ2: バリデーション層の設計

#### 実装内容

**ファイル**: `zod/information.ts`

```typescript
export const informationFormSchema = createInsertSchema(informations, {
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式で入力してください"),
  title: z.string().trim().min(1).max(255),
  content: z.string().trim().min(1),
  imageUrl: z.string().optional().refine(...),
  url: z.string().optional().refine(...),
  published: z.boolean().default(false),
}).omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true
});
```

#### ⚠️ 注意点

##### 1. `date`の型変換問題（重要）

**最初の実装（問題あり）**:
```typescript
date: z.coerce.date({
  message: "有効な日付を入力してください",
})
```

**問題点**:
- Zodで`Date`オブジェクトに変換
- しかしPostgreSQLのDATE型は`string`を期待
- サーバーアクション層で`toISOString().split("T")[0]`で変換が必要
- タイムゾーンの問題が発生する可能性

**改善後の実装**:
```typescript
date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式で入力してください")
```

**メリット**:
- 最初から文字列として扱う
- 不要な変換がない
- タイムゾーン問題を回避
- コードがシンプル

**教訓**: データベースが期待する型に合わせてバリデーションを設計する

##### 2. URL検証の非推奨メソッド

**問題**: Zod v4で`.url()`が非推奨

**解決策**: カスタムバリデーション

```typescript
imageUrl: z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "有効なURLを入力してください" }
  )
```

##### 3. `omit()`で除外すべきフィールド

**除外理由**:
- `id`: 自動生成（nanoid）
- `createdBy`: サーバー側で設定（改ざん防止）
- `createdAt`, `updatedAt`: 自動設定

---

### フェーズ3: 型定義層の設計

#### 実装内容

**ファイル**: `types/information.ts`

```typescript
export type Information = typeof informations.$inferSelect;
export type InformationFormData = z.infer<typeof informationFormSchema>;
```

#### ⚠️ 注意点

##### 1. 型の推論方法

- **Drizzle**: `$inferSelect`（読み取り用）、`$inferInsert`（書き込み用）
- **Zod**: `z.infer<typeof schema>`

##### 2. 型の使い分け

| 型 | 用途 | 含まれるフィールド |
|----|------|------------------|
| `Information` | DBから取得したデータ | すべて（id含む） |
| `InformationFormData` | フォーム入力データ | id, createdBy等を除外 |

---

### フェーズ4: データアクセス層の設計

#### 実装内容

**ファイル**: `data/information.ts`

```typescript
import "server-only";  // ← 必須

export const getInformations = async () => {
  return db.query.informations.findMany({
    where: eq(informations.published, true),
    orderBy: [desc(informations.date)],
  });
};

export const getAllInformations = async () => {
  return db.query.informations.findMany({
    orderBy: [desc(informations.date)],
  });
};

export const getInformation = async (id: string) => {
  return db.query.informations.findFirst({
    where: eq(informations.id, id),
  });
};
```

#### ⚠️ 注意点

##### 1. `"server-only"`ディレクティブ

**必須理由**:
- データアクセス層はサーバーでのみ実行
- クライアントバンドルに含めない
- セキュリティ強化

```typescript
import "server-only";  // ← 必ず先頭に追加
```

##### 2. GET操作のみ

**データアクセス層の責任**:
- ✅ データの読み取り（SELECT）
- ❌ データの変更（INSERT/UPDATE/DELETE）

変更操作はサーバーアクション層で実装する。

##### 3. 並び順の設定

```typescript
orderBy: [desc(informations.date)]  // 新しい順
```

---

### フェーズ5: サーバーアクション層の設計

#### 実装内容

**ファイル**: `actions/information.ts`

```typescript
"use server";  // ← 必須

export async function createInformation(formData: InformationFormData) {
  const { userId } = await verifyAdmin();
  const data = informationFormSchema.parse(formData);

  await db.insert(informations).values({
    ...data,
    createdBy: userId,
  });
}

export async function updateInformation(id: string, formData: InformationFormData) {
  await verifyAdmin();
  const data = informationFormSchema.parse(formData);

  await db.update(informations).set(data).where(eq(informations.id, id));
}

export async function deleteInformation(id: string) {
  await verifyAdmin();
  await db.delete(informations).where(eq(informations.id, id));
}
```

#### ⚠️ 注意点

##### 1. 管理者権限チェックの共通化

**最初の実装（問題あり）**:
```typescript
// actions/information.ts内にローカル関数
async function verifyAdmin() {
  const session = await verifySession();
  // ...
}
```

**問題点**:
- 他の管理機能で再利用できない
- コードの重複が発生

**改善後**:
```typescript
// lib/session.ts に移動
export const verifyAdmin = async() => {
  const session = await verifySession();
  const userId = session.user.id;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (!member || member.role !== "admin") {
    throw new Error("管理者権限が必要です");
  }

  return { userId, memberId: member.id };
}
```

**メリット**:
- 再利用可能
- 一箇所で管理
- 保守性向上

##### 2. `createdBy`の自動設定

**重要**: フォームデータに`createdBy`を含めない（改ざん防止）

```typescript
await db.insert(informations).values({
  ...data,
  createdBy: userId,  // ← サーバー側で設定
});
```

##### 3. バリデーションの実行

```typescript
const data = informationFormSchema.parse(formData);  // ← 必ず実行
```

---

### フェーズ6: コンポーネント層の設計

#### 実装内容

**ファイル**:
- `components/information-form.tsx`
- `components/information-card.tsx`
- `components/delete-information-button.tsx`

#### ⚠️ 注意点

##### 1. フォームのデフォルト値

**作成と編集を1つのコンポーネントで対応**:

```typescript
defaultValues: defaultValues
  ? {
      date: defaultValues.date,
      title: defaultValues.title,
      // ...
    }
  : {
      date: new Date().toISOString().split("T")[0],  // 今日の日付
      title: "",
      // ...
    }
```

##### 2. 日付入力フィールド

**HTML5のdate input**:
```tsx
<Input type="date" {...field} />
```

- YYYY-MM-DD形式で自動的に入力
- ブラウザのカレンダーUIを利用
- バリデーションと一致

##### 3. 削除確認ダイアログ

**AlertDialogを使用**:
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">削除</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
    <AlertDialogDescription>
      「{informationTitle}」を削除します。この操作は取り消せません。
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>キャンセル</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

### フェーズ7: ページ層の設計

#### 実装内容

**ディレクトリ構造**:
```
app/[locale]/admin/informations/
├── page.tsx           # 一覧ページ
├── new/
│   └── page.tsx       # 新規作成ページ
└── [id]/
    └── page.tsx       # 編集ページ
```

#### ⚠️ 注意点

##### 1. ページの配置場所

**管理者専用機能** → `/admin/`配下に配置

##### 2. Server Componentの活用

```typescript
export default async function AdminInformationsPage() {
  const informations = await getAllInformations();  // サーバーで実行
  // ...
}
```

##### 3. 空状態の処理

```tsx
{informations.length === 0 ? (
  <div className="empty-state">
    <h3>お知らせがありません</h3>
    <Button asChild>
      <Link href="/admin/informations/new">新規作成</Link>
    </Button>
  </div>
) : (
  // カード一覧
)}
```

---

### フェーズ8: 統合

#### 実装内容

1. **管理者レイアウトの作成**: `app/[locale]/admin/layout.tsx`
2. **サイドバーメニューの追加**: `components/admin-dashboard/admin-sidebar.tsx`
3. **Home画面との連携**: `components/information/content.tsx`

#### ⚠️ 注意点

##### 1. レイアウトの共通化

**問題**: 各ページでサイドバーを個別に実装すると重複

**解決策**: `layout.tsx`で一元管理

```typescript
// app/[locale]/admin/layout.tsx
export default async function AdminLayout({ children }) {
  const session = await verifySession();
  const adminCheck = await isAdmin();

  if (!adminCheck) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header>...</header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

**メリット**:
- すべての`/admin/*`ページで自動適用
- 権限チェックを一元化
- コードの重複を排除

##### 2. Next.js Linkの使用

**サイドバーメニュー**:

```tsx
// ❌ 悪い例
<a href="/admin/informations">お知らせ管理</a>

// ✅ 良い例
<Link href="/admin/informations">お知らせ管理</Link>
```

**理由**:
- クライアント側遷移（高速）
- プリフェッチ対応
- Next.jsの最適化を活用

##### 3. Client Component vs Server Component

**Home画面のお知らせ表示**:

```tsx
// Before: Client Component
export function InformationContents() {
  const t = useTranslations("Contents");
  return <Contents items={[{ title: "仮データ", date: "2025/10/15" }]} />;
}

// After: Server Component
export async function InformationContents() {
  const t = await getTranslations("Contents");
  const informations = await getInformations();  // DBから取得
  const items = informations.slice(0, 3).map((info) => ({
    title: info.title,
    date: info.date,
  }));
  return <Contents items={items} />;
}
```

**変更点**:
- `useTranslations` → `getTranslations`
- `async/await`を追加
- データベースから直接取得

---

## 発生した問題と解決策

### 問題1: Date型とstring型の不一致

**発生フェーズ**: フェーズ2（バリデーション層）、フェーズ5（サーバーアクション層）

**問題内容**:
```
型 'Date' を型 'string' に割り当てることはできません
```

**原因**:
- Zodで`z.coerce.date()`を使用 → `Date`オブジェクト
- PostgreSQLのDATE型は`string`を期待

**解決策**:
```typescript
// Zodスキーマ
date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

// サーバーアクション（変換不要）
await db.insert(informations).values({
  ...data,  // date は既に文字列
  createdBy: userId,
});
```

**教訓**: データベースの期待する型に合わせてバリデーションを設計する

---

### 問題2: 管理者権限チェックの重複

**発生フェーズ**: フェーズ5（サーバーアクション層）

**問題内容**:
- `verifyAdmin()`が`actions/information.ts`にローカル定義
- 他の管理機能でコピペが必要

**解決策**:
```typescript
// lib/session.ts に移動
export const verifyAdmin = async() => { /* ... */ }

// actions/information.ts
import { verifyAdmin } from "@/lib/session";
```

**教訓**: 共通ロジックは早めに抽出・共通化する

---

### 問題3: レイアウトの重複

**発生フェーズ**: フェーズ7（ページ層）

**問題内容**:
- 各ページでサイドバーを個別実装
- コードの重複が多い

**解決策**:
```typescript
// app/[locale]/admin/layout.tsx を作成
export default async function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
```

**教訓**: Next.js App Routerの`layout.tsx`を活用する

---

### 問題4: Zodの非推奨メソッド

**発生フェーズ**: フェーズ2（バリデーション層）

**問題内容**:
- `z.string().url()`が非推奨
- `z.coerce.date()`で`required_error`が使えない

**解決策**:
```typescript
// URL検証
z.string().optional().refine(
  (val) => {
    if (!val || val === "") return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "有効なURLを入力してください" }
)

// 日付検証
z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式で入力してください")
```

**教訓**: ライブラリのバージョンアップに注意し、ドキュメントを確認する

---

## ベストプラクティス

### 1. レイヤーの責任分離

| レイヤー | 責任 | やってはいけないこと |
|---------|------|------------------|
| **データベース層** | スキーマ定義 | ビジネスロジック |
| **バリデーション層** | 入力検証 | DB操作 |
| **型定義層** | 型の提供 | ロジック実装 |
| **データアクセス層** | GET操作のみ | POST/PUT/DELETE |
| **サーバーアクション層** | POST/PUT/DELETE | GET操作 |
| **コンポーネント層** | UI表示 | DB直接アクセス |
| **ページ層** | ルーティング・データ取得 | ビジネスロジック |

### 2. 命名規則

```typescript
// データベース: 複数形
export const informations = pgTable("informations", { ... });

// 型: 単数形
export type Information = typeof informations.$inferSelect;
export type InformationFormData = z.infer<typeof informationFormSchema>;

// 関数: 動詞 + 名詞
export const getInformations = async () => { ... };
export async function createInformation() { ... };

// コンポーネント: PascalCase
export function InformationForm() { ... }
export function InformationCard() { ... }
```

### 3. ファイル配置

```
プロジェクトルート/
├── app/                      # ページ・ルーティング
│   └── [locale]/
│       └── admin/
│           └── informations/
├── components/               # UIコンポーネント
│   ├── information-form.tsx
│   ├── information-card.tsx
│   └── delete-information-button.tsx
├── actions/                  # サーバーアクション
│   └── information.ts
├── data/                     # データアクセス
│   └── information.ts
├── db/
│   └── schemas/              # DBスキーマ
│       └── informations.ts
├── zod/                      # バリデーション
│   └── information.ts
├── types/                    # 型定義
│   └── information.ts
└── lib/                      # 共通ユーティリティ
    └── session.ts
```

### 4. エラーハンドリング

```typescript
// サーバーアクション
try {
  await createInformation(data);
  toast.success("成功");
  router.refresh();
} catch (error) {
  toast.error("エラー");
  console.error(error);
}
```

### 5. セキュリティ

- ✅ すべてのサーバーアクションで権限チェック
- ✅ Zodでバリデーション
- ✅ `createdBy`はサーバー側で設定
- ✅ `"server-only"`ディレクティブを使用
- ✅ SQL Injection対策（Drizzle ORMが自動的に対応）

---

## チェックリスト

### データベース層
- [ ] スキーマ定義完了
- [ ] 外部キー制約設定
- [ ] デフォルト値設定
- [ ] `db/index.ts`にインポート追加
- [ ] マイグレーション実行
- [ ] テーブル作成確認

### バリデーション層
- [ ] `createInsertSchema()`使用
- [ ] 必須フィールドのバリデーション
- [ ] 任意フィールドの`optional()`
- [ ] エラーメッセージ設定
- [ ] `omit()`で不要フィールド除外

### 型定義層
- [ ] `$inferSelect`で読み取り型定義
- [ ] `z.infer`でフォーム型定義
- [ ] エクスポート確認

### データアクセス層
- [ ] `"server-only"`追加
- [ ] GET操作のみ実装
- [ ] `orderBy`で並び順設定
- [ ] 適切な`where`条件

### サーバーアクション層
- [ ] `"use server"`追加
- [ ] 権限チェック実装
- [ ] Zodバリデーション実行
- [ ] エラーハンドリング
- [ ] `createdBy`自動設定

### コンポーネント層
- [ ] フォーム（作成・編集共通）
- [ ] カード表示
- [ ] 削除ボタン（確認ダイアログ付き）
- [ ] toast通知
- [ ] ローディング状態

### ページ層
- [ ] 一覧ページ
- [ ] 新規作成ページ
- [ ] 編集ページ
- [ ] 空状態の処理
- [ ] `notFound()`処理

### 統合
- [ ] レイアウト作成
- [ ] メニュー追加
- [ ] 権限チェック
- [ ] Home画面連携

---

## まとめ

### 実装の流れ

1. **データベース設計書を確認** → 仕様を理解
2. **参考実装（pet）を分析** → パターンを把握
3. **フェーズごとに実装** → ボトムアップ
4. **問題が発生したら立ち止まる** → 設計を見直す
5. **共通化を意識** → DRY原則
6. **テストしながら進める** → 早期発見

### 重要なポイント

1. **型の一貫性**: データベース ↔ バリデーション ↔ TypeScript
2. **責任の分離**: 各レイヤーの役割を明確に
3. **共通化**: 重複コードは早めに抽出
4. **セキュリティ**: 権限チェック・バリデーションを徹底
5. **Next.js の機能活用**: Server Component、layout.tsx、Link

### 次回以降の改善点

- [ ] 画像アップロード機能（現在はURL入力のみ）
- [ ] お知らせの検索機能
- [ ] ページネーション
- [ ] プレビュー機能の強化
- [ ] マークダウン対応
- [ ] 下書き自動保存

---

**作成者**: Claude + User
**参考ドキュメント**: [database-design-sql.md](./database-design-sql.md)
