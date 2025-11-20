# 寿地区簡易宿泊所サイト - ユーザーガイド

## 目次

1. [Google Maps API の設定方法](#1-google-maps-api-の設定方法)
2. [PowerPoint スライドの使い方](#2-powerpoint-スライドの使い方)
3. [ダミーデータの置き換え方法](#3-ダミーデータの置き換え方法)
4. [サイトのカスタマイズ](#4-サイトのカスタマイズ)
5. [デプロイと更新](#5-デプロイと更新)
6. [トラブルシューティング](#6-トラブルシューティング)
7. [パフォーマンス最適化](#7-パフォーマンス最適化)

---

## 1. Google Maps API の設定方法

### 1.1 Google Cloud Console でのAPI有効化

Google Maps JavaScript APIを使用することで、サイトにインタラクティブな地図を表示できます。

#### Step 1: Google Cloud Console にアクセス

1. ブラウザで [Google Cloud Console](https://console.cloud.google.com/) を開きます
2. Googleアカウントでログインします（持っていない場合は作成してください）

#### Step 2: プロジェクトの作成

1. 画面上部の「プロジェクトを選択」をクリック
2. 「新しいプロジェクト」を選択
3. プロジェクト名を入力（例: `kotobuki-lodging-site`）
4. 「作成」ボタンをクリック

#### Step 3: Maps JavaScript API の有効化

1. 左側のメニューから「APIとサービス」→「ライブラリ」を選択
2. 検索ボックスに「Maps JavaScript API」と入力
3. 「Maps JavaScript API」をクリック
4. 「有効にする」ボタンをクリック

**追加で有効化するAPI**（オプション）:
- **Geocoding API**: 住所から座標への変換が必要な場合
- **Places API**: 施設の詳細情報を取得する場合

#### Step 4: APIキーの取得

1. 左側のメニューから「APIとサービス」→「認証情報」を選択
2. 画面上部の「+ 認証情報を作成」をクリック
3. 「APIキー」を選択
4. APIキーが生成されます（例: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
5. **重要**: すぐに「キーを制限」ボタンをクリックしてセキュリティを設定してください

#### Step 5: APIキーの制限設定（セキュリティ）

**アプリケーションの制限**:
1. 「HTTPリファラー（ウェブサイト）」を選択
2. 「ウェブサイトの制限」セクションで「項目を追加」をクリック
3. 以下を追加:
   - `localhost:3000/*` （開発環境用）
   - `your-domain.com/*` （本番環境用）
   - `*.vercel.app/*` （Vercelを使う場合）

**API の制限**:
1. 「キーを制限」セクションで「API を制限」を選択
2. 以下のAPIを選択:
   - Maps JavaScript API
   - Geocoding API（使用する場合）
   - Places API（使用する場合）
3. 「保存」をクリック

### 1.2 プロジェクトへのAPIキー設定

#### Step 1: `.env.local` ファイルの作成

プロジェクトのルートディレクトリ（`kotobuki-lodging-site/`）に `.env.local` ファイルを作成します。

**Windowsの場合**:
```bash
# コマンドプロンプトまたはPowerShellで
cd c:\Users\march\Projects\websites\森山さん\kotobuki-lodging-site
echo NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here > .env.local
```

**macOS/Linuxの場合**:
```bash
cd kotobuki-lodging-site
touch .env.local
```

#### Step 2: APIキーを設定

`.env.local` ファイルをテキストエディタで開き、以下のように記述します:

```env
# Google Maps API キー
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**重要な注意点**:
- `NEXT_PUBLIC_` という接頭辞は必須です（Next.jsの規約）
- `=` の前後にスペースを入れないでください
- APIキーをGitにコミットしないでください（`.gitignore` に既に追加済み）

#### Step 3: 環境変数の確認

開発サーバーを再起動して環境変数を読み込みます:

```bash
# 開発サーバーを停止（Ctrl+C）
# 再起動
npm run dev
```

ブラウザのコンソール（F12）で環境変数が読み込まれているか確認:

```javascript
console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
// APIキーが表示されればOK
```

### 1.3 地図コンポーネントの実装

#### Step 1: Google Maps ライブラリのインストール

```bash
npm install @googlemaps/js-api-loader
```

#### Step 2: Mapコンポーネントの作成

`components/Map.tsx` を作成します:

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface MapProps {
  center: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{
    position: { lat: number; lng: number }
    title: string
    icon?: string
  }>
}

export default function Map({ center, zoom = 15, markers = [] }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      })

      const { Map } = await loader.importLibrary('maps')
      const { AdvancedMarkerElement } = await loader.importLibrary('marker')

      if (!mapRef.current) return

      // 地図を作成
      const map = new Map(mapRef.current, {
        center,
        zoom,
        mapId: 'KOTOBUKI_MAP', // カスタムマップID
      })

      // マーカーを追加
      markers.forEach((marker) => {
        new AdvancedMarkerElement({
          map,
          position: marker.position,
          title: marker.title,
        })
      })
    }

    initMap()
  }, [center, zoom, markers])

  return <div ref={mapRef} className="w-full h-full min-h-[400px]" />
}
```

#### Step 3: マップページでの使用

`app/map/page.tsx` を更新します:

```typescript
'use client'

import Map from '@/components/Map'
import { lodgings, services } from '@/lib/data'

export default function MapPage() {
  const centerLat = 35.4445
  const centerLng = 139.6388

  // マーカーデータの準備
  const markers = [
    // 宿泊所のマーカー
    ...lodgings.map((lodging) => ({
      position: { lat: lodging.latitude, lng: lodging.longitude },
      title: lodging.name,
      icon: 'blue', // カスタムアイコンを指定可能
    })),
    // サービス施設のマーカー
    ...services.map((service) => ({
      position: { lat: service.latitude, lng: service.longitude },
      title: service.name,
      icon: 'green',
    })),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">周辺マップ</h1>
          <p className="text-xl text-primary-100">
            寿地区の宿泊施設と周辺サービスをマップで確認
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Map
            center={{ lat: centerLat, lng: centerLng }}
            zoom={15}
            markers={markers}
          />
        </div>
      </div>
    </div>
  )
}
```

### 1.4 カスタムマーカーの実装

#### カテゴリ別のマーカー色分け

```typescript
const getMarkerColor = (category: string) => {
  const colors = {
    lodging: '#3B82F6',    // 青（宿泊所）
    welfare: '#10B981',    // 緑（福祉）
    medical: '#EF4444',    // 赤（医療）
    employment: '#F59E0B', // 黄（就労）
    other: '#8B5CF6',      // 紫（その他）
  }
  return colors[category as keyof typeof colors] || '#6B7280'
}

// マーカーにHTMLコンテンツを追加
const markerContent = document.createElement('div')
markerContent.className = 'custom-marker'
markerContent.style.backgroundColor = getMarkerColor('lodging')
markerContent.style.width = '30px'
markerContent.style.height = '30px'
markerContent.style.borderRadius = '50%'
markerContent.style.border = '3px solid white'
markerContent.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'

new AdvancedMarkerElement({
  map,
  position: marker.position,
  title: marker.title,
  content: markerContent,
})
```

#### マーカークリック時のポップアップ

```typescript
import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export default function Map({ center, zoom = 15, markers = [] }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      })

      const { Map } = await loader.importLibrary('maps')
      const { AdvancedMarkerElement } = await loader.importLibrary('marker')
      const { InfoWindow } = await loader.importLibrary('maps')

      if (!mapRef.current) return

      const map = new Map(mapRef.current, {
        center,
        zoom,
        mapId: 'KOTOBUKI_MAP',
      })

      const infoWindow = new InfoWindow()

      markers.forEach((marker) => {
        const advancedMarker = new AdvancedMarkerElement({
          map,
          position: marker.position,
          title: marker.title,
        })

        // マーカークリックでポップアップを表示
        advancedMarker.addListener('click', () => {
          infoWindow.setContent(`
            <div class="p-2">
              <h3 class="font-bold text-gray-900">${marker.title}</h3>
              <p class="text-sm text-gray-600 mt-1">${marker.description || ''}</p>
              <a href="/lodging/${marker.id}" class="text-primary-600 text-sm mt-2 inline-block">詳細を見る</a>
            </div>
          `)
          infoWindow.open(map, advancedMarker)
        })
      })
    }

    initMap()
  }, [center, zoom, markers])

  return <div ref={mapRef} className="w-full h-full min-h-[400px]" />
}
```

### 1.5 住所から座標への変換（Geocoding）

Geocoding APIを使って住所から緯度経度を取得する方法:

```typescript
async function getCoordinatesFromAddress(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`

  const response = await fetch(url)
  const data = await response.json()

  if (data.status === 'OK' && data.results.length > 0) {
    const location = data.results[0].geometry.location
    return {
      latitude: location.lat,
      longitude: location.lng,
    }
  }

  throw new Error('住所から座標を取得できませんでした')
}

// 使用例
const coords = await getCoordinatesFromAddress('神奈川県横浜市中区寿町1-1-1')
console.log(coords) // { latitude: 35.4437, longitude: 139.6380 }
```

---

## 2. PowerPoint スライドの使い方

### 2.1 PowerPointファイルの開き方

プロジェクトには `docs/PRESENTATION_SLIDES.md` にスライドの内容が記載されていますが、PowerPoint形式でプレゼンテーションを作成する方法を説明します。

#### Microsoft PowerPoint

**Windowsの場合**:
1. PowerPointを起動
2. 「ファイル」→「新規」→「空白のプレゼンテーション」を選択
3. スライドのテンプレートを選択

**macOSの場合**:
1. PowerPoint for Macを起動
2. テンプレートギャラリーから選択

#### Google Slides（無料）

1. [Google Slides](https://slides.google.com/) にアクセス
2. 「+ 新しいプレゼンテーションを作成」をクリック
3. テンプレートを選択

#### LibreOffice Impress（無料・オープンソース）

1. [LibreOffice](https://www.libreoffice.org/) をダウンロード・インストール
2. LibreOffice Impressを起動
3. 「プレゼンテーション」を選択

#### オンラインビューワー

PowerPointファイル（.pptx）を直接開けない場合:
- **Microsoft Office Online**: OneDriveにアップロードして閲覧・編集
- **Google Drive**: アップロードしてGoogle Slidesで開く

### 2.2 スライドのカスタマイズ

#### 会社ロゴの追加方法

**Step 1: ロゴ画像の準備**
1. ロゴ画像をPNG形式（背景透過）で用意
2. 推奨サイズ: 300x100px～600x200px

**Step 2: スライドに挿入**
1. 「挿入」タブをクリック
2. 「画像」→「このデバイス」を選択
3. ロゴファイルを選択して挿入
4. 画像をドラッグしてスライド右上に配置

**Step 3: すべてのスライドに適用**
1. 「表示」タブ→「スライドマスター」を選択
2. マスタースライドにロゴを配置
3. 「マスター表示を閉じる」で戻る

#### 色やフォントの変更

**テーマカラーの変更**:
1. 「デザイン」タブをクリック
2. 「バリエーション」→「色」→「色のカスタマイズ」
3. 以下の色を変更:
   - **アクセント1**: `#0284c7` （プライマリーブルー）
   - **アクセント2**: `#10B981` （グリーン）
   - **背景1**: `#FFFFFF` （白）
   - **背景2**: `#F9FAFB` （ライトグレー）

**フォントの変更**:
1. 「デザイン」タブ→「バリエーション」→「フォント」
2. 「フォントのカスタマイズ」を選択
3. 見出しフォント: **Meiryo UI** または **Yu Gothic**
4. 本文フォント: **Meiryo** または **Yu Gothic**

#### 画像の追加・置き換え

**新しい画像を追加**:
1. 「挿入」→「画像」→「このデバイス」
2. 画像を選択して挿入
3. サイズと位置を調整

**既存の画像を置き換え**:
1. 既存の画像をクリック
2. 右クリック→「図の変更」
3. 新しい画像を選択

**画像の編集**:
1. 画像を選択
2. 「図の形式」タブで以下を編集:
   - **明るさ・コントラスト**: 画像の明るさ調整
   - **色の変更**: セピア、グレースケール等
   - **アート効果**: ぼかし、スケッチ等
   - **トリミング**: 不要な部分をカット

#### グラフやチャートの編集

**グラフの挿入**:
1. 「挿入」→「グラフ」
2. グラフの種類を選択（棒グラフ、円グラフ等）
3. Excelのワークシートが開くので、データを入力

**データの編集**:
1. グラフをクリック
2. 「グラフのデザイン」→「データの編集」
3. Excelでデータを更新

**グラフのスタイル変更**:
1. グラフを選択
2. 「グラフのデザイン」タブ
3. 「クイックスタイル」から選択
4. 「色の変更」でカラースキームを変更

### 2.3 プレゼンテーション実施時のコツ

#### スライドショーモードの使い方

**開始方法**:
- **F5キー**: 最初のスライドから開始
- **Shift + F5**: 現在のスライドから開始
- リボンの「スライドショー」タブ→「最初から」

**操作方法**:
- **次のスライド**: クリック、スペースキー、→キー
- **前のスライド**: ←キー、Backspaceキー
- **特定のスライドへジャンプ**: スライド番号 + Enterキー
- **終了**: Escキー

#### 発表者ビューの活用

**発表者ビューとは**:
- プレゼンター用の画面（ノート、タイマー、次のスライド表示）
- 観客には通常のスライドのみ表示

**設定方法**:
1. 「スライドショー」タブ
2. 「発表者ツールを使用する」にチェック
3. 外部ディスプレイ接続時に自動で有効化

**発表者ビューの機能**:
- **ノート表示**: スピーカーノート（台本）を確認
- **タイマー**: 経過時間を表示
- **次のスライドプレビュー**: 次に何を話すか確認
- **ペンツール**: スライドに書き込み

#### アニメーションとトランジション

**トランジション（スライド切り替え効果）**:
1. スライドを選択
2. 「画面切り替え」タブ
3. 効果を選択（推奨: フェード、プッシュ、ワイプ）
4. 「すべてに適用」ですべてのスライドに適用

**アニメーション（要素の動き）**:
1. アニメーションさせる要素（テキスト、画像等）を選択
2. 「アニメーション」タブ
3. 「アニメーションの追加」→効果を選択
4. 「アニメーションウィンドウ」で順序とタイミングを調整

**注意点**:
- アニメーションは控えめに（ビジネスプレゼンではシンプルが好まれる）
- 推奨効果: フェード、ワイプ、スライドイン

#### タイマーの使い方

**発表者ビューのタイマー**:
1. スライドショー開始時に自動でタイマーが開始
2. 「発表者ツール」画面で経過時間を確認
3. 目標時間を設定可能

**リハーサル機能**:
1. 「スライドショー」→「リハーサル」
2. 各スライドの所要時間を記録
3. 記録した時間で自動再生も可能

### 2.4 PDF化と共有

#### PDFへのエクスポート

**PowerPointの場合**:
1. 「ファイル」→「エクスポート」
2. 「PDF/XPS ドキュメントの作成」を選択
3. 「PDF/XPS の作成」をクリック
4. ファイル名と保存場所を指定
5. 「オプション」で以下を設定:
   - **範囲**: すべてのスライド
   - **発行対象**: スライド（ノートは含めない）
   - **PDF/A準拠**: オフ（互換性優先）
6. 「発行」をクリック

**Google Slidesの場合**:
1. 「ファイル」→「ダウンロード」
2. 「PDF ドキュメント(.pdf)」を選択

**LibreOffice Impressの場合**:
1. 「ファイル」→「PDFとしてエクスポート」
2. オプションを設定して「エクスポート」

#### メール送付時の注意点

**ファイルサイズの確認**:
- PowerPoint: 通常5～20MB
- PDF: 1～10MB（圧縮されるため軽量）

**大容量ファイルの送付方法**:
1. **クラウドストレージを使用**:
   - Google Drive、OneDrive、Dropboxでリンク共有
2. **メールに直接添付する場合**:
   - 10MB以下に圧縮（画像の解像度を下げる）
3. **ファイル転送サービス**:
   - GigaFile便、Send Anywhere等を利用

**メール文面の例**:
```
件名: 寿地区簡易宿泊所サイトのプレゼンテーション資料

本文:
お世話になっております。

寿地区簡易宿泊所情報サイトのプレゼンテーション資料を
送付いたします。

ご確認のほど、よろしくお願いいたします。

【添付ファイル】
- kotobuki_presentation.pdf (3.2MB)
```

#### 印刷時の設定

**印刷設定**:
1. 「ファイル」→「印刷」
2. 以下の設定を確認:
   - **印刷レイアウト**: フルページサイズのスライド
   - **カラー**: カラー（または白黒）
   - **用紙サイズ**: A4
   - **向き**: 横
3. 「印刷」をクリック

**配布資料として印刷**:
1. 「ファイル」→「印刷」
2. 「フルページサイズのスライド」→「配布資料」
3. 「1ページあたりのスライド数」を選択（推奨: 3～6枚）
4. 「枠線を追加する」にチェック

**ノート付きで印刷**:
1. 「ファイル」→「印刷」
2. 「フルページサイズのスライド」→「ノート」
3. スライドとスピーカーノートが印刷される

---

## 3. ダミーデータの置き換え方法

### 3.1 宿泊所データの編集

#### データファイルの場所

宿泊所のデータは以下のファイルに格納されています:

```
kotobuki-lodging-site/lib/data.ts
```

#### データ構造の説明

```typescript
export interface Lodging {
  id: string                // 宿泊所のユニークID（'1', '2', '3'...）
  name: string              // 宿泊所名
  address: string           // 住所
  phone: string             // 電話番号
  capacity: number          // 収容人数
  vacancies: number         // 空室数
  pricePerNight: number     // 1泊料金（円）
  facilities: string[]      // 設備・サービスのリスト
  description: string       // 施設の説明文
  imageUrl: string          // 画像のパス（/images/配下）
  latitude: number          // 緯度（マップ表示用）
  longitude: number         // 経度（マップ表示用）
  lastUpdated: string       // 最終更新日（'YYYY-MM-DD'形式）
}
```

#### 実データへの置き換え手順

**Step 1: データファイルを開く**

テキストエディタ（VS Code、メモ帳等）で `lib/data.ts` を開きます。

**Step 2: 既存データを削除**

28行目から149行目の `lodgings` 配列の内容を削除します。

**Step 3: 実データを追加**

以下のテンプレートを参考に、実際の宿泊所情報を入力します:

```typescript
export const lodgings: Lodging[] = [
  {
    id: '1',
    name: '実際の宿泊所名',
    address: '神奈川県横浜市中区寿町1-1-1',
    phone: '045-123-4567',
    capacity: 50,
    vacancies: 5,
    pricePerNight: 1800,
    facilities: ['個室', '共同浴場', 'Wi-Fi', '冷暖房完備'],
    description: '実際の施設の説明文をここに記入します。',
    imageUrl: '/images/lodging-1.jpg',
    latitude: 35.4437,
    longitude: 139.6380,
    lastUpdated: '2025-11-06'
  },
  // 2件目以降も同様に追加
  {
    id: '2',
    name: '別の宿泊所',
    // ... 以下同様
  }
]
```

**Step 4: 座標の取得**

Google Mapsで緯度経度を取得する方法:

1. [Google Maps](https://www.google.com/maps) を開く
2. 宿泊所の住所を検索
3. 地図上の該当場所を右クリック
4. 一番上に表示される座標をクリック（例: `35.4437, 139.6380`）
5. 座標がクリップボードにコピーされます
6. `latitude` と `longitude` に入力

または、前述のGeocoding APIを使用:

```typescript
// 住所から座標を取得するスクリプト
const address = '神奈川県横浜市中区寿町1-1-1'
const coords = await getCoordinatesFromAddress(address)
console.log(coords) // { latitude: 35.4437, longitude: 139.6380 }
```

#### 画像ファイルの追加方法

**Step 1: 画像の準備**

1. 宿泊所の写真を用意（推奨サイズ: 1200x800px）
2. ファイル名を決定（例: `lodging-1.jpg`, `lodging-2.jpg`）
3. 形式: JPEG または PNG

**Step 2: 画像の配置**

1. `public/images/` フォルダに画像をコピー
   ```
   kotobuki-lodging-site/
   └── public/
       └── images/
           ├── lodging-1.jpg
           ├── lodging-2.jpg
           └── ...
   ```

**Step 3: データファイルで参照**

```typescript
{
  id: '1',
  name: '実際の宿泊所名',
  imageUrl: '/images/lodging-1.jpg', // ファイル名を指定
  // ... その他のフィールド
}
```

**画像の最適化**（オプション）:

Next.jsは自動的に画像を最適化しますが、事前に圧縮することでパフォーマンスが向上します:

1. [TinyPNG](https://tinypng.com/) で画像を圧縮
2. または、コマンドラインツール:
   ```bash
   npm install -g sharp-cli
   sharp -i lodging-1.jpg -o lodging-1-optimized.jpg --quality 80
   ```

### 3.2 周辺サービスデータの編集

#### サービス施設情報の追加

`lib/data.ts` の `services` 配列を編集します:

```typescript
export interface Service {
  id: string                           // サービスのユニークID（'s1', 's2'...）
  name: string                         // 施設名
  category: 'welfare' | 'medical' | 'employment' | 'other'  // カテゴリ
  address: string                      // 住所
  phone: string                        // 電話番号
  description: string                  // 施設の説明
  latitude: number                     // 緯度
  longitude: number                    // 経度
}
```

**編集例**:

```typescript
export const services: Service[] = [
  {
    id: 's1',
    name: '実際の福祉施設名',
    category: 'welfare',
    address: '神奈川県横浜市中区寿町1-3-2',
    phone: '045-111-2222',
    description: '生活相談、就労支援、福祉制度の案内などを行っています。',
    latitude: 35.4438,
    longitude: 139.6378
  },
  // 2件目以降も同様
]
```

#### カテゴリの種類

| カテゴリ | 値 | 説明 | 表示色 |
|---------|-----|------|--------|
| 福祉施設 | `'welfare'` | 生活館、地区センター等 | 緑 |
| 医療機関 | `'medical'` | 診療所、薬局等 | 赤 |
| 就労支援 | `'employment'` | ハローワーク、職業訓練等 | 黄 |
| その他 | `'other'` | その他の施設 | 紫 |

#### カテゴリの追加・変更

新しいカテゴリを追加する場合:

**Step 1: インターフェースを更新**

`lib/data.ts`:

```typescript
export interface Service {
  id: string
  name: string
  category: 'welfare' | 'medical' | 'employment' | 'education' | 'other'  // 'education'を追加
  // ... その他のフィールド
}
```

**Step 2: マップページの凡例を更新**

`app/map/page.tsx`:

```typescript
const colors = {
  welfare: 'bg-green-500',
  medical: 'bg-red-500',
  employment: 'bg-yellow-500',
  education: 'bg-blue-500',    // 新しいカテゴリ
  other: 'bg-purple-500',
}

const labels = {
  welfare: '福祉',
  medical: '医療',
  employment: '就労',
  education: '教育',           // 新しいカテゴリ
  other: 'その他',
}
```

---

## 4. サイトのカスタマイズ

### 4.1 色やデザインの変更

#### `tailwind.config.ts` の編集

Tailwind CSSの設定ファイルでカラーパレットを変更できます。

**ファイルの場所**:
```
kotobuki-lodging-site/tailwind.config.ts
```

**現在のカラー設定**:

```typescript
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',  // メインカラー
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
}
```

**カラーの変更方法**:

1. `tailwind.config.ts` を開く
2. `primary` の各色を変更
3. 開発サーバーを再起動（`npm run dev`）

**色見本ツール**:
- [Tailwind Color Generator](https://uicolors.app/create)
- [Color Hunt](https://colorhunt.co/)

**例: グリーン系に変更**:

```typescript
colors: {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',  // メインカラー
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
}
```

#### フォントの変更

**Step 1: Google Fontsから選択**

1. [Google Fonts](https://fonts.google.com/) を開く
2. 日本語フォントを選択（Noto Sans Japanese、M PLUS Rounded等）
3. 「Select this style」をクリック

**Step 2: `app/layout.tsx` を編集**

```typescript
import { Noto_Sans_JP } from 'next/font/google'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={notoSansJP.className}>
      <body>{children}</body>
    </html>
  )
}
```

**Step 3: Tailwindでフォントファミリーを設定**

`tailwind.config.ts`:

```typescript
theme: {
  extend: {
    fontFamily: {
      sans: ['Noto Sans JP', 'sans-serif'],
    },
  },
}
```

### 4.2 ページの追加・編集

#### 新しいページの追加方法

Next.js App Routerでは、`app/` フォルダ内にフォルダを作成するだけでルーティングが設定されます。

**例: `/about`（会社概要）ページの追加**

**Step 1: フォルダとファイルを作成**

```bash
mkdir app/about
touch app/about/page.tsx
```

または、Windowsの場合:

```bash
mkdir app\about
type nul > app\about\page.tsx
```

**Step 2: `page.tsx` を編集**

```typescript
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">会社概要</h1>
          <p className="text-xl text-primary-100">
            寿地区簡易宿泊所情報サイトについて
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">運営団体</h2>
          <p className="text-gray-700 mb-4">
            寿地区センター（仮称）
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">所在地</h2>
          <p className="text-gray-700 mb-4">
            〒231-0066<br />
            神奈川県横浜市中区寿町2-2-1
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">お問い合わせ</h2>
          <p className="text-gray-700">
            TEL: 045-222-3333<br />
            受付時間: 月〜金 9:00-17:00
          </p>
        </div>
      </div>
    </div>
  )
}
```

**Step 3: ナビゲーションメニューに追加**

`components/Header.tsx` を編集:

```typescript
const navigation = [
  { name: 'ホーム', href: '/' },
  { name: '空室一覧', href: '/vacancies' },
  { name: '周辺マップ', href: '/map' },
  { name: '活動紹介', href: '/activities' },
  { name: '会社概要', href: '/about' },      // 追加
  { name: 'お問い合わせ', href: '/contact' },
]
```

#### 既存ページの編集

**トップページの編集**:

`app/page.tsx` を開いて、テキストや画像を変更します。

**例: ヒーローセクションの見出しを変更**:

```typescript
<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
  寿地区の宿泊施設情報を<br />一目で確認
</h1>
```

↓

```typescript
<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
  横浜市寿地区<br />簡易宿泊所空室案内
</h1>
```

#### メタデータの編集（SEO）

各ページの `metadata` オブジェクトを編集してSEOを最適化:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '会社概要 | 寿地区簡易宿泊所情報サイト',
  description: '寿地区簡易宿泊所情報サイトの運営団体、所在地、お問い合わせ先をご案内します。',
}
```

### 4.3 お問い合わせフォームの実装

現在のお問い合わせフォームはダミー実装（アラート表示のみ）です。実際にメールを送信する機能を追加します。

#### 方法1: Resend を使用（推奨）

Resendは無料で月100通までメール送信可能です。

**Step 1: Resendアカウント作成**

1. [Resend](https://resend.com/) にアクセス
2. 「Sign Up」でアカウント作成
3. APIキーを取得

**Step 2: Resendライブラリをインストール**

```bash
npm install resend
```

**Step 3: 環境変数を設定**

`.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx
```

**Step 4: API Routeを作成**

`app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // バリデーション
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'すべてのフィールドを入力してください' },
        { status: 400 }
      )
    }

    // メール送信
    const { data, error } = await resend.emails.send({
      from: 'お問い合わせフォーム <onboarding@resend.dev>',
      to: ['info@your-domain.com'], // 受信先メールアドレス
      subject: `【お問い合わせ】${name}様より`,
      html: `
        <h2>新しいお問い合わせがあります</h2>
        <p><strong>お名前:</strong> ${name}</p>
        <p><strong>メールアドレス:</strong> ${email}</p>
        <p><strong>お問い合わせ内容:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: 'メール送信に失敗しました' },
      { status: 500 }
    )
  }
}
```

**Step 5: フォームコンポーネントを更新**

`app/contact/page.tsx`:

```typescript
'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">お問い合わせ</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                お名前 <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                お問い合わせ内容 <span className="text-red-600">*</span>
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                お問い合わせを送信しました。ありがとうございます。
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                送信に失敗しました。もう一度お試しください。
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400"
            >
              {status === 'loading' ? '送信中...' : '送信する'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

#### 方法2: SendGrid を使用

SendGridも無料プランで月100通まで送信可能です。

**Step 1: SendGridアカウント作成**

1. [SendGrid](https://sendgrid.com/) にアクセス
2. 無料アカウントを作成
3. APIキーを取得

**Step 2: SendGridライブラリをインストール**

```bash
npm install @sendgrid/mail
```

**Step 3: API Route**

`app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    const msg = {
      to: 'info@your-domain.com',
      from: 'noreply@your-domain.com', // SendGridで認証済みのメールアドレス
      subject: `【お問い合わせ】${name}様より`,
      text: `お名前: ${name}\nメールアドレス: ${email}\n\nお問い合わせ内容:\n${message}`,
      html: `
        <h2>新しいお問い合わせがあります</h2>
        <p><strong>お名前:</strong> ${name}</p>
        <p><strong>メールアドレス:</strong> ${email}</p>
        <p><strong>お問い合わせ内容:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    }

    await sgMail.send(msg)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'メール送信に失敗しました' },
      { status: 500 }
    )
  }
}
```

#### フォームバリデーション

より堅牢なバリデーションを実装:

```bash
npm install zod
```

`app/api/contact/route.ts`:

```typescript
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'お名前を入力してください').max(100),
  email: z.string().email('有効なメールアドレスを入力してください'),
  message: z.string().min(10, 'お問い合わせ内容は10文字以上入力してください').max(1000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // バリデーション
    const validatedData = contactSchema.parse(body)

    // メール送信処理
    // ...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'エラーが発生しました' },
      { status: 500 }
    )
  }
}
```

---

## 5. デプロイと更新

### 5.1 Vercelでの更新方法

Vercelは、Next.jsのデプロイに最適化されたプラットフォームです。

#### 初回デプロイ

**Step 1: Vercel CLIのインストール**

```bash
npm install -g vercel
```

**Step 2: Vercelにログイン**

```bash
vercel login
```

メールアドレスを入力し、受信したリンクをクリックして認証します。

**Step 3: プロジェクトをデプロイ**

```bash
cd kotobuki-lodging-site
vercel
```

対話式の質問に答えます:

- `Set up and deploy "kotobuki-lodging-site"?` → **Y**
- `Which scope do you want to deploy to?` → あなたのアカウント名を選択
- `Link to existing project?` → **N**
- `What's your project's name?` → **kotobuki-lodging-site**
- `In which directory is your code located?` → **./（デフォルト）**

**Step 4: 本番デプロイ**

テストデプロイが成功したら、本番環境にデプロイ:

```bash
vercel --prod
```

#### Gitにコミット

**Step 1: Gitリポジトリを初期化**（まだの場合）

```bash
git init
git add .
git commit -m "Initial commit"
```

**Step 2: GitHubにプッシュ**

1. [GitHub](https://github.com/) で新しいリポジトリを作成
2. リポジトリのURLをコピー
3. ローカルでリモートを設定:

```bash
git remote add origin https://github.com/your-username/kotobuki-lodging-site.git
git branch -M main
git push -u origin main
```

#### 自動デプロイの仕組み

VercelはGitHubと連携することで、コミットごとに自動デプロイされます。

**Step 1: Vercelダッシュボードでプロジェクトを選択**

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. プロジェクト一覧から「kotobuki-lodging-site」を選択

**Step 2: GitHubと連携**

1. 「Settings」タブ→「Git」
2. 「Connect Git Repository」をクリック
3. GitHubアカウントを認証
4. リポジトリを選択

**Step 3: 自動デプロイの確認**

以降、GitHubに `git push` するたびに自動的にデプロイされます:

```bash
# ファイルを編集
git add .
git commit -m "Update lodging data"
git push
```

Vercelが自動的にビルド・デプロイを開始します。

#### 手動デプロイのコマンド

Gitを使わずに、直接デプロイすることも可能:

```bash
# プレビュー環境にデプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

### 5.2 カスタムドメインの設定

独自ドメイン（例: `kotobuki-info.com`）を設定する方法

#### ドメインの購入

**推奨レジストラ**:
- [お名前.com](https://www.onamae.com/) - 日本語サポートあり
- [Google Domains](https://domains.google/) - シンプルで安価
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) - 最安値

**購入手順**（お名前.comの例）:

1. お名前.comにアクセス
2. 希望のドメイン名を検索（例: `kotobuki-info.com`）
3. カートに追加して購入
4. DNS設定画面に進む

#### Vercelへのドメイン追加

**Step 1: Vercelダッシュボードでドメインを追加**

1. Vercel Dashboard → プロジェクト選択
2. 「Settings」タブ→「Domains」
3. 「Add」ボタンをクリック
4. ドメイン名を入力（例: `kotobuki-info.com`）
5. 「Add」をクリック

**Step 2: DNS設定**

Vercelが以下のDNSレコードを表示します:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

#### DNS設定（お名前.comの場合）

**Step 1: お名前.comのDNS設定画面を開く**

1. お名前.comにログイン
2. 「ドメイン設定」→「DNS設定」
3. 対象のドメインを選択

**Step 2: Aレコードを追加**

- タイプ: **A**
- ホスト名: **@**（空欄またはドメイン名）
- VALUE: **76.76.21.21**
- TTL: **3600**（デフォルト）

**Step 3: CNAMEレコードを追加**

- タイプ: **CNAME**
- ホスト名: **www**
- VALUE: **cname.vercel-dns.com**
- TTL: **3600**

**Step 4: 設定を保存**

DNS設定が反映されるまで最大48時間かかる場合があります（通常は数時間）。

#### SSL証明書の自動発行

Vercelは自動的にSSL証明書（Let's Encrypt）を発行します:

1. DNS設定が完了すると自動的に証明書が発行されます
2. HTTPSアクセスが有効になります（`https://kotobuki-info.com`）

### 5.3 環境変数の管理

#### Vercelダッシュボードでの環境変数設定

**Step 1: 環境変数を追加**

1. Vercel Dashboard → プロジェクト選択
2. 「Settings」タブ→「Environment Variables」
3. 「Add」ボタンをクリック
4. 以下を入力:
   - **Name**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value**: APIキー
   - **Environments**: Production, Preview, Development（すべて選択）
5. 「Save」をクリック

**Step 2: 再デプロイ**

環境変数を追加した後は、再デプロイが必要です:

1. 「Deployments」タブ
2. 最新のデプロイの「⋯」メニュー→「Redeploy」

#### 本番環境とプレビュー環境の違い

| 環境 | 用途 | URL |
|------|------|-----|
| **Production** | 本番環境 | `kotobuki-info.com` |
| **Preview** | プレビュー環境（Pull Request） | `kotobuki-site-abc123.vercel.app` |
| **Development** | ローカル開発 | `localhost:3000` |

**環境変数の使い分け**:

- **本番環境**: 実際のAPIキー、本番データベース
- **プレビュー環境**: テスト用APIキー、テストデータベース
- **開発環境**: `.env.local` の設定を使用

#### セキュアな環境変数の管理

**機密情報の取り扱い**:

1. **絶対にGitにコミットしない**
   - `.env.local` は `.gitignore` に追加済み
2. **環境変数は最小限に**
   - 必要なものだけ設定
3. **定期的にローテーション**
   - APIキーは定期的に再生成

**`.gitignore` の確認**:

```gitignore
# 環境変数
.env
.env.local
.env.production
.env.development

# APIキー等
google-ads-config.json
gsc-credentials.json
gsc-token.json
```

---

## 6. トラブルシューティング

### 6.1 よくあるエラーと解決方法

#### ビルドエラー

**エラー**: `byte index XX is not a char boundary`

**原因**: プロジェクトパスに日本語（マルチバイト文字）が含まれている

**解決策**:

1. **プロジェクトを英数字のパスに移動**:
   ```bash
   cp -r "c:\Users\march\Projects\websites\森山さん\kotobuki-lodging-site" "c:\Users\march\Projects\kotobuki-lodging-site"
   cd "c:\Users\march\Projects\kotobuki-lodging-site"
   npm run build
   ```

2. **Vercelでデプロイ**（推奨）:
   ```bash
   vercel --prod
   ```
   Vercelは自動的に英数字のパスでビルドします。

3. **Webpackモードでビルド**:
   ```bash
   npm run build -- --no-turbopack
   ```

---

**エラー**: `Module not found: Can't resolve '@/lib/data'`

**原因**: TypeScriptのパスエイリアスが正しく設定されていない

**解決策**:

`tsconfig.json` を確認:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

開発サーバーを再起動:

```bash
# Ctrl+Cで停止
npm run dev
```

---

**エラー**: `Error: Failed to parse src on next/image`

**原因**: 画像ファイルが見つからない、またはパスが間違っている

**解決策**:

1. 画像ファイルが `public/images/` に存在するか確認
2. `imageUrl` のパスを確認:
   ```typescript
   imageUrl: '/images/lodging-1.jpg', // ✓ 正しい（/から始まる）
   imageUrl: 'images/lodging-1.jpg',  // ✗ 間違い
   ```

---

#### 地図が表示されない

**症状**: マップページで地図が表示されず、グレーの画面のみ

**原因1**: APIキーが設定されていない

**解決策**:
1. `.env.local` にAPIキーが設定されているか確認
2. 環境変数名が正しいか確認（`NEXT_PUBLIC_` 接頭辞が必須）
3. 開発サーバーを再起動

**原因2**: APIキーの制限設定が厳しすぎる

**解決策**:
1. Google Cloud Consoleで認証情報を確認
2. HTTPリファラー制限に `localhost:3000/*` が含まれているか確認
3. API制限に「Maps JavaScript API」が含まれているか確認

**原因3**: APIが有効化されていない

**解決策**:
1. Google Cloud Console → 「APIとサービス」→「ライブラリ」
2. 「Maps JavaScript API」が有効になっているか確認
3. 無効の場合は「有効にする」をクリック

---

#### 画像が表示されない

**症状**: 宿泊所カードや詳細ページで画像が表示されない

**原因1**: 画像ファイルが存在しない

**解決策**:
1. `public/images/` フォルダに画像があるか確認
2. ファイル名が `data.ts` の `imageUrl` と一致しているか確認
3. 大文字小文字が一致しているか確認（`lodging-1.jpg` ≠ `Lodging-1.JPG`）

**原因2**: 画像のパスが間違っている

**解決策**:
```typescript
// ✓ 正しい
imageUrl: '/images/lodging-1.jpg'

// ✗ 間違い（/が抜けている）
imageUrl: 'images/lodging-1.jpg'

// ✗ 間違い（publicを含めてはいけない）
imageUrl: '/public/images/lodging-1.jpg'
```

**原因3**: 画像形式が対応していない

**解決策**:
- 対応形式: JPEG, PNG, WebP, GIF, SVG
- BMPやTIFFは未対応
- 必要に応じて変換: [Convertio](https://convertio.co/ja/)

---

#### デプロイが失敗する

**エラー**: `Error: Build failed`

**原因**: TypeScriptの型エラー、ESLintエラー等

**解決策**:

1. **ローカルでビルドを試す**:
   ```bash
   npm run build
   ```
   エラーメッセージを確認

2. **型エラーを修正**:
   ```bash
   npm run lint
   ```
   TypeScriptの型エラーを修正

3. **依存関係を再インストール**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

**エラー**: `ENOENT: no such file or directory`

**原因**: 必要なファイルが見つからない

**解決策**:
1. `.gitignore` に誤って重要なファイルが含まれていないか確認
2. Vercelに環境変数が設定されているか確認
3. `public/` フォルダがGitにコミットされているか確認

---

#### フォームが送信できない

**症状**: お問い合わせフォームで「送信」ボタンをクリックしてもエラーになる

**原因1**: APIエンドポイントが存在しない

**解決策**:
- 現在はダミー実装のため、実際にはメール送信されません
- 「3.3 お問い合わせフォームの実装」を参照して実装してください

**原因2**: API Routeにエラーがある

**解決策**:
1. ブラウザのコンソール（F12）でエラーメッセージを確認
2. サーバーログを確認:
   ```bash
   npm run dev
   ```
   ターミナルにエラーが表示されます

3. APIキーが設定されているか確認（Resend、SendGrid等）

**原因3**: CORS エラー

**解決策**:
- Next.js API Routesは自動的にCORSを処理しますが、外部APIを使う場合は注意
- `next.config.mjs` でCORSヘッダーを追加:
  ```javascript
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  }
  ```

---

### 6.2 サポート情報

#### GitHub Issuesの使い方

プロジェクトをGitHubで管理している場合、Issuesで問題を報告・追跡できます。

**Step 1: Issueを作成**

1. GitHubリポジトリを開く
2. 「Issues」タブをクリック
3. 「New issue」をクリック

**Step 2: 問題を記述**

```markdown
## 問題の説明
地図が表示されず、グレーの画面のみ表示されます。

## 再現手順
1. `/map` ページを開く
2. 地図エリアがグレーのまま

## 期待される動作
Google Mapsが表示される

## 環境
- OS: Windows 11
- ブラウザ: Chrome 120.0
- Node.js: v20.10.0

## スクリーンショット
（スクリーンショットを添付）
```

#### ログの確認方法

**開発サーバーのログ**:

```bash
npm run dev
```

ターミナルに以下が表示されます:
- コンパイルエラー
- APIエラー
- リクエストログ

**ブラウザコンソールのログ**:

1. ブラウザで **F12** を押す
2. 「Console」タブを選択
3. エラーメッセージを確認

**本番環境のログ（Vercel）**:

1. Vercel Dashboard → プロジェクト選択
2. 「Deployments」タブ
3. デプロイをクリック→「Runtime Logs」を確認

#### コミュニティサポート

**質問できる場所**:

1. **Next.js公式ドキュメント**:
   - [https://nextjs.org/docs](https://nextjs.org/docs)
   - 日本語版: [https://ja.next-community-docs.dev/](https://ja.next-community-docs.dev/)

2. **Stack Overflow**:
   - タグ: `next.js`, `typescript`, `tailwindcss`
   - [https://stackoverflow.com/questions/tagged/next.js](https://stackoverflow.com/questions/tagged/next.js)

3. **Next.js Discord**:
   - [https://nextjs.org/discord](https://nextjs.org/discord)

4. **Vercel サポート**:
   - [https://vercel.com/support](https://vercel.com/support)

---

## 7. パフォーマンス最適化

### 7.1 画像の最適化

#### Next.js Image コンポーネントの使い方

Next.jsの `Image` コンポーネントは自動的に画像を最適化します。

**基本的な使い方**:

```typescript
import Image from 'next/image'

export default function LodgingCard({ lodging }: { lodging: Lodging }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={lodging.imageUrl}
        alt={lodging.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      {/* ... その他のコンテンツ */}
    </div>
  )
}
```

**Imageコンポーネントの利点**:
- 自動的にWebPに変換（対応ブラウザのみ）
- レスポンシブ画像の生成
- 遅延読み込み（Lazy Loading）
- プレースホルダーの表示

**プレースホルダーの追加**:

```typescript
<Image
  src={lodging.imageUrl}
  alt={lodging.name}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
  className="w-full h-48 object-cover"
/>
```

#### WebP形式への変換

WebPは、JPEGやPNGよりも25～35%小さいファイルサイズで同等の画質を実現します。

**オンラインツール**:
- [Squoosh](https://squoosh.app/) - Googleの画像圧縮ツール
- [TinyPNG](https://tinypng.com/) - PNG/JPEG圧縮

**コマンドラインツール**:

```bash
# sharpをインストール
npm install -g sharp-cli

# WebPに変換
sharp -i lodging-1.jpg -o lodging-1.webp --format webp --quality 80

# 一括変換
for file in *.jpg; do sharp -i "$file" -o "${file%.jpg}.webp" --format webp --quality 80; done
```

**Next.jsでの使用**:

Next.jsの `Image` コンポーネントは自動的にWebPに変換するため、手動変換は不要です。

#### 遅延読み込み

画像の遅延読み込みで初期ロード時間を短縮:

```typescript
<Image
  src={lodging.imageUrl}
  alt={lodging.name}
  width={400}
  height={300}
  loading="lazy"  // 遅延読み込み
  className="w-full h-48 object-cover"
/>
```

**優先度の設定**:

ファーストビュー（画面上部）の画像は優先的に読み込む:

```typescript
<Image
  src="/images/hero.jpg"
  alt="ヒーロー画像"
  width={1920}
  height={1080}
  priority  // 優先的に読み込む
/>
```

### 7.2 ページ速度の改善

#### Lighthouseでの測定

Lighthouseは、Googleが提供する無料のパフォーマンス測定ツールです。

**Chrome DevToolsで実行**:

1. Chrome でサイトを開く
2. **F12** を押してDevToolsを開く
3. 「Lighthouse」タブを選択
4. 「Analyze page load」をクリック

**コマンドラインで実行**:

```bash
# Lighthouseをインストール
npm install -g lighthouse

# レポート生成
lighthouse https://your-site.com --view

# モバイル版のレポート
lighthouse https://your-site.com --preset=mobile --view
```

**スコアの目標**:

| 指標 | 目標 |
|------|------|
| **Performance** | 90+ |
| **Accessibility** | 95+ |
| **Best Practices** | 95+ |
| **SEO** | 100 |

#### Core Web Vitals の最適化

Core Web Vitalsは、Googleが定義する3つの重要な指標です。

**1. LCP（Largest Contentful Paint）**

最大のコンテンツが表示されるまでの時間

**目標**: 2.5秒以下

**改善方法**:
- 画像を最適化（WebP、圧縮）
- CDNを使用（Vercel、Cloudflare等）
- サーバーレスポンスを高速化

**2. FID（First Input Delay）**

ユーザーの最初の操作に応答するまでの時間

**目標**: 100ms以下

**改善方法**:
- JavaScriptの実行時間を削減
- コード分割（Dynamic Import）
- 不要なサードパーティスクリプトを削除

**3. CLS（Cumulative Layout Shift）**

レイアウトのズレの累積

**目標**: 0.1以下

**改善方法**:
- 画像に `width` と `height` を指定
- フォントの読み込み最適化
- 広告やiframeのサイズを固定

**実装例**:

```typescript
// 画像にサイズを指定してCLSを防ぐ
<Image
  src="/images/lodging-1.jpg"
  alt="宿泊所"
  width={400}
  height={300}
  className="w-full h-48 object-cover"
/>

// フォントの最適化
import { Noto_Sans_JP } from 'next/font/google'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',  // フォント読み込み中も代替フォントで表示
})
```

#### コード分割とDynamic Import

大きなコンポーネントを遅延読み込みして初期ロードを高速化:

```typescript
import dynamic from 'next/dynamic'

// Google Mapsを動的にインポート
const Map = dynamic(() => import('@/components/Map'), {
  loading: () => <p>地図を読み込んでいます...</p>,
  ssr: false, // サーバーサイドレンダリングを無効化
})

export default function MapPage() {
  return (
    <div>
      <h1>周辺マップ</h1>
      <Map center={{ lat: 35.4445, lng: 139.6388 }} />
    </div>
  )
}
```

#### キャッシュの活用

Vercelは自動的にキャッシュを設定しますが、手動で最適化することも可能:

**next.config.mjs**:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 31536000, // 1年間キャッシュ
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

---

## まとめ

このユーザーガイドでは、寿地区簡易宿泊所サイトの以下について説明しました:

1. **Google Maps API の設定**: APIキーの取得から地図コンポーネントの実装まで
2. **PowerPoint スライドの使い方**: プレゼンテーションの作成・編集・共有
3. **ダミーデータの置き換え**: 実際の宿泊所データへの更新手順
4. **サイトのカスタマイズ**: 色、フォント、ページの追加、お問い合わせフォームの実装
5. **デプロイと更新**: Vercelでの自動デプロイ、カスタムドメイン設定
6. **トラブルシューティング**: よくあるエラーと解決方法
7. **パフォーマンス最適化**: 画像最適化、Core Web Vitals改善

### 次のステップ

1. **データを実データに置き換える** (`lib/data.ts`)
2. **Google Maps APIを設定する** (`.env.local`)
3. **お問い合わせフォームを実装する** (Resend/SendGrid)
4. **Vercelにデプロイする** (`vercel --prod`)
5. **カスタムドメインを設定する**（オプション）

### サポートが必要な場合

- **技術的な質問**: Stack Overflow、Next.js Discord
- **Vercelのサポート**: [https://vercel.com/support](https://vercel.com/support)
- **プロジェクトの問題報告**: GitHub Issues

---

**最終更新**: 2025-11-06
**バージョン**: 1.0.0
