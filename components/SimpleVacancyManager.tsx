'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Lodging = {
  id: string
  name: string
  capacity: number
  vacancies: number
  last_updated: string
}

export default function SimpleVacancyManager({ lodging }: { lodging: Lodging }) {
  const [vacancies, setVacancies] = useState(lodging.vacancies)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const updateVacancies = async (newVacancies: number) => {
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('lodgings')
        .update({
          vacancies: newVacancies,
          last_updated: new Date().toISOString().split('T')[0],
        })
        .eq('id', lodging.id)

      if (error) throw error

      setVacancies(newVacancies)
      setMessage({ type: 'success', text: '✓ 更新しました' })
      router.refresh()

      // 3秒後にメッセージを消す
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: '✗ 更新に失敗しました' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleIncrement = () => {
    if (vacancies < lodging.capacity) {
      updateVacancies(vacancies + 1)
    }
  }

  const handleDecrement = () => {
    if (vacancies > 0) {
      updateVacancies(vacancies - 1)
    }
  }

  const handleSetFull = () => {
    updateVacancies(0)
  }

  const handleSetAllAvailable = () => {
    updateVacancies(lodging.capacity)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
      {/* 施設名 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{lodging.name}</h2>
        <p className="text-sm text-gray-500">収容人数: {lodging.capacity}室</p>
      </div>

      {/* 現在の空室数表示 */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-8 mb-8 text-center">
        <p className="text-lg text-gray-700 mb-2">現在の空室数</p>
        <div className="text-7xl font-bold text-primary-600 mb-2">
          {vacancies}
        </div>
        <p className="text-xl text-gray-600">室</p>
      </div>

      {/* メッセージ表示 */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-center text-lg font-semibold ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-2 border-green-200'
              : 'bg-red-50 text-red-800 border-2 border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* +/- ボタン */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleDecrement}
          disabled={loading || vacancies === 0}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-4xl font-bold py-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-95"
        >
          - 1室
        </button>
        <button
          onClick={handleIncrement}
          disabled={loading || vacancies === lodging.capacity}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-4xl font-bold py-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-95"
        >
          + 1室
        </button>
      </div>

      {/* 満室/全室空室ボタン */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleSetFull}
          disabled={loading || vacancies === 0}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-bold py-6 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-95"
        >
          満室にする
        </button>
        <button
          onClick={handleSetAllAvailable}
          disabled={loading || vacancies === lodging.capacity}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-bold py-6 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-95"
        >
          全室空室
        </button>
      </div>

      {/* 最終更新日時 */}
      <div className="mt-6 text-center text-sm text-gray-500">
        最終更新: {lodging.last_updated || '未更新'}
      </div>

      {/* ローディング表示 */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-900">更新中...</p>
          </div>
        </div>
      )}
    </div>
  )
}
