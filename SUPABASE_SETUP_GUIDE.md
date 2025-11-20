# 🔧 Supabase 環境変数設定ガイド

## 📍 Step 1: Supabaseダッシュボードで値を取得

以下のURLにアクセス：
https://supabase.com/dashboard/project/nhzdzimmfmendzfbaqlb/settings/api

### 取得する値（3つ）

#### 1. Project URL
```
Configuration > URL
例: https://nhzdzimmfmendzfbaqlb.supabase.co
```

#### 2. anon public key
```
Project API keys > anon public
長い文字列（eyJhbG... で始まる）
右側の「Copy」ボタンをクリック
```

#### 3. service_role secret key
```
Project API keys > service_role secret
長い文字列（eyJhbG... で始まる）
右側の「Reveal」→「Copy」ボタンをクリック
```

---

## 📝 Step 2: .env.local に貼り付け

`.env.local` ファイルを開いて、以下の値を置き換えてください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
↓ 置き換え
NEXT_PUBLIC_SUPABASE_URL=https://nhzdzimmfmendzfbaqlb.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
↓ 置き換え
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG... (コピーした値)

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
↓ 置き換え
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (コピーした値)
```

### 実際の作業
1. Supabaseで「Copy」ボタンをクリック
2. `.env.local` の該当箇所に貼り付け（Ctrl+V）
3. 3つすべて同様に実施

---

## 🚀 Step 3: Vercel環境変数設定（デプロイ後）

### 方法A: Vercel Dashboard（推奨・簡単）

1. https://vercel.com/dashboard にアクセス
2. プロジェクトを選択
3. Settings > Environment Variables
4. 以下を追加：

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [Supabaseからコピーした値を貼り付け]
Environment: Production, Preview, Development (全て選択)
→ Save

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Supabaseからコピーした値を貼り付け]
Environment: Production, Preview, Development (全て選択)
→ Save

Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Supabaseからコピーした値を貼り付け]
Environment: Production, Preview, Development (全て選択)
→ Save
```

### 方法B: Vercel CLI（ターミナル使用）

プロジェクトディレクトリで以下を実行：

```bash
# 1つ目
vercel env add NEXT_PUBLIC_SUPABASE_URL
# → プロンプトが表示されたら値を貼り付け
# → Environment: Production, Preview, Development を選択

# 2つ目
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# → 同様に値を貼り付け

# 3つ目
vercel env add SUPABASE_SERVICE_ROLE_KEY
# → 同様に値を貼り付け
```

---

## ✅ 設定確認

### ローカル開発
```bash
npm run dev
```
エラーが出なければ成功！

### Vercel（デプロイ後）
再デプロイすると環境変数が反映されます：
```bash
vercel --prod
```

---

## 🔐 セキュリティ注意事項

- `.env.local` は **絶対にGitにコミットしない**（`.gitignore`に含まれています）
- `service_role` キーは **絶対に公開しない**
- クライアントサイドで使用するのは `NEXT_PUBLIC_*` のみ

---

## 📞 トラブルシューティング

### エラー: "Invalid API key"
→ `.env.local` の値が正しいか確認（余分なスペースがないか）

### エラー: "fetch failed"
→ `NEXT_PUBLIC_SUPABASE_URL` の末尾に `/` がないか確認

### 変更が反映されない
→ 開発サーバーを再起動（Ctrl+C → `npm run dev`）

---

**設定完了後、このファイルは削除しても問題ありません。**
