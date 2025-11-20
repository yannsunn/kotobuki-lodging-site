/**
 * Unsplash画像URLを生成するヘルパー関数
 * Unsplash Source APIを使用してカテゴリに応じた画像を取得
 */

export type ImageCategory = 'building' | 'room' | 'yokohama' | 'community' | 'support' | 'interior'

/**
 * カテゴリに応じたUnsplash画像URLを取得
 */
export function getUnsplashImage(category: ImageCategory, width: number = 800, height: number = 600): string {
  // カテゴリごとの検索キーワード
  const keywords: Record<ImageCategory, string> = {
    building: 'apartment,building,architecture',
    room: 'minimal,bedroom,interior',
    yokohama: 'japan,city,urban,yokohama',
    community: 'people,community,group',
    support: 'helping,support,assistance',
    interior: 'room,modern,interior,design',
  }

  // Unsplash Source API を使用
  return `https://source.unsplash.com/${width}x${height}/?${keywords[category]}`
}

/**
 * IDベースで一貫した画像を取得（同じIDなら同じ画像）
 */
export function getConsistentImage(id: string, category: ImageCategory, width: number = 800, height: number = 600): string {
  // カテゴリごとの検索キーワード
  const keywords: Record<ImageCategory, string> = {
    building: 'apartment,building,architecture',
    room: 'minimal,bedroom,interior',
    yokohama: 'japan,city,urban,yokohama',
    community: 'people,community,group',
    support: 'helping,support,assistance',
    interior: 'room,modern,interior,design',
  }

  // IDをシードとして使用し、一貫性のある画像を取得
  // Unsplash Source APIではsigパラメータでシードを指定できる
  const seed = Math.abs(
    id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
  )

  return `https://source.unsplash.com/${width}x${height}/?${keywords[category]}&sig=${seed}`
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
