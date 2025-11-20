import { createClient } from '@/lib/supabase/server'

export default async function MapPage() {
  const supabase = await createClient()

  // Supabaseから宿泊所とサービスを取得
  const { data: lodgings } = await supabase
    .from('lodgings')
    .select('*')
    .eq('is_published', true)

  const { data: services } = await supabase
    .from('services')
    .select('*')

  const centerLat = 35.4445
  const centerLng = 139.6388

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Legend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">凡例</h2>

              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white text-xs font-bold">
                    H
                  </div>
                  <span className="text-sm text-gray-700">簡易宿泊所</span>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full mr-3 flex items-center justify-center text-white text-xs font-bold">
                    W
                  </div>
                  <span className="text-sm text-gray-700">福祉施設</span>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full mr-3 flex items-center justify-center text-white text-xs font-bold">
                    M
                  </div>
                  <span className="text-sm text-gray-700">医療機関</span>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full mr-3 flex items-center justify-center text-white text-xs font-bold">
                    E
                  </div>
                  <span className="text-sm text-gray-700">就労支援</span>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full mr-3 flex items-center justify-center text-white text-xs font-bold">
                    O
                  </div>
                  <span className="text-sm text-gray-700">その他施設</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">統計情報</h2>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">宿泊施設</div>
                  <div className="text-2xl font-bold text-blue-600">{lodgings?.length || 0}件</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">福祉施設</div>
                  <div className="text-2xl font-bold text-green-600">
                    {services?.filter(s => s.category === 'welfare').length || 0}件
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">医療機関</div>
                  <div className="text-2xl font-bold text-red-600">
                    {services?.filter(s => s.category === 'medical').length || 0}件
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">就労支援</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {services?.filter(s => s.category === 'employment').length || 0}件
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Map Placeholder */}
              <div className="bg-gray-200 h-[600px] flex items-center justify-center relative">
                <div className="text-center text-gray-500 z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-20 h-20 mx-auto mb-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                    />
                  </svg>
                  <p className="text-xl font-semibold mb-2">寿地区周辺マップ</p>
                  <p className="text-sm mb-4">
                    中心座標: {centerLat}, {centerLng}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${centerLat},${centerLng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Google マップで開く
                  </a>
                </div>

                {/* Simulated markers */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {lodgings?.slice(0, 5).map((lodging, index) => (
                    <div
                      key={lodging.id}
                      className="absolute"
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + index * 10}%`,
                      }}
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                        H
                      </div>
                    </div>
                  ))}
                  {services?.slice(0, 4).map((service, index) => {
                    const colors = {
                      welfare: 'bg-green-500',
                      medical: 'bg-red-500',
                      employment: 'bg-yellow-500',
                      other: 'bg-purple-500',
                    }
                    const letters = {
                      welfare: 'W',
                      medical: 'M',
                      employment: 'E',
                      other: 'O',
                    }
                    return (
                      <div
                        key={service.id}
                        className="absolute"
                        style={{
                          left: `${60 + index * 8}%`,
                          top: `${40 + index * 12}%`,
                        }}
                      >
                        <div
                          className={`w-8 h-8 ${colors[service.category]} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse`}
                        >
                          {letters[service.category]}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Map Info */}
              <div className="p-6 bg-blue-50">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Google Maps連携について</p>
                    <p>
                      実際のマップ表示には Google Maps JavaScript API が必要です。
                      本番環境では API キーを設定することで、インタラクティブな地図が表示されます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lodgings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white text-sm font-bold">
                H
              </div>
              宿泊施設一覧
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {lodgings?.map((lodging) => (
                <div key={lodging.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <h3 className="font-semibold text-gray-900">{lodging.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{lodging.address}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs font-semibold ${lodging.vacancies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {lodging.vacancies > 0 ? `空室 ${lodging.vacancies}室` : '満室'}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${lodging.latitude},${lodging.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:text-primary-700 underline"
                    >
                      地図で見る
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full mr-3 flex items-center justify-center text-white text-sm font-bold">
                S
              </div>
              周辺サービス一覧
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {services?.map((service) => {
                const colors = {
                  welfare: 'bg-green-100 text-green-800',
                  medical: 'bg-red-100 text-red-800',
                  employment: 'bg-yellow-100 text-yellow-800',
                  other: 'bg-purple-100 text-purple-800',
                }
                const labels = {
                  welfare: '福祉',
                  medical: '医療',
                  employment: '就労',
                  other: 'その他',
                }
                return (
                  <div key={service.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${colors[service.category]}`}>
                        {labels[service.category]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{service.address}</p>
                    <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${service.latitude},${service.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:text-primary-700 underline mt-2 inline-block"
                    >
                      地図で見る
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
