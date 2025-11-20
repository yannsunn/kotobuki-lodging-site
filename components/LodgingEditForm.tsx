'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Lodging = {
  id: string
  name: string
  address: string
  phone: string
  capacity: number
  vacancies: number
  price_per_night: number
  facilities: string[]
  description: string
  image_url: string
  latitude: number
  longitude: number
  is_published: boolean
}

export default function LodgingEditForm({ lodging }: { lodging: Lodging }) {
  const [formData, setFormData] = useState({
    vacancies: lodging.vacancies,
    price_per_night: lodging.price_per_night,
    description: lodging.description,
    facilities: lodging.facilities.join(', '),
    image_url: lodging.image_url,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const facilitiesArray = formData.facilities
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0)

      const { error } = await supabase
        .from('lodgings')
        .update({
          vacancies: formData.vacancies,
          price_per_night: formData.price_per_night,
          description: formData.description,
          facilities: facilitiesArray,
          image_url: formData.image_url,
          last_updated: new Date().toISOString().split('T')[0],
        })
        .eq('id', lodging.id)

      if (error) throw error

      setSuccess(true)
      router.refresh()

      // 2秒後にダッシュボードへ
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      setError(error.message || '更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          更新が完了しました。ダッシュボードに戻ります...
        </div>
      )}

      {/* 基本情報（読み取り専用） */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">施設名</label>
            <div className="mt-1 text-gray-900">{lodging.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">電話番号</label>
            <div className="mt-1 text-gray-900">{lodging.phone}</div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">住所</label>
            <div className="mt-1 text-gray-900">{lodging.address}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">収容人数</label>
            <div className="mt-1 text-gray-900">{lodging.capacity}名</div>
          </div>
        </div>
      </div>

      {/* 編集可能な情報 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">更新可能な情報</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="vacancies" className="block text-sm font-medium text-gray-700">
              空室数 <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="vacancies"
              min="0"
              max={lodging.capacity}
              required
              value={formData.vacancies}
              onChange={(e) => setFormData({ ...formData, vacancies: parseInt(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              収容人数: {lodging.capacity}名まで
            </p>
          </div>

          <div>
            <label htmlFor="price_per_night" className="block text-sm font-medium text-gray-700">
              1泊料金（円） <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="price_per_night"
              min="0"
              step="100"
              required
              value={formData.price_per_night}
              onChange={(e) => setFormData({ ...formData, price_per_night: parseInt(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              施設説明
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="facilities" className="block text-sm font-medium text-gray-700">
              設備・サービス
            </label>
            <input
              type="text"
              id="facilities"
              value={formData.facilities}
              onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
              placeholder="個室, Wi-Fi, 共同浴場, 食堂"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              カンマ区切りで入力してください（例: 個室, Wi-Fi, 共同浴場）
            </p>
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
              画像URL（簡易版）
            </label>
            <input
              type="text"
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="/images/lodging-1.jpg"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              画像のURLを入力してください（将来的にファイルアップロード機能を追加予定）
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '更新中...' : '更新する'}
        </button>
      </div>
    </form>
  )
}
