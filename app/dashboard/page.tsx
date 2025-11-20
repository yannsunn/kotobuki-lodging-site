import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ユーザーのプロフィール取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 管理者以外は簡易モードにリダイレクト
  if (profile?.role !== 'admin') {
    redirect('/dashboard/simple')
  }

  // オーナーの宿泊所を取得
  const { data: ownerLodgings } = await supabase
    .from('owner_lodgings')
    .select(`
      lodging_id,
      lodgings (*)
    `)
    .eq('owner_id', user.id)

  const lodgings = ownerLodgings?.map((ol: any) => ol.lodgings).filter(Boolean) || []

  // 管理者の場合は全宿泊所を取得
  const isAdmin = profile?.role === 'admin'
  let allLodgings: any[] = []

  if (isAdmin) {
    const { data } = await supabase
      .from('lodgings')
      .select('*')
      .order('name')

    allLodgings = data || []
  }

  const displayLodgings = isAdmin ? allLodgings : lodgings

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isAdmin ? '管理者ダッシュボード' : 'オーナーダッシュボード'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                ようこそ、{profile?.full_name || user.email} さん
                {isAdmin && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">管理者</span>}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                サイトを見る
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">管理施設数</p>
                <p className="text-2xl font-bold text-gray-900">{displayLodgings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">合計空室数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayLodgings.reduce((sum: number, l: any) => sum + (l.vacancies || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">合計収容数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayLodgings.reduce((sum: number, l: any) => sum + (l.capacity || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lodgings List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {isAdmin ? '全宿泊所' : '管理している宿泊所'}
            </h2>
          </div>

          {displayLodgings.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {displayLodgings.map((lodging: any) => (
                <div key={lodging.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{lodging.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{lodging.address}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-500">
                          空室: <span className="font-semibold text-green-600">{lodging.vacancies}</span> / {lodging.capacity}
                        </span>
                        <span className="text-sm text-gray-500">
                          料金: ¥{lodging.price_per_night?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          更新: {lodging.last_updated}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Link
                        href={`/dashboard/edit/${lodging.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        編集
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">管理施設なし</h3>
              <p className="mt-1 text-sm text-gray-500">
                管理者に宿泊所の割り当てを依頼してください
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
