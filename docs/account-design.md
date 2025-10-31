# アカウント設計ドキュメント

**作成日**: 2025-10-30
**最終更新**: 2025-10-30
**対象システム**: IK ALUMNI CGT サポーターズクラブ会員サイト
**バージョン**: 3.1（新登録フロー - Stripe決済は将来対応）

---

## 📋 目次

1. [概要](#概要)
2. [アカウント構造](#アカウント構造)
3. [認証システム](#認証システム)
4. [会員管理システム](#会員管理システム)
5. [権限設計](#権限設計)
6. [データモデル詳細](#データモデル詳細)
7. [認証フロー](#認証フロー)
8. [会員登録フロー](#会員登録フロー)
9. [セキュリティ設計](#セキュリティ設計)
10. [実装状況](#実装状況)

---

## 概要

### システムの目的

IK ALUMNI CGT サポーターズクラブの会員向けサービスを提供するためのアカウント管理システム。認証と会員情報を分離した2層構造により、柔軟な権限管理と拡張性を実現する。

### 設計の特徴

- **2層アーキテクチャ**: 認証層(Better Auth) + 会員管理層(独自実装)
- **段階的な情報収集**: 最小限の情報で認証 → 詳細情報は会員登録フローで収集
- **ロールベースアクセス制御**: admin / member による権限管理
- **プランベースコンテンツ制御**: Individual / Business / Platinum による階層的アクセス管理（設計書に定義、未実装）

### 本ドキュメントの目的

このドキュメントは以下を明確にします:

1. **現在の実装状況**: 実際に動作している機能（✅ 実装済み）
2. **設計書との対応**: データベース設計書に定義されている完全な設計（🔜 未実装）
3. **実装と設計のギャップ**: 何が実装されていて、何が未実装か
4. **今後の実装方針**: 設計書に基づく拡張計画

**重要な認識**:
- 現在の `members` テーブルは最小限の実装（userId + role のみ）
- データベース設計書には完全な会員情報管理システムが定義されている
- 将来的に詳細な会員情報（氏名、住所、電話番号等）とプラン機能を追加予定

---

## アカウント構造

### システム全体図（完全版設計 - Stripe決済は将来対応）

```
┌─────────────────────────────────────────────────────────────────┐
│                    認証層 (Better Auth)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  users   │  │ sessions │  │ accounts │  │verifications │   │
│  │  - id    │  │          │  │          │  │              │   │
│  │  - name  │  │          │  │          │  │              │   │
│  │  - email │  │          │  │          │  │              │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└───────────────────────┬─────────────────────────────────────────┘
                        │ 1:1
                        │
┌───────────────────────┴─────────────────────────────────────────┐
│                会員管理層 (独自実装)                                │
│  ┌─────────────────────────┐    ┌──────────────────┐           │
│  │ members (完全版)         │N:1 │ member_plans     │🔜未実装   │
│  │ ✅ - id                 │───→│  - id            │           │
│  │ ✅ - userId             │    │  - planCode      │           │
│  │ ✅ - role               │    │  - price         │           │
│  │ 🔜 - lastName           │    │  - hierarchyLevel│           │
│  │ 🔜 - firstName          │    └──────────────────┘           │
│  │ 🔜 - address...         │                                    │
│  │ 🔜 - planId             │                                    │
│  │ 🔜 - status             │                                    │
│  │ 🔜 - profileCompleted   │                                    │
│  └─────────────────────────┘                                    │
└───────────────────────┬─────────────────────────────────────────┘
                        │ 1:N
                        │ (createdBy)
┌───────────────────────┴─────────────────────────────────────────┐
│              コンテンツ層 (作成者情報)                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ blogs    │  │ videos   │  │schedules │  │newsletters│ ...  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘

凡例:
✅ 実装済み
🔜 設計書に定義されているが未実装

会員ステータスフロー（第1フェーズ - 決済なし）:
1. アカウント作成 → status: "pending_profile"（初期状態）
2. プロフィール入力完了 → status: "active" → コンテンツアクセス可能

将来の拡張（第2フェーズ - Stripe決済統合）:
1. アカウント作成 → status: "pending_payment"
2. Stripe決済完了 → status: "pending_profile"
3. プロフィール入力完了 → status: "active" → コンテンツアクセス可能
```

### 2層構造の理由

| 層 | 責任 | 実装 |
|---|------|------|
| **認証層** | ログイン認証、セッション管理、アカウント連携 | Better Auth |
| **会員管理層** | 権限管理、ビジネスロジック、会員属性管理 | 独自実装 |

**メリット**:
- 認証の責任を専門ライブラリに委譲
- ビジネスロジックを柔軟に拡張可能
- 将来的なプラン機能の拡張に対応

---

## 認証システム

### 使用技術

**Better Auth**: 次世代の認証ライブラリ
- TypeScript完全対応
- Drizzle ORM統合
- Email/Password認証
- セッション管理
- CSRF保護

### 認証テーブル構成

#### 1. users テーブル

**目的**: 認証用ユーザー情報の管理

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | text | PK | ユーザーID（Better Auth生成） |
| name | text | NOT NULL | 表示名 |
| email | text | NOT NULL, UNIQUE | メールアドレス |
| emailVerified | boolean | NOT NULL, DEFAULT false | メール確認済みフラグ |
| image | text | NULL | プロフィール画像URL |
| createdAt | timestamp | NOT NULL, DEFAULT NOW() | 作成日時 |
| updatedAt | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**特徴**:
- パスワードは別テーブル(accounts)で管理
- 最小限の情報のみ保持
- Better Authが自動管理

#### 2. sessions テーブル

**目的**: セッション管理

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | text | PK | セッションID |
| expiresAt | timestamp | NOT NULL | 有効期限 |
| token | text | NOT NULL, UNIQUE | セッショントークン |
| createdAt | timestamp | NOT NULL | 作成日時 |
| updatedAt | timestamp | NOT NULL | 更新日時 |
| ipAddress | text | NULL | IPアドレス |
| userAgent | text | NULL | User Agent |
| userId | text | FK, NOT NULL | ユーザーID |

**外部キー**:
- `userId` → `users.id` (onDelete: CASCADE)

**特徴**:
- トークンベースのセッション管理
- デバイス情報の記録
- 自動期限切れ

#### 3. accounts テーブル

**目的**: 認証プロバイダーごとのアカウント情報

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | text | PK | アカウントID |
| accountId | text | NOT NULL | プロバイダー内のID |
| providerId | text | NOT NULL | プロバイダーID（credential等） |
| userId | text | FK, NOT NULL | ユーザーID |
| accessToken | text | NULL | アクセストークン（OAuth用） |
| refreshToken | text | NULL | リフレッシュトークン |
| idToken | text | NULL | IDトークン |
| accessTokenExpiresAt | timestamp | NULL | トークン有効期限 |
| refreshTokenExpiresAt | timestamp | NULL | リフレッシュトークン有効期限 |
| scope | text | NULL | スコープ |
| password | text | NULL | ハッシュ化パスワード |
| createdAt | timestamp | NOT NULL | 作成日時 |
| updatedAt | timestamp | NOT NULL | 更新日時 |

**外部キー**:
- `userId` → `users.id` (onDelete: CASCADE)

**特徴**:
- Email/Password認証の場合、`password`フィールドにハッシュ化されたパスワードを保存
- 将来的なOAuth連携にも対応可能

#### 4. verifications テーブル

**目的**: メール確認やパスワードリセットのトークン管理

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | text | PK | 検証ID |
| identifier | text | NOT NULL | 識別子（メールアドレス等） |
| value | text | NOT NULL | トークン値 |
| expiresAt | timestamp | NOT NULL | 有効期限 |
| createdAt | timestamp | NOT NULL | 作成日時 |
| updatedAt | timestamp | NOT NULL | 更新日時 |

**用途**:
- メールアドレス確認
- パスワードリセット
- 時限トークン管理

---

## 会員管理システム

### 会員ステータス管理

#### ステータス定義

会員登録から完全なアクティブ状態になるまで、複数のステップを経る必要があります。

**第1フェーズ（現在 - 決済なし）**:
```typescript
type MemberStatus =
  | "pending_profile"    // 追加情報入力待ち（アカウント作成直後）
  | "active"             // 完全なアクティブ会員（プロフィール入力完了）
  | "inactive"           // 退会済み
```

**第2フェーズ（将来 - Stripe決済統合後）**:
```typescript
type MemberStatus =
  | "pending_payment"    // 支払い待ち（アカウント作成直後）🔜未実装
  | "pending_profile"    // 追加情報入力待ち（支払い完了後）
  | "active"             // 完全なアクティブ会員（全て完了）
  | "inactive"           // 退会済み
```

#### ステータス遷移図

**第1フェーズ（現在 - 決済なし）**:
```
新規登録
  ↓
pending_profile（追加情報入力待ち）
  ↓ プロフィール完成
active（アクティブ会員）
  ↓ 退会処理
inactive（退会済み）
```

**第2フェーズ（将来 - Stripe決済統合後）**:
```
新規登録
  ↓
pending_payment（支払い待ち）
  ↓ Stripe決済完了
pending_profile（追加情報入力待ち）
  ↓ プロフィール完成
active（アクティブ会員）
  ↓ 退会処理
inactive（退会済み）
```

#### コンテンツアクセス制御

**第1フェーズ（現在 - 決済なし）**:

| ステータス | コンテンツアクセス | マイページ | 管理画面（admin） |
|-----------|-----------------|----------|-----------------|
| pending_profile | ❌ 不可 | ⚠️ プロフィール入力促進 | ✅ 可能 |
| active | ✅ 可能（プラン別） | ✅ 可能 | ✅ 可能 |
| inactive | ❌ 不可 | ❌ 不可 | ✅ 可能 |

**重要なルール**:
- 追加情報未入力の場合、コンテンツアクセス不可
- `status === "active"` かつ適切なプランの場合のみコンテンツアクセス可能

**第2フェーズ（将来 - Stripe決済統合後）**:

| ステータス | コンテンツアクセス | マイページ | 管理画面（admin） |
|-----------|-----------------|----------|-----------------|
| pending_payment | ❌ 不可 | ⚠️ 支払い促進画面のみ | ✅ 可能 |
| pending_profile | ❌ 不可 | ⚠️ プロフィール入力促進 | ✅ 可能 |
| active | ✅ 可能（プラン別） | ✅ 可能 | ✅ 可能 |
| inactive | ❌ 不可 | ❌ 不可 | ✅ 可能 |

**追加ルール**:
- 支払い未完了の場合、コンテンツアクセス不可

### 会員テーブル構成

#### members テーブル（完全版設計 vs 現在の実装）

**目的**: 会員の詳細情報と権限管理

データベース設計書では完全な会員情報管理テーブルとして設計されていますが、現在は最小限の実装となっています。

##### 📘 データベース設計書に基づく完全なカラム定義

| カラム名 | 型 | 制約 | 説明 | 実装状況 |
|---------|-----|------|------|---------|
| **基本情報** |||||
| id | UUID/text | PK | 会員ID | ✅ 実装済み（nanoid） |
| userId | text | FK, NOT NULL, UNIQUE | ユーザーID（Better Auth連携） | ✅ 実装済み |
| email | VARCHAR(255) | UNIQUE, NOT NULL | メールアドレス | 🔜 未実装（usersから取得可能） |
| **氏名情報** |||||
| lastName | VARCHAR(100) | NOT NULL | 姓 | 🔜 未実装 |
| firstName | VARCHAR(100) | NOT NULL | 名 | 🔜 未実装 |
| lastNameKana | VARCHAR(100) | NOT NULL | セイ（カタカナ） | 🔜 未実装 |
| firstNameKana | VARCHAR(100) | NOT NULL | メイ（カタカナ） | 🔜 未実装 |
| **住所情報** |||||
| postalCode | VARCHAR(8) | NOT NULL | 郵便番号（ハイフンなし7桁） | 🔜 未実装 |
| prefecture | VARCHAR(50) | NOT NULL | 都道府県 | 🔜 未実装 |
| city | VARCHAR(100) | NOT NULL | 市区町村 | 🔜 未実装 |
| address | VARCHAR(255) | NOT NULL | 町名番地 | 🔜 未実装 |
| building | VARCHAR(255) | NULL | 建物名・部屋番号 | 🔜 未実装 |
| **連絡先情報** |||||
| phoneNumber | VARCHAR(20) | NOT NULL | 電話番号 | 🔜 未実装 |
| **プラン・権限情報** |||||
| planId | INTEGER | FK, NOT NULL | 会員プランID | 🔜 未実装 |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'member' | 権限（admin/member） | ✅ 実装済み（enum） |
| **ステータス管理** |||||
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending_profile' | 会員ステータス | 🔜 未実装 |
| profileCompleted | BOOLEAN | NOT NULL, DEFAULT false | プロフィール入力完了フラグ | 🔜 未実装 |
| isActive | BOOLEAN | NOT NULL, DEFAULT true | アカウント有効状態（退会管理） | 🔜 未実装 |
| **Stripe決済情報（第2フェーズ）** |||||
| paymentCompleted | BOOLEAN | NULL | 支払い完了フラグ | 🔜 未実装（将来対応） |
| stripeCustomerId | VARCHAR(255) | NULL, UNIQUE | Stripe Customer ID | 🔜 未実装（将来対応） |
| stripeSubscriptionId | VARCHAR(255) | NULL | Stripe Subscription ID | 🔜 未実装（将来対応） |
| stripeSubscriptionStatus | VARCHAR(50) | NULL | Stripe サブスクリプションステータス | 🔜 未実装（将来対応） |
| subscriptionStartedAt | TIMESTAMP | NULL | サブスクリプション開始日時 | 🔜 未実装（将来対応） |
| subscriptionEndsAt | TIMESTAMP | NULL | サブスクリプション終了日時 | 🔜 未実装（将来対応） |
| lastPaymentAt | TIMESTAMP | NULL | 最後の支払い日時 | 🔜 未実装（将来対応） |
| **メタデータ** |||||
| createdAt | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 | ✅ 実装済み |
| updatedAt | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 | ✅ 実装済み |

##### 📝 現在実装されているカラム（簡易版）

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | text | PK | 会員ID（nanoid生成） |
| userId | text | FK, NOT NULL | ユーザーID |
| role | members_role | NOT NULL | 権限（admin / member） |
| createdAt | timestamp | NOT NULL | 作成日時 |
| updatedAt | timestamp | NOT NULL | 更新日時 |

**外部キー**:
- ✅ 実装済み: `userId` → `users.id` (onDelete: CASCADE)
- 🔜 未実装: `planId` → `member_plans.id` (onDelete: RESTRICT)

**enum定義**:
```typescript
export const membersRole = ["admin", "member"] as const;
export const membersRoleEnum = pgEnum("members_role", membersRole);
```

**ビジネスルール（設計書より）**:
- `role` は 'admin' または 'member' のみ許可（CHECK制約）
- `postalCode` は数字7桁（バリデーションはアプリ層で実施）
- 退会時は `isActive` を `false` に設定（論理削除）
- `email` はusersテーブルと重複するが、検索性能とデータの冗長性のため保持

**現在の実装の特徴**:
- ✅ 最小限の実装（userId + role のみ）
- ✅ ユーザーと1:1の関係
- ✅ ロールベースの権限管理
- 🔜 詳細な会員情報は将来実装予定

#### member_plans テーブル（未実装）

**目的**: 会員プランのマスタデータ管理

データベース設計書に定義されているが、現在未実装。

##### 完全なカラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | SERIAL | PK | プランID |
| planCode | VARCHAR(50) | UNIQUE, NOT NULL | プランコード |
| planName | VARCHAR(100) | NOT NULL | プラン名（英語） |
| displayName | VARCHAR(100) | NOT NULL | 表示名（日本語） |
| description | TEXT | NULL | プラン説明 |
| price | DECIMAL(10, 2) | NOT NULL | 月額料金 |
| hierarchyLevel | INTEGER | NOT NULL | 階層レベル（1-3） |
| isBusinessPlan | BOOLEAN | DEFAULT false | 法人プランフラグ |
| features | JSONB | NULL | 特典リスト（JSON） |
| color | VARCHAR(20) | NULL | UI表示用カラーコード |
| isActive | BOOLEAN | DEFAULT true | プラン有効状態 |
| createdAt | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updatedAt | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |

##### 初期データ（設計書より）

| planCode | displayName | price | hierarchyLevel | isBusinessPlan |
|-----------|--------------|-------|-----------------|------------------|
| individual | 個人会員 | 3000.00 | 1 | false |
| business | 法人会員 | 10000.00 | 2 | true |
| platinum_individual | プラチナ個人会員 | 8000.00 | 3 | false |
| platinum_business | プラチナ法人会員 | 20000.00 | 3 | true |

**ビジネスルール**:
- **階層レベル**: 1=Individual, 2=Business, 3=Platinum
- **アクセス制御**: `hierarchyLevel` が大きいほど下位プランのコンテンツにもアクセス可能
- プランの削除は制限（会員が紐づいている場合はRESTRICT）

### リレーションシップ

```typescript
export const roleRequests = relations(members, ({ one }) => ({
  owner: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));
```

**取得例**:
```typescript
// ユーザー情報と会員情報を結合して取得
const memberWithUser = await db.query.members.findFirst({
  where: eq(members.userId, userId),
  with: {
    owner: true,  // users テーブルの情報を含む
  },
});
```

---

## 権限設計

### ロール定義

| ロール | 説明 | 権限 |
|--------|------|------|
| **admin** | 管理者 | - すべてのコンテンツの作成・編集・削除<br>- ユーザー管理<br>- 管理画面へのアクセス<br>- 公開・非公開コンテンツの閲覧 |
| **member** | 一般会員 | - 公開コンテンツの閲覧<br>- 自分のプロフィール編集<br>- 会員限定コンテンツへのアクセス |

### 権限チェックの実装パターン

#### 1. サーバーアクションでの権限チェック（管理者用）

```typescript
// lib/session.ts
export const verifyAdmin = async () => {
  const session = await verifySession();
  const userId = session.user.id;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  if (!member || member.role !== "admin") {
    throw new Error("管理者権限が必要です");
  }

  return { userId, memberId: member.id, member };
};
```

#### 2. コンテンツアクセス権限チェック（会員用）

```typescript
// lib/session.ts
export const verifyActiveMember = async () => {
  const session = await verifySession();
  const userId = session.user.id;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
    with: {
      plan: true,  // プラン情報も取得
    },
  });

  if (!member) {
    throw new Error("会員情報が見つかりません");
  }

  // ステータスチェック
  if (member.status !== "active") {
    throw new Error("コンテンツにアクセスするには会員登録を完了してください");
  }

  return { userId, memberId: member.id, member };
};

export const canAccessContent = (
  member: Member & { plan: MemberPlan },
  content: Content & { requiredPlan: MemberPlan }
): boolean => {
  // 管理者は全てアクセス可能
  if (member.role === "admin") {
    return true;
  }

  // ステータスチェック
  if (member.status !== "active") {
    return false;
  }

  // プラン階層チェック
  return member.plan.hierarchyLevel >= content.requiredPlan.hierarchyLevel;
};
```

#### 3. ページレベルでの権限チェック

##### 管理画面

```typescript
// app/[locale]/admin/layout.tsx
export default async function AdminLayout({ children }) {
  const session = await verifySession();
  const adminCheck = await isAdmin();

  if (!adminCheck) {
    redirect("/");
  }

  return <>{children}</>;
}
```

##### コンテンツページ

```typescript
// app/[locale]/contents/[id]/page.tsx
export default async function ContentPage({ params }: { params: { id: string } }) {
  const { member } = await verifyActiveMember();
  const content = await getContent(params.id);

  if (!content) {
    notFound();
  }

  // アクセス権チェック
  if (!canAccessContent(member, content)) {
    return <AccessDenied reason="plan" />;
  }

  return <ContentDetail content={content} />;
}
```

#### 4. ステータスベースのリダイレクト

```typescript
// middleware.ts または layout
export async function checkMemberStatus() {
  const session = await verifySession();
  const member = await getMember(session.user.id);

  if (!member) {
    return { redirect: "/register" };
  }

  switch (member.status) {
    case "pending_payment":
      return { redirect: "/register/payment" };

    case "pending_profile":
      return { redirect: "/profile/complete" };

    case "active":
      return { allowed: true };

    case "inactive":
      return { redirect: "/account-inactive" };

    default:
      return { redirect: "/" };
  }
}
```

#### 5. コンポーネントレベルでの表示制御

```typescript
// components/admin-sidebar.tsx
const session = await auth();
const adminCheck = await isAdmin();

if (!adminCheck) {
  return null;  // 管理者メニューを非表示
}

// components/content-access-banner.tsx
export function ContentAccessBanner({ member }: { member: Member }) {
  if (member.status === "pending_payment") {
    return (
      <Alert variant="warning">
        <AlertTitle>支払いが必要です</AlertTitle>
        <AlertDescription>
          会員限定コンテンツにアクセスするには、支払いを完了してください。
          <Button asChild>
            <Link href="/register/payment">支払いに進む</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (member.status === "pending_profile") {
    return (
      <Alert variant="info">
        <AlertTitle>プロフィール入力が必要です</AlertTitle>
        <AlertDescription>
          会員限定コンテンツにアクセスするには、プロフィール情報を入力してください。
          <Button asChild>
            <Link href="/profile/complete">プロフィールを入力</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
```

---

## データモデル詳細

### ER図（完全版設計 with Stripe & ステータス管理）

```
┌────────────────────────┐
│      users             │
│  (Better Auth) ✅      │
├────────────────────────┤
│ PK id                  │
│    name                │
│ UK email               │
│    emailVerified       │
│    image               │
│    createdAt           │
│    updatedAt           │
└───────────┬────────────┘
            │ 1
            │
            │ 1
┌───────────┴────────────────────────────────┐
│     members (完全版設計)                     │
│  ✅ 部分実装 🔜 拡張予定                      │
├────────────────────────────────────────────┤
│ PK id                            ✅        │
│ UK,FK userId                     ✅        │
│ UK email                         🔜        │
│ --- 氏名情報 ---                           │
│    lastName                      🔜        │
│    firstName                     🔜        │
│    lastNameKana                  🔜        │
│    firstNameKana                 🔜        │
│ --- 住所情報 ---                           │
│    postalCode                    🔜        │
│    prefecture                    🔜        │
│    city                          🔜        │
│    address                       🔜        │
│    building                      🔜        │
│ --- 連絡先 ---                             │
│    phoneNumber                   🔜        │
│ --- プラン・権限 ---                        │
│ FK planId ──────────┐            🔜        │
│    role              │            ✅        │
│ --- ステータス管理 ---│                     │
│    status            │            🔜        │
│    profileCompleted  │            🔜        │
│    paymentCompleted  │            🔜        │
│    isActive          │            🔜        │
│ --- Stripe連携 ---  │                     │
│ UK stripeCustomerId  │            🔜        │
│    stripeSubscriptionId          🔜        │
│    stripeSubscriptionStatus      🔜        │
│    subscriptionStartedAt         🔜        │
│    subscriptionEndsAt            🔜        │
│    lastPaymentAt                 🔜        │
│ --- メタデータ ---                         │
│    createdAt                     ✅        │
│    updatedAt                     ✅        │
└─────────────────────┼──────────────────────┘
            │ 1       │
            │         │ N
            │ N       │ 1
            │   ┌─────┴────────────────────────┐
            │   │  member_plans 🔜             │
            │   ├──────────────────────────────┤
            │   │ PK id                        │
            │   │ UK planCode                  │
            │   │    displayName               │
            │   │    price                     │
            │   │    hierarchyLevel            │
            │   │    isBusinessPlan            │
            │   │    features (JSONB)          │
            │   │    stripeProductId  🔜       │
            │   │ UK stripePriceId    🔜       │
            │   └──────────────────────────────┘
            │
┌───────────┴────────────┐
│   blogs, videos        │
│  schedules, etc ✅     │
├────────────────────────┤
│    ...                 │
│ FK createdBy           │
│    ...                 │
└────────────────────────┘

外部連携:
  Stripe API
  ├─ Customer (stripeCustomerId)
  ├─ Subscription (stripeSubscriptionId)
  ├─ Payment Events
  └─ Webhook → membersテーブル更新

凡例:
✅ 実装済み
🔜 設計書に定義されているが未実装
```

### データフロー

#### ユーザー作成フロー

```
1. Better Auth: users テーブルに挿入
   ├─ id: 自動生成
   ├─ name: フォーム入力
   ├─ email: フォーム入力
   └─ emailVerified: false

2. Better Auth: accounts テーブルに挿入
   ├─ userId: users.id
   ├─ providerId: "credential"
   └─ password: ハッシュ化パスワード

3. アプリケーション: members テーブルに挿入
   ├─ id: nanoid()
   ├─ userId: users.id
   └─ role: "member"
```

#### ログインフロー

```
1. Better Auth: Email/Password検証
2. Better Auth: sessions テーブルにセッション作成
3. アプリケーション: members テーブルから権限取得
4. セッションにロール情報を含める（オプション）
```

---

## 認証フロー

### サインアップフロー

```
未登録ユーザー
  │
  ├─→ /signup (サービス説明ページ)
  │     - サービス内容の説明
  │     - 会費・推奨環境の表示
  │     - 「登録手続きに進む」ボタン
  │
  └─→ /register (新規登録開始)
        │
        └─→ /register/auth (アカウント作成)
              ├─ 入力: name, email, password
              ├─ Better Auth: users + accounts 作成
              ├─ 独自処理: members 作成 (role: member)
              └─ 完了後に自動ログイン
              │
              └─→ プラン選択・プロフィール入力へ
                  (将来実装予定)
```

### ログインフロー

```
未認証ユーザー
  │
  └─→ /login
        ├─ 入力: email, password
        ├─ Better Auth: 認証処理
        ├─ Better Auth: セッション作成
        └─ リダイレクト: /admin or /
```

### ログアウトフロー

```
認証済みユーザー
  │
  └─→ ログアウトボタン
        ├─ Better Auth: セッション削除
        └─ リダイレクト: /
```

---

## 会員登録フロー

### 新しい登録フロー設計（確定版）

#### フロー全体図（第1フェーズ - 決済なし）

```
┌─────────────────────────────────────────────────────────────┐
│            会員登録フロー（第1フェーズ - 決済なし）               │
└─────────────────────────────────────────────────────────────┘

1. /signup（サービス説明ページ）✅ 実装済み
   ↓
2. /register/terms（会員規約同意）🔜 未実装
   ├─ 会員規約の表示
   ├─ 同意チェックボックス
   └─ 「同意して次へ」ボタン
   ↓
3. /register/plan（会員種別選択）🔜 未実装
   ├─ Individual（個人会員: 3,000円/月）
   ├─ Business（法人会員: 10,000円/月）
   ├─ Platinum Individual（プラチナ個人: 8,000円/月）
   └─ Platinum Business（プラチナ法人: 20,000円/月）
   ↓
4. /register/auth（アカウント作成）✅ 実装済み
   ├─ 入力: name, email, password
   ├─ Better Auth: users + accounts 作成
   ├─ 独自処理: members 作成
   │   - role: "member"
   │   - status: "pending_profile"
   │   - planId: 選択されたプラン
   └─ 自動ログイン
   ↓
5. /dashboard または /profile（マイページ）✅ 実装済み
   ├─ status === "pending_profile" の場合
   ├─ 「プロフィール入力を完了してください」バナー表示
   └─ 「プロフィールを入力する」ボタン → /profile/complete
   ↓
6. /profile/complete（追加情報入力）🔜 未実装
   ├─ 氏名（姓・名、セイ・メイ）
   ├─ 住所（郵便番号、都道府県、市区町村、番地、建物名）
   ├─ 電話番号
   ├─ バリデーション処理
   └─ 保存時:
      - members テーブル更新
      - status → "active"
      - profileCompleted → true
   ↓
7. コンテンツアクセス可能 ✅
   └─ status === "active" かつ適切なプラン
      → 会員限定コンテンツへアクセス可能
```

#### 将来の拡張（第2フェーズ - Stripe決済統合）

```
┌─────────────────────────────────────────────────────────────┐
│         会員登録フロー（第2フェーズ - Stripe決済統合）            │
└─────────────────────────────────────────────────────────────┘

1. /signup（サービス説明ページ）
   ↓
2. /register/terms（会員規約同意）
   ↓
3. /register/plan（会員種別選択）
   ↓
4. /register/auth（アカウント作成）
   ├─ members 作成時に status: "pending_payment" を設定
   └─ 自動ログイン
   ↓
5. /register/payment（支払い処理）🔜 将来実装
   ├─ Stripe Checkout Session作成
   ├─ 決済画面へリダイレクト
   ├─ 決済完了後、Webhookで通知
   └─ members.status → "pending_profile"
      members.paymentCompleted → true
   ↓
6. /dashboard または /profile（マイページ）
   ├─ status === "pending_profile" の場合
   └─ 「プロフィールを入力する」ボタン → /profile/complete
   ↓
7. /profile/complete（追加情報入力）
   ├─ status → "active"
   └─ profileCompleted → true
   ↓
8. コンテンツアクセス可能
```

### 現在の実装状態（簡易版）

```
/signup (情報提供ページ) ✅
  │
  └─→ /register (登録開始) ✅
        │
        └─→ /register/auth (アカウント作成) ✅
              ├─ Better Auth: users 作成
              ├─ Better Auth: accounts 作成 (password保存)
              ├─ 独自処理: members 作成 (role: member)
              └─ 自動ログイン → 完了
```

### 各ステップの詳細

#### ステップ1: サービス説明（/signup）✅ 実装済み

**実装内容**:
- サービス内容の説明
- 会費・推奨環境の表示
- 「登録手続きに進む」ボタン

#### ステップ2: 会員規約同意（/register/terms）🔜 未実装

**実装内容**:
- 会員規約の表示（スクロール可能）
- 同意チェックボックス
- 「同意して次へ」ボタン（チェック必須）

**状態管理**:
```typescript
// RegistrationContext に追加
{
  termsAgreed: boolean;
  termsAgreedAt: Date | null;
}
```

#### ステップ3: 会員種別選択（/register/plan）🔜 未実装

**実装内容**:
- 4つのプランをカード形式で表示
- 各プランの特徴・料金表示
- プラン選択ボタン

**状態管理**:
```typescript
// RegistrationContext に追加
{
  selectedPlanId: number | null;
}
```

#### ステップ4: アカウント作成（/register/auth）✅ 実装済み

**現在の実装**:
- name, email, password の入力
- Better Auth によるアカウント作成
- members レコード作成（role: "member" のみ）

**必要な修正（第1フェーズ）**:
```typescript
// members レコード作成時に追加
{
  role: "member",
  planId: registrationData.selectedPlanId,  // ← 追加
  status: "pending_profile",                 // ← 追加（初期状態）
  profileCompleted: false,                   // ← 追加
}
```

**第2フェーズ（Stripe統合後）の追加項目**:
```typescript
{
  // 上記に加えて
  paymentCompleted: false,                   // ← 追加
  // status: "pending_payment" に変更
}
```

#### ステップ5: マイページでの促進（/dashboard）✅ 実装済み（要修正）

**必要な実装（第1フェーズ）**:
```typescript
// status チェック
if (member.status === "pending_profile") {
  return <ProfileCompletionBanner />; // プロフィール入力促進
}
```

**第2フェーズ（Stripe統合後）の追加**:
```typescript
if (member.status === "pending_payment") {
  return <PaymentRequiredBanner />; // 支払い促進
}
```

#### ステップ6: 追加情報入力（/profile/complete）🔜 未実装

**実装内容**:
- 氏名、住所、電話番号の入力フォーム
- バリデーション（Zod）
- 保存時に members テーブル更新
- status を "active" に変更

#### ステップ7: コンテンツアクセス

**アクセス制御ロジック**:
```typescript
function canAccessContent(member: Member, content: Content): boolean {
  // ステータスチェック
  if (member.status !== "active") {
    return false;
  }

  // プラン階層チェック
  const userPlan = getMemberPlan(member.planId);
  const contentPlan = getMemberPlan(content.requiredPlanId);

  return userPlan.hierarchyLevel >= contentPlan.hierarchyLevel;
}
```

---

## Stripe決済統合設計（第2フェーズ - 将来対応）

**注意**: このセクションは将来実装する機能です。第1フェーズでは決済機能は実装せず、プロフィール入力完了後に即座に `status: "active"` となります。

### 概要

会員登録時の支払い処理にStripeを使用します。サブスクリプション（月額課金）モデルを採用。

### 使用するStripe機能

| 機能 | 用途 |
|------|------|
| **Checkout Session** | 決済画面への誘導 |
| **Customer** | 顧客情報の管理 |
| **Subscription** | 月額サブスクリプション管理 |
| **Product & Price** | プラン・料金の管理 |
| **Webhook** | 決済イベントの受信 |

### Stripeテーブル設計（members テーブルに追加）🔜 将来対応

第2フェーズで membersテーブルにStripe関連カラムを追加予定:

| カラム名 | 型 | 制約 | 説明 | ステータス |
|---------|-----|------|------|---------|
| paymentCompleted | BOOLEAN | NULL | 支払い完了フラグ | 🔜 将来追加 |
| stripeCustomerId | VARCHAR(255) | NULL, UNIQUE | Stripe Customer ID | 🔜 将来追加 |
| stripeSubscriptionId | VARCHAR(255) | NULL | Stripe Subscription ID | 🔜 将来追加 |
| stripeSubscriptionStatus | VARCHAR(50) | NULL | サブスクリプションステータス | 🔜 将来追加 |
| subscriptionStartedAt | TIMESTAMP | NULL | サブスクリプション開始日時 | 🔜 将来追加 |
| subscriptionEndsAt | TIMESTAMP | NULL | サブスクリプション終了日時 | 🔜 将来追加 |
| lastPaymentAt | TIMESTAMP | NULL | 最後の支払い日時 | 🔜 将来追加 |

### Stripeサブスクリプションステータス

| Stripeステータス | membersテーブルへの反映 |
|----------------|---------------------|
| `active` | status: "pending_profile" (初回のみ) または "active" |
| `past_due` | 支払い遅延の警告表示、アクセス維持 |
| `canceled` | status: "inactive", アクセス停止 |
| `unpaid` | status: "inactive", アクセス停止 |
| `incomplete` | status: "pending_payment", アクセス不可 |

### 決済フロー詳細

#### 1. Checkout Session 作成

```typescript
// app/api/stripe/create-checkout-session/route.ts
import Stripe from 'stripe';

export async function POST(request: Request) {
  const { planId, memberId } = await request.json();

  // プラン情報取得
  const plan = await getMemberPlan(planId);

  // Stripe Checkout Session 作成
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: member.email,
    client_reference_id: memberId,
    line_items: [
      {
        price: plan.stripePriceId, // Stripe Price ID
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/register/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/register/payment/cancel`,
    metadata: {
      memberId: memberId,
      planId: planId.toString(),
    },
  });

  return Response.json({ sessionId: session.id });
}
```

#### 2. Webhook処理

```typescript
// app/api/stripe/webhook/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
  }

  return Response.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const memberId = session.metadata?.memberId;
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // members テーブル更新
  await db.update(members)
    .set({
      status: 'pending_profile',
      paymentCompleted: true,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      stripeSubscriptionStatus: subscription.status,
      subscriptionStartedAt: new Date(subscription.current_period_start * 1000),
      subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
      lastPaymentAt: new Date(),
    })
    .where(eq(members.id, memberId!));
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // サブスクリプションステータス更新
  await db.update(members)
    .set({
      stripeSubscriptionStatus: subscription.status,
      subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
    })
    .where(eq(members.stripeSubscriptionId, subscription.id));
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // サブスクリプション削除（退会）
  await db.update(members)
    .set({
      status: 'inactive',
      stripeSubscriptionStatus: 'canceled',
      isActive: false,
    })
    .where(eq(members.stripeSubscriptionId, subscription.id));
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // 継続課金成功
  await db.update(members)
    .set({
      lastPaymentAt: new Date(),
    })
    .where(eq(members.stripeCustomerId, invoice.customer as string));
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // 支払い失敗の通知（メール送信など）
  // 猶予期間後にアクセス停止の処理
}
```

### member_plansテーブルへのStripe情報追加🔜 将来対応

第2フェーズで member_plansテーブルにStripe関連カラムを追加予定:

| カラム名 | 型 | 制約 | 説明 | ステータス |
|---------|-----|------|------|---------|
| stripeProductId | VARCHAR(255) | NULL | Stripe Product ID | 🔜 将来追加 |
| stripePriceId | VARCHAR(255) | NULL, UNIQUE | Stripe Price ID | 🔜 将来追加 |

### Stripe初期設定🔜 将来対応

**注意**: このセクションは第2フェーズで実装します。

#### 1. Productの作成

```bash
# Individual Plan
stripe products create \
  --name="Individual Membership" \
  --description="個人会員プラン"

# Price作成
stripe prices create \
  --product=prod_xxx \
  --unit-amount=300000 \
  --currency=jpy \
  --recurring[interval]=month
```

#### 2. Webhookエンドポイント設定

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**本番環境**:
- Stripeダッシュボードで Webhook エンドポイント追加
- URL: `https://your-domain.com/api/stripe/webhook`
- イベント選択:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### 環境変数🔜 将来対応

```env
# .env.local（第2フェーズで追加）
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# 本番環境
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### テストカード

開発時のテスト用カード番号（第2フェーズで使用）:
- 成功: `4242 4242 4242 4242`
- 3Dセキュア認証: `4000 0025 0000 3155`
- 失敗: `4000 0000 0000 0002`

### セキュリティ考慮事項

第2フェーズ実装時の注意点:
1. **Webhook署名検証**: 必須（不正なリクエストを防ぐ）
2. **冪等性**: 同じイベントが複数回送信される可能性を考慮
3. **APIキーの管理**: 環境変数で管理、コミットしない
4. **金額の検証**: Webhookで受け取った金額が期待値と一致するか確認

---

## セキュリティ設計

### パスワード管理

**ハッシュアルゴリズム**: Better Auth が自動的に安全なハッシュ化を実施
- bcrypt または argon2 を使用（Better Authの設定による）
- ソルト付きハッシュ
- レインボーテーブル攻撃への耐性

### セッション管理

**方式**: トークンベースセッション
- HTTPOnly Cookie
- Secure フラグ（HTTPS環境）
- SameSite 属性によるCSRF対策
- 自動期限切れ

### CSRF対策

**実装**: Better Auth による自動保護
- セッショントークンの検証
- Origin ヘッダーチェック

### XSS対策

**実装**: React の自動エスケープ
- すべての出力はデフォルトでエスケープ
- dangerouslySetInnerHTML の使用制限

### SQL Injection対策

**実装**: Drizzle ORM のパラメータバインディング
- プリペアドステートメント使用
- 動的SQL生成の回避

### 権限チェック

**多層防御**:
1. ページレベル: layout.tsx での認証確認
2. サーバーアクションレベル: 個別関数での権限確認
3. データベースレベル: 外部キー制約

**実装例**:
```typescript
// すべての管理者専用サーバーアクションで実施
export async function createBlog(data: BlogFormData) {
  const { userId, memberId } = await verifyAdmin();  // ← 必須
  // ... 処理
}
```

---

## 実装状況

### 実装済み機能

#### 認証機能
- ✅ Email/Password サインアップ
- ✅ Email/Password ログイン
- ✅ セッション管理
- ✅ ログアウト
- ✅ 自動ログイン（セッション保持）

#### 会員管理機能
- ✅ 会員レコード自動作成（サインアップ時）
- ✅ ロールベース権限管理（admin / member）
- ✅ 管理者権限チェック（`verifyAdmin()`）
- ✅ 権限による画面制御（管理画面アクセス制限）

#### UI
- ✅ ログインページ（`/login`）
- ✅ サインアップ情報ページ（`/signup`）
- ✅ アカウント作成ページ（`/register/auth`）
- ✅ 管理画面レイアウト（認証チェック付き）

### 未実装機能（設計書に記載）

#### 第1フェーズ - 優先実装（決済なし）

**会員登録フロー**:
- 🔜 会員規約同意ページ（`/register/terms`）
- 🔜 プラン選択機能（`/register/plan`）
- 🔜 詳細プロフィール入力（`/profile/complete`）

**プラン管理**:
- 🔜 member_plans テーブル
- 🔜 プランマスタデータ（Individual / Business / Platinum）
- 🔜 プラン別コンテンツアクセス制御
- 🔜 階層的アクセス管理

**追加会員情報**:
- 🔜 氏名（姓・名、セイ・メイ）
- 🔜 住所（郵便番号、都道府県、市区町村、番地、建物名）
- 🔜 電話番号

**会員ステータス管理**:
- 🔜 status カラム（pending_profile / active / inactive）
- 🔜 profileCompleted カラム
- 🔜 isActive カラム

#### 第2フェーズ - 将来実装（Stripe決済統合）

**決済フロー**:
- 🔜 支払い処理ページ（`/register/payment`）
- 🔜 支払い成功ページ（`/register/payment/success`）
- 🔜 支払いキャンセルページ（`/register/payment/cancel`）

**Stripe統合**:
- 🔜 Stripe Checkout Session作成API
- 🔜 Stripe Webhook処理
- 🔜 Stripe Customer Portal
- 🔜 サブスクリプション管理

**決済関連カラム**:
- 🔜 paymentCompleted カラム
- 🔜 stripeCustomerId カラム
- 🔜 stripeSubscriptionId カラム
- 🔜 stripeSubscriptionStatus カラム
- 🔜 subscriptionStartedAt / subscriptionEndsAt カラム

**member_plansテーブルへの追加**:
- 🔜 stripeProductId カラム
- 🔜 stripePriceId カラム

#### その他の拡張（優先度低）

**認証機能拡張**:
- 🔜 メールアドレス確認
- 🔜 パスワードリセット
- 🔜 OAuth連携（Google, GitHub等）

**会員情報管理**:
- 🔜 会社名（法人会員の場合）
- 🔜 プロフィール編集ページの拡充
- 🔜 プラン変更機能

---

## 型定義

### 実装済み型定義

#### User型（認証層）

```typescript
// types/user.ts
import { authClient } from "@/lib/auth-client";

export type User = typeof authClient.$Infer.Session["user"];
```

**内容**:
```typescript
type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

#### SignupFormData型

```typescript
// types/signup.ts
import { signupFormSchema } from "@/zod/signup";
import { z } from "zod";

export type SignupFormData = z.infer<typeof signupFormSchema>;
```

**内容**:
```typescript
type SignupFormData = {
  name: string;
  email: string;
  password: string;
}
```

#### Member型（会員管理層）

##### 現在実装されている型（簡易版）

```typescript
// Drizzle ORMからの型推論
import { members } from "@/db/schemas/member";

export type Member = typeof members.$inferSelect;
```

**内容**:
```typescript
type Member = {
  id: string;
  userId: string;
  role: "admin" | "member";
  createdAt: Date;
  updatedAt: Date;
}
```

##### 将来実装予定の完全な型

データベース設計書に基づく完全版のmembersテーブルが実装された場合の型:

```typescript
type MemberComplete = {
  // 基本情報
  id: string;
  userId: string;
  email: string;

  // 氏名情報
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;

  // 住所情報
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  building: string | null;

  // 連絡先情報
  phoneNumber: string;

  // プラン・権限情報
  planId: number;
  role: "admin" | "member";
  isActive: boolean;

  // メタデータ
  createdAt: Date;
  updatedAt: Date;
}
```

#### MemberPlan型（未実装）

将来実装予定の会員プラン型:

```typescript
type MemberPlan = {
  id: number;
  planCode: string;
  planName: string;
  displayName: string;
  description: string | null;
  price: number; // DECIMAL(10, 2)
  hierarchyLevel: number; // 1-3
  isBusinessPlan: boolean;
  features: object | null; // JSONB
  color: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## バリデーションスキーマ

### 実装済み: サインアップフォーム

```typescript
// zod/signup.ts
export const signupFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "名前を入力してください")
    .max(50, "名前は50文字以内で入力してください"),
  email: z.string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z.string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(100, "パスワードは100文字以内で入力してください")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "パスワードは大文字、小文字、数字を含む必要があります"
    ),
});
```

**バリデーションルール**:
- 名前: 1〜50文字、前後の空白除去
- メールアドレス: 標準的なメールアドレス形式
- パスワード: 8〜100文字、大文字・小文字・数字を各1文字以上含む

### 将来実装予定: 会員プロフィールフォーム

完全な会員情報を収集するためのバリデーションスキーマ案:

```typescript
// zod/member-profile.ts（未実装）
export const memberProfileFormSchema = z.object({
  // 氏名情報
  lastName: z.string()
    .trim()
    .min(1, "姓を入力してください")
    .max(100, "姓は100文字以内で入力してください"),
  firstName: z.string()
    .trim()
    .min(1, "名を入力してください")
    .max(100, "名は100文字以内で入力してください"),
  lastNameKana: z.string()
    .trim()
    .min(1, "セイを入力してください")
    .max(100, "セイは100文字以内で入力してください")
    .regex(/^[ァ-ヶー]+$/, "カタカナで入力してください"),
  firstNameKana: z.string()
    .trim()
    .min(1, "メイを入力してください")
    .max(100, "メイは100文字以内で入力してください")
    .regex(/^[ァ-ヶー]+$/, "カタカナで入力してください"),

  // 住所情報
  postalCode: z.string()
    .trim()
    .regex(/^\d{7}$/, "郵便番号は7桁の数字で入力してください"),
  prefecture: z.string()
    .trim()
    .min(1, "都道府県を選択してください")
    .max(50, "都道府県は50文字以内で入力してください"),
  city: z.string()
    .trim()
    .min(1, "市区町村を入力してください")
    .max(100, "市区町村は100文字以内で入力してください"),
  address: z.string()
    .trim()
    .min(1, "町名番地を入力してください")
    .max(255, "町名番地は255文字以内で入力してください"),
  building: z.string()
    .trim()
    .max(255, "建物名は255文字以内で入力してください")
    .optional(),

  // 連絡先情報
  phoneNumber: z.string()
    .trim()
    .regex(/^0\d{9,10}$/, "有効な電話番号を入力してください（ハイフンなし）"),
});
```

**バリデーションルール**:
- 氏名: 各100文字以内、カナはカタカナのみ
- 郵便番号: 7桁の数字（ハイフンなし）
- 都道府県: 50文字以内
- 市区町村: 100文字以内
- 町名番地: 255文字以内、必須
- 建物名: 255文字以内、任意
- 電話番号: 0から始まる10〜11桁の数字（ハイフンなし）

---

## URL設計

### 認証・登録関連URL

#### 第1フェーズ（決済なし）

| URL | 説明 | アクセス権 | 実装状況 |
|-----|------|-----------|---------|
| `/login` | ログイン | 未認証のみ | ✅ |
| `/signup` | サービス説明・会員登録案内 | 未認証のみ | ✅ |
| `/register` | 登録フロー開始 | 未認証のみ | ✅ |
| `/register/terms` | 会員規約同意 | 未認証のみ | 🔜 第1フェーズ |
| `/register/plan` | プラン選択 | 未認証のみ | 🔜 第1フェーズ |
| `/register/auth` | アカウント作成 | 未認証のみ | ✅ |

#### 第2フェーズ（Stripe決済統合）

| URL | 説明 | アクセス権 | 実装状況 |
|-----|------|-----------|---------|
| `/register/payment` | 支払い処理（Stripe） | 認証済み・status: pending_payment | 🔜 第2フェーズ |
| `/register/payment/success` | 支払い成功 | 認証済み | 🔜 第2フェーズ |
| `/register/payment/cancel` | 支払いキャンセル | 認証済み | 🔜 第2フェーズ |

### 会員専用URL

| URL | 説明 | アクセス権 | 実装状況 |
|-----|------|-----------|---------|
| `/dashboard` | ダッシュボード | 認証済み | ✅ |
| `/profile` | プロフィール | 認証済み | ✅ |
| `/profile/complete` | 追加情報入力 | 認証済み・status: pending_profile | 🔜 第1フェーズ |
| `/contents` | コンテンツライブラリ | status: active のみ | ✅（要修正） |
| `/contents/[id]` | コンテンツ詳細 | status: active + プラン確認 | ✅（要修正） |
| `/admin/*` | 管理画面 | 管理者のみ | ✅ |

### APIエンドポイント

#### 第2フェーズ（Stripe決済統合）

| URL | メソッド | 説明 | 実装状況 |
|-----|---------|------|---------|
| `/api/stripe/create-checkout-session` | POST | Stripe Checkout Session 作成 | 🔜 第2フェーズ |
| `/api/stripe/webhook` | POST | Stripe Webhook受信 | 🔜 第2フェーズ |
| `/api/stripe/customer-portal` | POST | Stripe Customer Portal作成 | 🔜 第2フェーズ |

---

## まとめ

### アカウント設計の特徴

1. **2層アーキテクチャ**
   - 認証層: Better Auth（専門ライブラリ）
   - 会員管理層: 独自実装（ビジネスロジック）

2. **段階的な情報収集**
   - 最小限の情報で認証完了
   - 詳細情報は会員登録フローで収集（第1フェーズで実装）

3. **柔軟な権限管理**
   - ロールベース: admin / member
   - プランベース: Individual / Business / Platinum（第1フェーズで実装）

4. **段階的な機能追加**
   - 第1フェーズ: 決済なしで会員登録・プロフィール管理
   - 第2フェーズ: Stripe決済統合によるサブスクリプション管理

5. **セキュリティ重視**
   - パスワードハッシュ化
   - セッション管理
   - CSRF/XSS対策
   - 多層防御

### 実装ロードマップ

#### 第1フェーズ（優先実装 - 決済なし）

##### 1. member_plansテーブルの作成

**実装内容**:
- テーブル作成（`db/schemas/member-plans.ts`）
- 初期データ投入（4プラン）
- 型定義（`types/member-plan.ts`）

**階層的アクセス制御の実装**:
```typescript
// Platinum会員は全コンテンツにアクセス可能
// Business会員はBusiness + Individualにアクセス可能
// Individual会員はIndividualのみアクセス可能
const canAccessContent = (
  userPlanLevel: number,
  contentPlanLevel: number
) => userPlanLevel >= contentPlanLevel;
```

##### 2. membersテーブルの拡張

**追加が必要なカラム（第1フェーズ）**:
- 氏名情報: `lastName`, `firstName`, `lastNameKana`, `firstNameKana`
- 住所情報: `postalCode`, `prefecture`, `city`, `address`, `building`
- 連絡先情報: `phoneNumber`
- プラン情報: `planId`（外部キー）
- ステータス管理: `status`, `profileCompleted`, `isActive`
- その他: `email`（検索性能向上のため）

**実装時の注意点**:
- 既存データのマイグレーション戦略が必要
- NOT NULL制約のあるカラムはデフォルト値またはバックフィル処理が必要
- カタカナバリデーションの実装

##### 3. 会員登録フローの完成

**実装が必要なページ**:
- `/register/terms` - 会員規約同意
- `/register/plan` - プラン選択
- `/profile/complete` - 詳細プロフィール入力

**実装順序**:
1. member_plansテーブル作成
2. membersテーブルにカラム追加
3. バリデーションスキーマ作成
4. フォームコンポーネント作成
5. ページ実装
6. フロー全体の統合テスト

#### 第2フェーズ（将来実装 - Stripe決済統合）

##### 1. membersテーブルへのStripe関連カラム追加

**追加カラム**:
- `paymentCompleted`: 支払い完了フラグ
- `stripeCustomerId`: Stripe Customer ID
- `stripeSubscriptionId`: Stripe Subscription ID
- `stripeSubscriptionStatus`: サブスクリプションステータス
- `subscriptionStartedAt` / `subscriptionEndsAt`: 期間管理
- `lastPaymentAt`: 最終支払い日時

##### 2. member_plansテーブルへのStripe情報追加

**追加カラム**:
- `stripeProductId`: Stripe Product ID
- `stripePriceId`: Stripe Price ID

##### 3. 決済フローの実装

**実装が必要なページ**:
- `/register/payment` - 支払い処理
- `/register/payment/success` - 支払い成功
- `/register/payment/cancel` - 支払いキャンセル

**APIエンドポイント**:
- `/api/stripe/create-checkout-session` - Checkout Session作成
- `/api/stripe/webhook` - Webhook処理
- `/api/stripe/customer-portal` - Customer Portal

##### 4. ステータス遷移の変更

- アカウント作成時: `status: "pending_payment"`
- 決済完了時: `status: "pending_profile"`
- プロフィール完了時: `status: "active"`

#### その他の拡張（優先度低）

**認証機能の拡張**:
- メールアドレス確認（verificationsテーブル活用）
- パスワードリセット機能
- OAuth連携（Google, GitHub等）
- 2段階認証（オプション）

**会員情報管理機能**:
- プロフィール編集ページの拡充
- 住所・電話番号の変更機能
- プラン変更機能（アップグレード/ダウングレード）
- 退会処理（`isActive` を false に設定）
- 会社名管理（法人会員向け）

---

## 関連ドキュメント

- [データベース設計書](./database-design-sql.md) - 詳細なテーブル設計
- [URL設計](./url-design.md) - ルーティング設計
- [ページ構成一覧](./pages-overview.md) - 全ページの機能一覧
- [実装ガイド](./implementation-guide-generic.md) - CRUD機能の実装パターン

---

**最終更新**: 2025-10-30
**変更内容**: Stripe決済を第2フェーズに移行し、第1フェーズでは決済なしで会員登録を完了できるように変更
**レビュアー**: -
**承認者**: -
