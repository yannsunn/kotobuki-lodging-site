# 寿地区簡易宿泊所情報サイト

横浜市中区寿町の簡易宿泊所の空室情報と周辺サービスを提供するWebサイトのプロトタイプです。

## プロジェクト概要

**目的**: 寿地区の簡易宿泊所情報を一元化し、支援が必要な方々に適切な情報を届ける

**技術スタック**:
- Next.js 16.0.1 (App Router)
- React 19.2.0
- TypeScript 5.9.3
- Tailwind CSS 4.1.16

**プラン**: 標準プラン（～50万円相当）

## 機能一覧

### 実装済み機能

1. **トップページ** (`/`)
   - ヒーローセクション
   - 最新空室情報ハイライト（3件）
   - 寿地区紹介
   - 周辺サービス概要
   - CTAセクション

2. **空室一覧ページ** (`/vacancies`)
   - 全宿泊所の一覧表示（8件）
   - フィルター機能（空室ありのみ表示）
   - ソート機能（空室数順・価格順）
   - 統計情報表示

3. **宿泊所詳細ページ** (`/lodging/[id]`)
   - 基本情報（住所、電話番号、料金等）
   - 設備・サービス一覧
   - 地図表示（Google Maps連携可能）
   - お問い合わせ情報

4. **周辺マップページ** (`/map`)
   - 宿泊所・サービス施設のマップ表示
   - カテゴリ別凡例
   - 施設一覧
   - Google Maps連携

5. **活動紹介ページ** (`/activities`)
   - 支援活動の紹介
   - 主な支援団体の情報
   - 支援を受ける手順

6. **お問い合わせページ** (`/contact`)
   - お問い合わせフォーム
   - 連絡先情報
   - アクセス情報

### 共通機能

- レスポンシブデザイン（モバイル・タブレット・PC対応）
- ナビゲーションヘッダー（ハンバーガーメニュー対応）
- フッター
- 日本語フォント最適化

## セットアップ手順

### 1. 依存パッケージのインストール

```bash
cd kotobuki-lodging-site
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

### 3. ビルド（本番環境用）

```bash
npm run build
npm start
```

## プロジェクト構造

```
kotobuki-lodging-site/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # ルートレイアウト
│   ├── page.tsx              # トップページ
│   ├── globals.css           # グローバルスタイル
│   ├── vacancies/            # 空室一覧
│   │   └── page.tsx
│   ├── lodging/              # 宿泊所詳細
│   │   └── [id]/
│   │       └── page.tsx
│   ├── map/                  # 周辺マップ
│   │   └── page.tsx
│   ├── activities/           # 活動紹介
│   │   └── page.tsx
│   └── contact/              # お問い合わせ
│       └── page.tsx
├── components/               # 共通コンポーネント
│   ├── Header.tsx            # ヘッダーナビゲーション
│   ├── Footer.tsx            # フッター
│   └── VacancyCard.tsx       # 宿泊所カード
├── lib/                      # ユーティリティ・データ
│   └── data.ts               # ダミーデータ
├── public/                   # 静的ファイル
│   └── images/               # 画像
├── package.json              # プロジェクト設定
├── tsconfig.json             # TypeScript設定
├── tailwind.config.ts        # Tailwind CSS設定
└── README.md                 # このファイル
```

## ダミーデータ

### 宿泊所データ (`lib/data.ts`)

8件の簡易宿泊所データを用意:
- ホテル寿荘
- グリーンハウス寿
- 第一寿ハウス
- さくら荘
- コミュニティハウス寿
- ニュー寿ホテル
- サンライズ寿
- 寿ビジネスホテル

各データには以下の情報を含む:
- 名称、住所、電話番号
- 収容人数、空室数
- 1泊料金
- 設備・サービス
- 座標（緯度・経度）

### 周辺サービスデータ

8件の周辺サービス施設データ:
- 福祉施設（寿生活館、寿地区センター等）
- 医療機関（寿診療所、コトブキ調剤薬局）
- 就労支援（よこはま夢ファンド）
- その他施設

## カスタマイズ方法

### 1. データの更新

`lib/data.ts` を編集して、実際の宿泊所・サービス情報に置き換えてください。

```typescript
export const lodgings: Lodging[] = [
  {
    id: '1',
    name: '実際の施設名',
    address: '実際の住所',
    // ... その他の情報
  },
]
```

### 2. Google Maps API の設定

Google Maps JavaScript API を有効化し、APIキーを取得してください。

**`.env.local` ファイルを作成**:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Google Maps コンポーネントの実装** (将来の拡張):

```bash
npm install @googlemaps/js-api-loader
```

### 3. お問い合わせフォームの実装

現在はアラート表示のみです。以下のいずれかの方法で実装できます:

- **方法1**: SendGrid、Resend等のメールAPIを使用
- **方法2**: バックエンドAPI（Node.js/Express、Firebase Functions等）と連携
- **方法3**: Vercel Contact Form、Formspree等のサービスを利用

### 4. デザインのカスタマイズ

`tailwind.config.ts` でカラーテーマを変更:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // カラーコードを変更
      },
    },
  },
}
```

## デプロイ

### Vercel（推奨）

```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
vercel
```

### その他のプラットフォーム

- **Netlify**: `npm run build` の出力を `.next` フォルダとしてデプロイ
- **AWS Amplify**: Next.js のサポートを有効化してデプロイ
- **自社サーバー**: `npm run build && npm start` で起動

## 今後の拡張ポイント

### 標準プラン（現在）の次のステップ

1. **データベース連携**
   - PostgreSQL、MySQL、または Firebase Firestore
   - 管理画面からの空室情報更新機能

2. **リアルタイム空室更新**
   - WebSocket または Server-Sent Events
   - 宿泊所からの直接更新

3. **予約機能**
   - オンライン予約システム
   - カレンダー表示

4. **多言語対応**
   - 英語、中国語、韓国語等
   - next-i18next などの国際化ライブラリ

5. **アクセシビリティ向上**
   - スクリーンリーダー対応
   - キーボードナビゲーション
   - WCAG 2.1 AA準拠

6. **SEO最適化**
   - メタタグ最適化
   - sitemap.xml 生成
   - 構造化データ（JSON-LD）

7. **管理画面（CMS）**
   - 宿泊所情報の編集
   - サービス情報の管理
   - お問い合わせ管理

## パフォーマンス

- **Lighthouse スコア目標**:
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 95+
  - SEO: 100

- **最適化手法**:
  - 画像最適化（Next.js Image コンポーネント）
  - コード分割（Dynamic Import）
  - フォント最適化（next/font）
  - CSS最適化（Tailwind CSS purge）

## ブラウザサポート

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）
- iOS Safari（iOS 14+）
- Android Chrome（Android 10+）

## ライセンス

このプロジェクトは、寿地区の支援活動のために作成されています。

## お問い合わせ

プロジェクトに関するご質問は、以下までお願いします:
- 寿地区センター
- TEL: 045-222-3333
- 受付時間: 月〜金 9:00-17:00

---

**開発者向けメモ**:
- 本プロジェクトはプロトタイプです
- ダミーデータを使用しています
- 本番環境では実際のデータに置き換えてください
- Google Maps API キーは `.env.local` で管理してください（`.gitignore` に追加済み）
