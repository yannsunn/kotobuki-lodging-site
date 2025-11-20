import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LodgingEditForm from '@/components/LodgingEditForm'
import Link from 'next/link'

export default async function EditLodgingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ユーザープロフィール取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  // 宿泊所情報を取得
  const { data: lodging, error } = await supabase
    .from('lodgings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !lodging) {
    notFound()
  }

  // 管理者でない場合は、オーナーシップを確認
  if (!isAdmin) {
    const { data: ownership } = await supabase
      .from('owner_lodgings')
      .select('*')
      .eq('owner_id', user.id)
      .eq('lodging_id', id)
      .single()

    if (!ownership) {
      notFound()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">宿泊所情報編集</h1>
              <p className="text-sm text-gray-600 mt-1">{lodging.name}</p>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← ダッシュボードに戻る
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <LodgingEditForm lodging={lodging} />
        </div>
      </main>
    </div>
  )
}
