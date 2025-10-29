# レイアウトリファクタリング実装ガイド

## 目次

1. [概要](#概要)
2. [現状の問題点](#現状の問題点)
3. [目標アーキテクチャ](#目標アーキテクチャ)
4. [移行戦略](#移行戦略)
5. [フェーズ1: 準備](#フェーズ1-準備)
6. [フェーズ2: ページの段階的移行](#フェーズ2-ページの段階的移行)
7. [フェーズ3: クリーンアップ](#フェーズ3-クリーンアップ)
8. [テスト戦略](#テスト戦略)
9. [ロールバック手順](#ロールバック手順)
10. [トラブルシューティング](#トラブルシューティング)

---

## 概要

このドキュメントは、現在の条件分岐ベースのレイアウト実装から、Next.js App Routerのルートグループを使用した理想的なレイアウト構造への移行手順を説明します。

### 移行の目的

- ルートレイアウトの条件分岐を削除
- ルートグループを使用したクリーンなレイアウト管理
- 保守性と拡張性の向上
- Next.jsのベストプラクティスに準拠

### 想定作業時間

- **準備**: 1-2時間
- **段階的移行**: 3-4時間
- **クリーンアップ**: 1時間
- **テスト**: 2-3時間
- **合計**: 約1-2日間

---

## 現状の問題点

### 問題1: ルートレイアウトでの条件分岐

**現在の実装** (`app/[locale]/layout.tsx:87-101`)

```tsx
const headersList = await headers();
const pathname = headersList.get("x-pathname") || "";
const isAdminPage = pathname.includes("/admin");
const isSupportersPage = pathname.includes("/supporters");

return (
  <html lang={locale}>
    <body>
      <NextIntlClientProvider messages={messages}>
        <NuqsAdapter>
          {!isAdminPage && !isSupportersPage && <Header />}
          {children}
          {!isAdminPage && !isSupportersPage && <Footer />}
          <Toaster />
        </NuqsAdapter>
      </NextIntlClientProvider>
    </body>
  </html>
);
```

**問題点:**
- ❌ 新しいレイアウトパターンを追加するたびに条件分岐が増える
- ❌ middlewareで`x-pathname`ヘッダーを設定する必要がある
- ❌ レイアウトの責務がルートレイアウトに集中
- ❌ テストとメンテナンスが困難

### 問題2: スケーラビリティの欠如

今後、以下のような要件が出た場合に対応困難:
- 異なるヘッダーデザインのページ
- サイドバー付きのページ
- フッターのみ異なるページ

---

## 目標アーキテクチャ

### ディレクトリ構造

```
app/[locale]/
├── layout.tsx                      # プロバイダーのみのシンプルなレイアウト
├── (main)/
│   ├── layout.tsx                  # ヘッダー・フッター付きレイアウト
│   ├── page.tsx                    # トップページ
│   ├── information/
│   │   └── page.tsx
│   ├── pets/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── mypage/
│   │   └── page.tsx
│   └── new/
│       └── page.tsx
├── (auth)/
│   ├── layout.tsx                  # 認証画面用レイアウト（ヘッダー・フッターなし）
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── (marketing)/
│   ├── layout.tsx                  # LP用レイアウト
│   └── supporters/
│       └── page.tsx
└── admin/
    ├── layout.tsx                  # 管理画面用レイアウト（既存、変更なし）
    ├── login/
    │   └── page.tsx
    ├── dashboard/
    │   └── page.tsx
    └── ... (その他の管理画面)
```

### レイアウトの責務分離

| レイアウト | 役割 | 含まれるコンポーネント |
|-----------|------|----------------------|
| `layout.tsx` | プロバイダー、フォント、メタデータ | NextIntlClientProvider, NuqsAdapter, Toaster |
| `(main)/layout.tsx` | メインコンテンツ用 | Header, Footer |
| `(auth)/layout.tsx` | 認証画面用 | なし（シンプルなラッパーのみ） |
| `(marketing)/layout.tsx` | LP用 | なし（ページ内で独自実装） |
| `admin/layout.tsx` | 管理画面用 | AdminSidebar（既存のまま） |

---

## 移行戦略

### 基本方針

1. **非破壊的移行**: 既存のページを動作させたまま、新しい構造を構築
2. **段階的移行**: 1ページずつ移行し、各段階でテスト
3. **リスク最小化**: シンプルなページから移行開始
4. **ロールバック可能**: 各段階で元に戻せる状態を維持

### 移行順序（リスクの低い順）

1. **認証画面** (`/login`, `/signup`) - 独立性が高い
2. **マーケティングページ** (`/supporters`) - 独自レイアウト
3. **トップページ** (`/`) - 最も重要だが影響範囲が明確
4. **その他メインページ** (`/information`, `/pets`, etc.)
5. **ルートレイアウトの簡略化**

---

## フェーズ1: 準備

このフェーズでは既存のページに一切触れず、新しい構造のみを準備します。

### ステップ1-1: ルートグループディレクトリの作成

```bash
# プロジェクトルートで実行
cd /Users/ryosaito/Developer/learning/ik-alumni-club/ik-alumni-club

# ルートグループディレクトリを作成
mkdir -p app/\[locale\]/\(main\)
mkdir -p app/\[locale\]/\(auth\)
mkdir -p app/\[locale\]/\(marketing\)
```

### ステップ1-2: メインレイアウトの作成

**ファイル**: `app/[locale]/(main)/layout.tsx`

```tsx
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
```

**動作確認**:
```bash
# 型チェック
npx tsc --noEmit

# ビルド確認
npm run build
```

### ステップ1-3: 認証レイアウトの作成

**ファイル**: `app/[locale]/(auth)/layout.tsx`

```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証画面はヘッダー・フッターなしで、
  // ページ内で独自のレイアウトを実装する
  return <>{children}</>;
}
```

### ステップ1-4: マーケティングレイアウトの作成

**ファイル**: `app/[locale]/(marketing)/layout.tsx`

```tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // マーケティングページは独自のレイアウトを持つため
  // ここではシンプルにchildrenをレンダリング
  return <>{children}</>;
}
```

### ステップ1-5: 動作確認

```bash
# ビルドエラーがないか確認
npm run build

# 開発サーバー起動
npm run dev
```

**確認ポイント**:
- ビルドエラーが出ないこと
- 既存のページが全て正常に表示されること
- レイアウトファイルが正しく認識されていること

---

## フェーズ2: ページの段階的移行

### ステップ2-1: 認証ページの移行 (/login)

#### 2-1-1: loginディレクトリの移動

```bash
# バックアップを作成（念のため）
cp -r app/\[locale\]/login app/\[locale\]/login.backup

# 新しい場所にディレクトリを作成
mkdir -p app/\[locale\]/\(auth\)/login

# ページファイルをコピー（まずは共存させる）
cp app/\[locale\]/login/page.tsx app/\[locale\]/\(auth\)/login/page.tsx
```

#### 2-1-2: 動作確認

開発サーバーを起動して確認:

```bash
npm run dev
```

ブラウザで以下を確認:
- http://localhost:3000/ja/login にアクセス
- ヘッダー・フッターが**表示されない**こと
- ログインフォームが正常に表示されること
- ログイン機能が正常に動作すること

#### 2-1-3: 元のファイルを削除

動作確認が取れたら:

```bash
# 元のファイルを削除
rm -rf app/\[locale\]/login

# バックアップも削除（問題なければ）
rm -rf app/\[locale\]/login.backup
```

### ステップ2-2: signupページの移行

loginと同じ手順:

```bash
# バックアップ
cp -r app/\[locale\]/signup app/\[locale\]/signup.backup

# 新しい場所にコピー
mkdir -p app/\[locale\]/\(auth\)/signup
cp app/\[locale\]/signup/page.tsx app/\[locale\]/\(auth\)/signup/page.tsx

# 動作確認
# http://localhost:3000/ja/signup にアクセスして確認

# 元のファイルを削除
rm -rf app/\[locale\]/signup
rm -rf app/\[locale\]/signup.backup
```

**確認ポイント**:
- ヘッダー・フッターが表示されない
- サインアップフォームが正常に表示
- サインアップ機能が正常に動作

### ステップ2-3: supportersページの移行

```bash
# バックアップ
cp -r app/\[locale\]/supporters app/\[locale\]/supporters.backup

# 新しい場所にコピー
mkdir -p app/\[locale\]/\(marketing\)/supporters
cp -r app/\[locale\]/supporters/* app/\[locale\]/\(marketing\)/supporters/

# 動作確認
# http://localhost:3000/ja/supporters にアクセスして確認

# 元のファイルを削除
rm -rf app/\[locale\]/supporters
rm -rf app/\[locale\]/supporters.backup
```

**確認ポイント**:
- ページ独自のレイアウトが正常に表示
- 画像が正常に読み込まれる（相対パスに注意）
- リンクが正常に機能

**注意**: supportersディレクトリには画像ファイルも含まれているため、ディレクトリごと移動する必要があります。

### ステップ2-4: トップページの移行

```bash
# page.tsxとhero-bg.jpgを移動する必要がある
cp app/\[locale\]/page.tsx app/\[locale\]/\(main\)/page.tsx
cp app/\[locale\]/hero-bg.jpg app/\[locale\]/\(main\)/hero-bg.jpg

# 動作確認
# http://localhost:3000/ja/ にアクセスして確認

# 元のファイルを削除
rm app/\[locale\]/page.tsx
rm app/\[locale\]/hero-bg.jpg
```

**確認ポイント**:
- ヘッダー・フッターが**表示される**こと
- ヒーロー画像が正常に表示
- 各コンテンツセクションが正常に表示

### ステップ2-5: その他のメインページの移行

#### informationページ

```bash
mkdir -p app/\[locale\]/\(main\)/information
cp app/\[locale\]/information/page.tsx app/\[locale\]/\(main\)/information/page.tsx

# 動作確認後
rm -rf app/\[locale\]/information
```

#### petsページ（動的ルートを含む）

```bash
mkdir -p app/\[locale\]/\(main\)/pets/\[id\]
cp app/\[locale\]/pets/page.tsx app/\[locale\]/\(main\)/pets/page.tsx
cp app/\[locale\]/pets/\[id\]/page.tsx app/\[locale\]/\(main\)/pets/\[id\]/page.tsx

# 動作確認後
rm -rf app/\[locale\]/pets
```

**確認ポイント**:
- 一覧ページと詳細ページ両方が動作
- 動的ルーティングが正常に機能

#### mypageページ

```bash
mkdir -p app/\[locale\]/\(main\)/mypage
cp app/\[locale\]/mypage/page.tsx app/\[locale\]/\(main\)/mypage/page.tsx

# 動作確認後
rm -rf app/\[locale\]/mypage
```

#### newページ

```bash
mkdir -p app/\[locale\]/\(main\)/new
cp app/\[locale\]/new/page.tsx app/\[locale\]/\(main\)/new/page.tsx

# 動作確認後
rm -rf app/\[locale\]/new
```

### ステップ2-6: 全ページの動作確認

全ページの移行が完了したら、以下をテスト:

```bash
# ビルド確認
npm run build

# 型チェック
npx tsc --noEmit
```

**手動テストチェックリスト**:

- [ ] `/` - トップページが正常に表示、ヘッダー・フッターあり
- [ ] `/information` - お知らせページが正常に表示、ヘッダー・フッターあり
- [ ] `/pets` - ペット一覧が正常に表示、ヘッダー・フッターあり
- [ ] `/pets/[id]` - ペット詳細が正常に表示、ヘッダー・フッターあり
- [ ] `/mypage` - マイページが正常に表示、ヘッダー・フッターあり
- [ ] `/new` - 新規登録完了ページが正常に表示、ヘッダー・フッターあり
- [ ] `/login` - ログインページが正常に表示、ヘッダー・フッターなし
- [ ] `/signup` - 新規登録ページが正常に表示、ヘッダー・フッターなし
- [ ] `/supporters` - サポーターページが正常に表示、独自レイアウト
- [ ] `/admin/dashboard` - 管理画面が正常に表示、サイドバーあり

---

## フェーズ3: クリーンアップ

全ページの移行が完了し、動作確認が取れたら、不要なコードを削除します。

### ステップ3-1: ルートレイアウトの簡略化

**ファイル**: `app/[locale]/layout.tsx`

**変更前**:
```tsx
const headersList = await headers();
const pathname = headersList.get("x-pathname") || "";
const isAdminPage = pathname.includes("/admin");
const isSupportersPage = pathname.includes("/supporters");

return (
  <html lang={locale}>
    <body>
      <NextIntlClientProvider messages={messages}>
        <NuqsAdapter>
          {!isAdminPage && !isSupportersPage && <Header />}
          {children}
          {!isAdminPage && !isSupportersPage && <Footer />}
          <Toaster />
        </NuqsAdapter>
      </NextIntlClientProvider>
    </body>
  </html>
);
```

**変更後**:
```tsx
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = await setLocale(params);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${senobiGothic.variable} ${academy.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <NuqsAdapter>
            {children}
            <Toaster />
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**削除する行**:
- `import { Header } from "@/components/header/header";` (5行目)
- `import { Footer } from "@/components/footer/footer";` (13行目)
- `import { headers } from "next/headers";` (14行目)
- 87-90行目の条件分岐ロジック
- 99, 101行目のHeader/Footer条件付きレンダリング

### ステップ3-2: middlewareのクリーンアップ（オプション）

`x-pathname`ヘッダーが他で使用されていないか確認:

```bash
# x-pathnameの使用箇所を検索
grep -r "x-pathname" .
```

他で使用されていなければ、`middleware.ts`から削除:

**ファイル**: `middleware.ts`

**変更前**:
```tsx
// 国際化ミドルウェアを実行し、pathnameをヘッダーに追加
const response = intlMiddleware(request);
response.headers.set("x-pathname", pathnameWithoutLocale);

return response;
```

**変更後**:
```tsx
// 国際化ミドルウェアを実行
return intlMiddleware(request);
```

### ステップ3-3: 最終動作確認

```bash
# クリーンビルド
rm -rf .next
npm run build

# 本番モードで起動
npm run start
```

全ページにアクセスして、正常に動作することを確認。

---

## テスト戦略

### 自動テスト

#### ビルドテスト
```bash
# 開発ビルド
npm run dev

# 本番ビルド
npm run build

# 型チェック
npx tsc --noEmit
```

#### Lintテスト
```bash
npm run lint
```

### 手動テスト

#### テストマトリックス

| ページ | URL | ヘッダー | フッター | 特記事項 |
|-------|-----|---------|---------|---------|
| トップ | `/` | ✅ | ✅ | ヒーロー画像表示確認 |
| お知らせ | `/information` | ✅ | ✅ | - |
| ペット一覧 | `/pets` | ✅ | ✅ | - |
| ペット詳細 | `/pets/1` | ✅ | ✅ | 動的ルート確認 |
| マイページ | `/mypage` | ✅ | ✅ | 認証チェック |
| 新規登録完了 | `/new` | ✅ | ✅ | - |
| ログイン | `/login` | ❌ | ❌ | 認証フォーム |
| 新規登録 | `/signup` | ❌ | ❌ | 認証フォーム |
| サポーター | `/supporters` | ❌ | ❌ | 独自レイアウト |
| 管理画面ログイン | `/admin/login` | ❌ | ❌ | - |
| 管理ダッシュボード | `/admin/dashboard` | ❌ | ❌ | サイドバー表示 |

#### ブラウザテスト

最低限、以下のブラウザで確認:
- Chrome (最新版)
- Safari (最新版)
- Firefox (最新版)

#### モバイルテスト

レスポンシブデザインの確認:
- iPhone (Safari)
- Android (Chrome)

### 多言語テスト

- `/ja/*` - 日本語表示確認
- `/en/*` - 英語表示確認

---

## ロールバック手順

### シナリオA: 特定ページのみロールバック

例: `/login`ページに問題が発生した場合

```bash
# 1. 新しいファイルを削除
rm -rf app/\[locale\]/\(auth\)/login

# 2. gitから元のファイルを復元
git checkout app/\[locale\]/login/page.tsx

# 3. 動作確認
npm run dev
```

### シナリオB: フェーズ2全体をロールバック

全ページの移行に問題がある場合:

```bash
# 1. 新しいルートグループを全て削除
rm -rf app/\[locale\]/\(main\)
rm -rf app/\[locale\]/\(auth\)
rm -rf app/\[locale\]/\(marketing\)

# 2. gitから全ファイルを復元
git checkout app/\[locale\]/

# 3. クリーンビルド
rm -rf .next
npm run build
```

### シナリオC: フェーズ3（クリーンアップ）のロールバック

ルートレイアウトの変更に問題がある場合:

```bash
# layout.tsxとmiddleware.tsを復元
git checkout app/\[locale\]/layout.tsx
git checkout middleware.ts

# ビルド確認
npm run build
```

### 完全ロールバック

```bash
# すべての変更を破棄
git reset --hard HEAD

# または特定のコミットに戻る
git reset --hard <commit-hash>
```

---

## トラブルシューティング

### 問題1: ページが404エラーになる

**症状**: 移行後のページにアクセスすると404エラー

**原因**:
- ファイルが正しい場所に配置されていない
- ディレクトリ名のタイプミス（特にルートグループの括弧）

**解決策**:
```bash
# ファイル構造を確認
ls -R app/\[locale\]/

# 正しい場所: app/[locale]/(main)/page.tsx
# 間違った場所: app/[locale]/main/page.tsx
```

### 問題2: ヘッダー・フッターが表示されない（表示されるべきページで）

**症状**: `(main)`グループのページでヘッダー・フッターが表示されない

**原因**:
- レイアウトファイルが正しく作成されていない
- レイアウトファイル内でコンポーネントがインポートされていない

**解決策**:
```tsx
// app/[locale]/(main)/layout.tsx を確認
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
```

### 問題3: 画像が表示されない

**症状**: 移行後に画像ファイルが読み込めない

**原因**:
- 画像ファイルの相対パスが変わった
- 画像ファイルが移動されていない

**解決策**:
```bash
# 画像ファイルも一緒に移動
cp app/\[locale\]/hero-bg.jpg app/\[locale\]/\(main\)/hero-bg.jpg

# または、import文を確認
# 相対パスから絶対パス（/public配下）に変更を検討
```

### 問題4: TypeScriptエラー

**症状**: `Property 'children' does not exist on type`

**原因**:
- レイアウトコンポーネントの型定義が不正

**解決策**:
```tsx
// 正しい型定義
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

### 問題5: ビルドエラー

**症状**: `npm run build`でエラー

**原因**:
- 古いファイルと新しいファイルが共存している
- インポートパスが壊れている

**解決策**:
```bash
# キャッシュをクリア
rm -rf .next
rm -rf node_modules/.cache

# 再ビルド
npm run build
```

### 問題6: 認証チェックが機能しない

**症状**: ログインが必要なページにアクセスできてしまう

**原因**:
- middleware.tsのルートパス判定が壊れている

**解決策**:
```tsx
// middleware.tsでパスを確認
const pathnameWithoutLocale = pathname.replace(/^\/(ja|en)/, "") || "/";
console.log("Pathname:", pathnameWithoutLocale); // デバッグ用

// publicRoutesに適切なパスが設定されているか確認
const publicRoutes = ["/login", "/signup", "/", "/information"];
```

### 問題7: スタイルが崩れる

**症状**: レイアウト移行後にCSSが適用されない

**原因**:
- グローバルCSSのインポートが重複または欠落
- レイアウトの入れ子構造が変わった

**解決策**:
```tsx
// ルートレイアウトでのみglobals.cssをインポート
// app/[locale]/layout.tsx
import "../globals.css"; // ✅

// 他のレイアウトではインポートしない
// app/[locale]/(main)/layout.tsx
// import "../globals.css"; // ❌ 不要
```

---

## チェックリスト

### フェーズ1完了時

- [ ] ルートグループディレクトリが作成されている
- [ ] 各レイアウトファイルが作成されている
- [ ] ビルドエラーが出ない
- [ ] 既存のページが全て正常に表示される

### フェーズ2完了時

- [ ] 全ページが新しい構造に移行されている
- [ ] 元のファイルが削除されている
- [ ] 全ページで動作確認が完了している
- [ ] ヘッダー・フッターの表示が意図通り
- [ ] 認証フローが正常に動作
- [ ] 動的ルーティングが正常に機能

### フェーズ3完了時

- [ ] ルートレイアウトが簡略化されている
- [ ] 不要なインポートが削除されている
- [ ] middlewareがクリーンアップされている
- [ ] ビルドが成功する
- [ ] 全ページで最終動作確認完了

### 本番デプロイ前

- [ ] ステージング環境でテスト完了
- [ ] 全ブラウザでテスト完了
- [ ] モバイルでテスト完了
- [ ] 多言語でテスト完了
- [ ] パフォーマンステスト完了
- [ ] ロールバック手順の確認完了

---

## 参考資料

- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Layouts and Templates](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates)
- [Next.js Project Organization](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [レイアウトの原理原則](./layout-principles.md)

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|-----|----------|---------|
| 2025-10-29 | 1.0.0 | 初版作成 |
