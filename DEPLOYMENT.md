# デプロイメントガイド

## 重要: 日本語フォルダ名の制限

**Next.js 16 (Turbopack) の既知の問題**:

現在、このプロジェクトは日本語を含むパス（`森山さん`）に配置されています。Next.js 16のTurbopackは日本語（マルチバイト文字）を含むパスでビルドエラーが発生する既知の問題があります。

### 本番デプロイ時の対応方法

#### 方法1: プロジェクトを英数字のパスに移動（推奨）

```bash
# プロジェクトを英数字のパスにコピー
cp -r "c:\Users\march\Projects\websites\森山さん\kotobuki-lodging-site" "c:\Users\march\Projects\kotobuki-lodging-site"

# 移動先でビルド
cd "c:\Users\march\Projects\kotobuki-lodging-site"
npm run build
```

#### 方法2: Vercel等のクラウドプラットフォームでデプロイ（推奨）

Vercel、Netlify、AWS Amplifyなどのクラウドプラットフォームは、日本語パスの問題を回避できます。

**Vercelでのデプロイ手順**:

```bash
# Vercel CLIをインストール
npm install -g vercel

# プロジェクトルートでデプロイ
cd "c:\Users\march\Projects\websites\森山さん\kotobuki-lodging-site"
vercel
```

Vercelは自動的に以下を行います:
1. プロジェクトをVercelのサーバーにアップロード
2. 英数字のパスでビルド
3. CDNでホスティング

#### 方法3: Webpack モードでビルド

Next.js 16はTurbopackの他にWebpackもサポートしています。

**package.json を編集**:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build --no-turbopack",
    "start": "next start",
    "lint": "next lint"
  }
}
```

その後、通常通りビルド:

```bash
npm run build
```

ただし、Webpackモードはビルドが遅くなります。

## 開発環境での動作

開発環境（`npm run dev`）は問題なく動作します:

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## 推奨デプロイフロー

### 1. Vercelデプロイ（最も簡単）

```bash
# 初回のみ
npm install -g vercel

# デプロイ
vercel

# 本番デプロイ
vercel --prod
```

### 2. 自社サーバーデプロイ

```bash
# Step 1: プロジェクトを英数字パスにコピー
mkdir -p /var/www/kotobuki
cp -r ./* /var/www/kotobuki/

# Step 2: 依存関係をインストール
cd /var/www/kotobuki
npm ci --production

# Step 3: ビルド
npm run build

# Step 4: PM2で起動
npm install -g pm2
pm2 start npm --name "kotobuki-site" -- start
pm2 save
pm2 startup
```

### 3. Docker デプロイ

Dockerfileを作成:

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

ビルドと起動:

```bash
docker build -t kotobuki-site .
docker run -p 3000:3000 kotobuki-site
```

## 環境変数の設定

### 必須環境変数

本番環境では以下の環境変数を設定してください:

**.env.production**:

```env
# Google Maps API キー（マップ機能を有効化する場合）
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# お問い合わせフォーム送信先（実装後）
CONTACT_FORM_EMAIL=info@kotobuki-info.example.com

# データベース接続（将来の拡張）
DATABASE_URL=postgresql://user:pass@localhost:5432/kotobuki
```

## デプロイ後の確認事項

### 1. 基本動作確認

- [ ] トップページが表示される
- [ ] 全ナビゲーションリンクが動作する
- [ ] 空室一覧ページが表示される
- [ ] 宿泊所詳細ページが表示される
- [ ] 周辺マップページが表示される
- [ ] 活動紹介ページが表示される
- [ ] お問い合わせページが表示される

### 2. レスポンシブデザイン確認

- [ ] モバイル（390px）で正常表示
- [ ] タブレット（768px）で正常表示
- [ ] PC（1920px）で正常表示

### 3. パフォーマンス確認

Lighthouse スコアを確認:

```bash
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

目標スコア:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## トラブルシューティング

### ビルドエラーが発生する

**エラー**: `byte index XX is not a char boundary`

**原因**: プロジェクトパスに日本語が含まれている

**解決策**: プロジェクトを英数字のパスにコピーしてビルド

### CSSが適用されない

**原因**: Tailwind CSSの設定が正しくない

**解決策**:
1. `@tailwindcss/postcss` がインストールされているか確認
2. `postcss.config.mjs` の設定を確認

### フォームが送信できない

**原因**: お問い合わせフォームはダミー実装

**解決策**: バックエンドAPIまたはメール送信サービスと連携する

## Next.js 16 からのダウングレード

もし互換性の問題が解決しない場合は、Next.js 15にダウングレードすることも可能です:

```bash
npm install next@15 react@18 react-dom@18
npm install -D @types/react@18 @types/react-dom@18
```

ただし、Next.js 16の新機能が使えなくなります。

## 参考リンク

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Turbopack Known Issues](https://github.com/vercel/next.js/issues)

---

**最終更新**: 2025-11-06
