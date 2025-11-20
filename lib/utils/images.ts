/**
 * Unsplash画像URLを生成するヘルパー関数
 * APIキー不要で利用できる公開URLを使用
 */

export type ImageCategory = 'building' | 'room' | 'yokohama' | 'community' | 'support' | 'interior'

/**
 * カテゴリに応じたUnsplash画像URLを取得
 */
export function getUnsplashImage(category: ImageCategory, width: number = 800, height: number = 600): string {
  const baseUrl = 'https://images.unsplash.com/photo'

  // カテゴリごとの厳選された画像ID（横浜・寿地区に適した画像）
  const imageIds: Record<ImageCategory, string[]> = {
    building: [
      '1486406112313-4e1db7f9aa1e', // モダンな建物
      '1545324418-cc1a3fa10c00', // アパート外観
      '1560448204-e02f11c3d0e2', // 集合住宅
    ],
    room: [
      '1522771739844-6a9f6d5f14af', // シンプルな部屋
      '1540518614846-7eded433c457', // 清潔な寝室
      '1616594039964-ae9021a400a0', // ミニマルな部屋
    ],
    yokohama: [
      '1590559899731-3febc3f5d25f', // 日本の都市風景・港町
      '1480796927426-b46e29873a5b', // 横浜の街並み
      '1524413840807-0c3cb6fa808d', // 日本の都市夜景
    ],
    community: [
      '1529156069898-49953e39b3db', // コミュニティ
      '1517245386807-bb43f82c33c4', // サポート
      '1521737711867-e3b97375f902', // 人々の集まり
    ],
    support: [
      '1573497019940-1c28c88b4f3e', // サポート・支援
      '1559329007-40df8a9345d8', // ヘルプデスク
      '1521737852567-6949f3f9f2b5', // 支援活動
    ],
    interior: [
      '1556912173-46a9e89606a6', // インテリア
      '1616486338812-3dadae4b4ace', // 清潔な室内
      '1556909114-f6e7ad7d3136', // モダンなインテリア
    ],
  }

  // ランダムに画像を選択
  const categoryImages = imageIds[category]
  const randomIndex = Math.floor(Math.random() * categoryImages.length)
  const imageId = categoryImages[randomIndex]

  // Unsplash URL構築
  return `${baseUrl}-${imageId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`
}

/**
 * IDベースで一貫した画像を取得（同じIDなら同じ画像）
 */
export function getConsistentImage(id: string, category: ImageCategory, width: number = 800, height: number = 600): string {
  const baseUrl = 'https://images.unsplash.com/photo'

  const imageIds: Record<ImageCategory, string[]> = {
    building: [
      '1486406112313-4e1db7f9aa1e',
      '1545324418-cc1a3fa10c00',
      '1560448204-e02f11c3d0e2',
      '1512917774080-9991f1c4c750',
      '1580587771525-78b9dba3b914',
    ],
    room: [
      '1522771739844-6a9f6d5f14af',
      '1540518614846-7eded433c457',
      '1616594039964-ae9021a400a0',
      '1505693314120-0d443867891c',
      '1616486338812-3dadae4b4ace',
    ],
    yokohama: [
      '1542051841857-5f90071e7989',
      '1590559899731-3febc3f5d25f',
      '1555854877-bab0e564b8d5',
      '1513407030348-c983a97b98d8',
      '1524413840807-0c3cb6fa808d',
    ],
    community: [
      '1529156069898-49953e39b3db',
      '1517245386807-bb43f82c33c4',
      '1521737711867-e3b97375f902',
      '1511632765486-a01980e01a18',
      '1523240795612-9a054b0db644',
    ],
    support: [
      '1573497019940-1c28c88b4f3e',
      '1559329007-40df8a9345d8',
      '1521737852567-6949f3f9f2b5',
      '1527689368864-3a821dbccc34',
      '1556761175-4b46a572b786',
    ],
    interior: [
      '1556912173-46a9e89606a6',
      '1616486338812-3dadae4b4ace',
      '1556909114-f6e7ad7d3136',
      '1556228720-195a672e8a03',
      '1615529182904-14819c35db37',
    ],
  }

  // IDから一貫したインデックスを生成
  const hashCode = id.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  const index = Math.abs(hashCode) % imageIds[category].length
  const imageId = imageIds[category][index]

  return `${baseUrl}-${imageId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`
}

/**
 * グラデーション背景のクラス名を取得（フォールバック用）
 */
export function getGradientBackground(index: number): string {
  const gradients = [
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-cyan-400 to-cyan-600',
    'bg-gradient-to-br from-teal-400 to-teal-600',
    'bg-gradient-to-br from-orange-400 to-orange-600',
  ]

  return gradients[index % gradients.length]
}
