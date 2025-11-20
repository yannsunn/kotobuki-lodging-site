# 🔧 管理者向け - オーナーセットアップガイド

新しいオーナーを登録し、宿泊所と紐付ける手順です。

---

## 📋 事前準備

### 必要な情報

各オーナーから以下を聞いておく:
- お名前
- メールアドレス（携帯メールでもOK）
- 電話番号
- 管理する宿泊所名

---

## 🚀 オーナー登録手順

### Step 1: アカウント作成（2つの方法）

#### 方法A: オーナー自身に作成してもらう（推奨）

1. オーナーに以下のURLを共有:
   ```
   http://localhost:3000/signup
   ```

2. オーナーに入力してもらう:
   - お名前: 例）山田太郎
   - メールアドレス: 例）yamada@example.com
   - 電話番号: 例）045-123-4567
   - パスワード: 6文字以上

3. 「アカウント作成」をクリック

4. **完了！**（ただし、まだ宿泊所は紐付いていません）

---

#### 方法B: 管理者が代理で作成する

1. http://localhost:3000/signup にアクセス

2. オーナーの情報を入力

3. パスワードは管理者が決めて、後でオーナーに伝える

4. 「アカウント作成」をクリック

---

### Step 2: ユーザーIDの確認

1. **Supabaseダッシュボード**にアクセス:
   ```
   https://supabase.com/dashboard/project/nhzdzimmfmendzfbaqlb/auth/users
   ```

2. **Authentication** > **Users** を開く

3. 作成したオーナーのメールアドレスを探す

4. **User UID**（例: `a1b2c3d4-...`）をコピー

---

### Step 3: 宿泊所IDの確認

1. **Supabaseダッシュボード**で **Table Editor** を開く:
   ```
   https://supabase.com/dashboard/project/nhzdzimmfmendzfbaqlb/editor/28498
   ```

2. **lodgings** テーブルを開く

3. オーナーが管理する宿泊所を探す

4. その宿泊所の **id**（UUID）をコピー

---

### Step 4: オーナーと宿泊所を紐付け

#### 方法A: SQL Editor で実行（簡単）

1. **SQL Editor** を開く:
   ```
   https://supabase.com/dashboard/project/nhzdzimmfmendzfbaqlb/sql/new
   ```

2. 以下のSQLを貼り付け（**値を置き換える**）:

```sql
-- オーナーと宿泊所を紐付け
INSERT INTO owner_lodgings (owner_id, lodging_id)
VALUES (
  'ここにユーザーUID',
  'ここに宿泊所ID'
);
```

**例**:
```sql
INSERT INTO owner_lodgings (owner_id, lodging_id)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b2c3d4e5-f6g7-8901-bcde-fg2345678901'
);
```

3. **「Run」ボタン**をクリック

4. `Success. No rows returned` と表示されればOK！

---

#### 方法B: メールアドレスと宿泊所名で紐付け（さらに簡単）

以下のSQLをコピペして、**メールアドレス**と**宿泊所名**だけ書き換える:

```sql
-- メールアドレスと宿泊所名で自動紐付け
INSERT INTO owner_lodgings (owner_id, lodging_id)
SELECT
  (SELECT id FROM auth.users WHERE email = 'オーナーのメールアドレス'),
  id
FROM lodgings
WHERE name = '宿泊所名';
```

**例**:
```sql
INSERT INTO owner_lodgings (owner_id, lodging_id)
SELECT
  (SELECT id FROM auth.users WHERE email = 'yamada@example.com'),
  id
FROM lodgings
WHERE name = 'ホテル寿荘';
```

---

### Step 5: 動作確認

1. オーナーに以下のURLでログインしてもらう:
   ```
   http://localhost:3000/login
   ```

2. 登録したメールアドレスとパスワードでログイン

3. **大きなボタンの管理画面**が表示される

4. **自分の宿泊所名**が表示されていればOK！

5. 「+ 1室」ボタンを押してテスト

6. 数字が変われば**完了！**

---

## 👥 複数の宿泊所を管理するオーナーの場合

1オーナーが複数の宿泊所を管理する場合:

```sql
-- 複数の宿泊所を紐付け（1つずつ実行）
INSERT INTO owner_lodgings (owner_id, lodging_id)
SELECT
  (SELECT id FROM auth.users WHERE email = 'yamada@example.com'),
  id
FROM lodgings
WHERE name = 'ホテル寿荘';

INSERT INTO owner_lodgings (owner_id, lodging_id)
SELECT
  (SELECT id FROM auth.users WHERE email = 'yamada@example.com'),
  id
FROM lodgings
WHERE name = 'グリーンハウス寿';

-- 必要な分だけ繰り返す
```

ログイン後、すべての宿泊所が表示されます。

---

## 🔐 管理者アカウントの作成

管理者（あなた）用のアカウントを作成する場合:

### Step 1: 通常通りアカウント作成

http://localhost:3000/signup で作成

### Step 2: roleを'admin'に変更

Supabaseの **profiles** テーブルで:

```sql
-- 管理者権限を付与
UPDATE profiles
SET role = 'admin'
WHERE email = 'あなたのメールアドレス';
```

これで、管理者専用の詳細ダッシュボードにアクセスできます。

---

## 📊 オーナー管理一覧（サンプル）

| オーナー名 | メールアドレス | 管理施設 | 登録日 |
|----------|--------------|---------|-------|
| 山田太郎 | yamada@example.com | ホテル寿荘 | 2025/11/20 |
| 鈴木花子 | suzuki@example.com | グリーンハウス寿 | 2025/11/20 |
| 佐藤一郎 | sato@example.com | 第一寿ハウス | 2025/11/20 |

---

## 🆘 トラブルシューティング

### Q1. オーナーがログインできない
**A1.** 以下を確認:
1. メールアドレスが正しいか
2. パスワードが正しいか（6文字以上）
3. Supabaseの **Authentication > Users** でユーザーが作成されているか

### Q2. ログインできるが、施設が表示されない
**A2.** 以下を確認:
1. **owner_lodgings** テーブルで紐付けがされているか
2. **lodgings** テーブルで宿泊所が存在するか
3. **is_published** が `true` になっているか

確認SQL:
```sql
-- オーナーの紐付けを確認
SELECT
  p.email,
  l.name AS lodging_name
FROM owner_lodgings ol
JOIN profiles p ON p.id = ol.owner_id
JOIN lodgings l ON l.id = ol.lodging_id
WHERE p.email = 'オーナーのメールアドレス';
```

### Q3. ボタンを押しても更新されない
**A3.** 以下を確認:
1. ブラウザの開発者ツールでエラーを確認
2. Supabaseの **RLSポリシー**が正しく設定されているか
3. インターネット接続を確認

---

## ✅ 新規オーナー登録チェックリスト

オーナー追加時に確認:

- [ ] オーナーの情報を聞いた（名前、メール、電話）
- [ ] 管理する宿泊所を確認した
- [ ] アカウントを作成した
- [ ] User UIDを確認した
- [ ] 宿泊所IDを確認した
- [ ] owner_lodgingsで紐付けた
- [ ] オーナーにログイン情報を伝えた
- [ ] オーナーと一緒にログインテストをした
- [ ] 「+ 1室」「- 1室」ボタンの動作を確認した
- [ ] OWNER_SETUP_GUIDE.mdを渡した

---

## 📞 困ったときは

このガイドで解決しない場合は、以下を確認:
1. Supabaseのログを確認
2. ブラウザの開発者ツール（F12）でエラーを確認
3. プロジェクトのREADME.mdを参照

---

**このガイドは管理者専用です。オーナーには `OWNER_SETUP_GUIDE.md` を渡してください。**
