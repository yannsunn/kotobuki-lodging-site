import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SimpleVacancyManager from '@/components/SimpleVacancyManager'
import LogoutButton from '@/components/LogoutButton'

export default async function SimpleModePage() {
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

  // オーナーの宿泊所を取得
  const { data: ownerLodgings } = await supabase
    .from('owner_lodgings')
    .select(`
      lodging_id,
      lodgings (*)
    `)
    .eq('owner_id', user.id)

  const lodgings = ownerLodgings?.map((ol: any) => ol.lodgings).filter(Boolean) || []

  if (lodgings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">管理施設なし</h2>
          <p className="text-gray-600 mb-6">
            管理者に宿泊所の割り当てを依頼してください
          </p>
          <LogoutButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-primary-600">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">空室管理</h1>
              <p className="text-sm text-gray-600 mt-1">
                {profile?.full_name || user.email} さん
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {lodgings.map((lodging: any) => (
            <SimpleVacancyManager key={lodging.id} lodging={lodging} />
          ))}
        </div>
      </main>

      {/* Footer Note */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-sm text-gray-500">
          お困りの際は、管理者にお問い合わせください
        </p>
      </div>
    </div>
  )
}
