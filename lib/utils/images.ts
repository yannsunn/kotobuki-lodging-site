/**
 * 画像URLを生成するヘルパー関数
 * Picsum Photos APIを使用して安定した画像を取得
 */

export type ImageCategory = 'building' | 'room' | 'yokohama' | 'community' | 'support' | 'interior'

/**
 * カテゴリに応じた画像IDを取得
 */
function getCategoryImageIds(category: ImageCategory): number[] {
  // カテゴリごとに適した画像IDを定義（Picsum Photos で確実に存在する 0-100 の範囲を使用）
  const imageIds: Record<ImageCategory, number[]> = {
    building: [1, 2, 3, 8, 10, 12, 16, 20, 24],
    room: [30, 31, 32, 34, 36, 38, 40, 42, 44],
    yokohama: [15, 18, 25, 26, 27, 28, 29, 33, 35],
    community: [4, 5, 6, 7, 9, 11, 13, 14, 17],
    support: [21, 22, 23, 37, 39, 41, 43, 45, 46],
    interior: [47, 48, 49, 50, 51, 52, 53, 54, 55],
  }
  return imageIds[category]
}

/**
 * カテゴリに応じた画像URLを取得（ランダム）
 */
export function getUnsplashImage(category: ImageCategory, width: number = 800, height: number = 600): string {
  const imageIds = getCategoryImageIds(category)
  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)]

  // Picsum Photos API を使用
  return `https://picsum.photos/id/${randomId}/${width}/${height}`
}

/**
 * IDベースで一貫した画像を取得（同じIDなら同じ画像）
 */
export function getConsistentImage(id: string, category: ImageCategory, width: number = 800, height: number = 600): string {
  // IDをハッシュ化して画像IDを選択
  const seed = Math.abs(
    id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
  )

  const imageIds = getCategoryImageIds(category)
  const imageId = imageIds[seed % imageIds.length]

  // Picsum Photos API を使用
  return `https://picsum.photos/id/${imageId}/${width}/${height}`
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
