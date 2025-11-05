'use client'

import { useState } from 'react'
import VacancyCard from '@/components/VacancyCard'
import { lodgings } from '@/lib/data'

export default function VacanciesPage() {
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)
  const [sortBy, setSortBy] = useState<'vacancies' | 'price'>('vacancies')

  const filteredLodgings = lodgings
    .filter(l => !showOnlyAvailable || l.vacancies > 0)
    .sort((a, b) => {
      if (sortBy === 'vacancies') {
        return b.vacancies - a.vacancies
      } else {
        return a.pricePerNight - b.pricePerNight
      }
    })

  const totalVacancies = lodgings.reduce((sum, l) => sum + l.vacancies, 0)
  const availableCount = lodgings.filter(l => l.vacancies > 0).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">空室情報</h1>
          <p className="text-xl text-primary-100">
            寿地区の簡易宿泊所の空室状況をリアルタイムでご確認いただけます
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{lodgings.length}</div>
              <div className="text-sm text-gray-600 mt-1">掲載施設数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{availableCount}</div>
              <div className="text-sm text-gray-600 mt-1">空室あり施設</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalVacancies}</div>
              <div className="text-sm text-gray-600 mt-1">合計空室数</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyAvailable}
                  onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  空室ありのみ表示
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">並び替え:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'vacancies' | 'price')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="vacancies">空室数が多い順</option>
                <option value="price">価格が安い順</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredLodgings.length}件の施設を表示中
          </div>
        </div>
      </div>

      {/* Lodgings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredLodgings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLodgings.map((lodging) => (
              <VacancyCard key={lodging.id} lodging={lodging} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              該当する施設が見つかりませんでした
            </h3>
            <p className="text-gray-600">
              フィルター条件を変更して再度お試しください
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border-t border-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              空室情報のご利用にあたって
            </h2>
            <div className="prose prose-sm text-gray-600 space-y-3">
              <p>
                <strong>更新頻度:</strong> 空室情報は各施設より提供され、定期的に更新されています。
                最新の状況は各施設に直接お問い合わせください。
              </p>
              <p>
                <strong>予約方法:</strong> 気になる施設が見つかりましたら、施設詳細ページから
                電話番号をご確認の上、直接お問い合わせください。
              </p>
              <p>
                <strong>料金について:</strong> 表示されている料金は1泊あたりの基本料金です。
                長期滞在割引や生活保護対応については各施設にご相談ください。
              </p>
              <p>
                <strong>ご不明な点は:</strong> 施設選びや生活相談については、
                寿地区センター（TEL: 045-222-3333）でもご相談を受け付けています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
