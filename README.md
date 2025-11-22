# 寿地区簡易宿泊所情報サイト

横浜市中区寿町の簡易宿泊所の空室情報、周辺サービス、支援活動を紹介するWebサイトです。

## 技術スタック

- **Next.js 16.0.1** (App Router)
- **React 19.2.0**
- **TypeScript 5.9.3**
- **Tailwind CSS 4.1.16**
- **Supabase** (データベース・認証)

## 本番環境

https://kotobuki-lodging-site.vercel.app

## 環境変数

`.env.local` に以下を設定：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 開発

```bash
npm install
npm run dev
```

## デプロイ

Vercelに自動デプロイされます。
