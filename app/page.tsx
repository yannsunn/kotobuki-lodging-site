import Link from 'next/link'
import Image from 'next/image'
import VacancyCard from '@/components/VacancyCard'
import { createClient } from '@/lib/supabase/server'
import { getUnsplashImage } from '@/lib/utils/images'

export default async function Home() {
  const supabase = await createClient()

  // Supabaseから空室のある宿泊所を取得（上位3件）
  const { data: availableLodgings } = await supabase
    .from('lodgings')
    .select('*')
    .gt('vacancies', 0)
    .eq('is_published', true)
    .order('vacancies', { ascending: false })
    .limit(3)

  // ヒーローセクション用の横浜の画像
  const heroImage = getUnsplashImage('yokohama', 1920, 1080)

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="relative h-[85vh] min-h-[600px] bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center">
        <Image
          src={heroImage}
          alt="横浜市中区寿町"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/70"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="text-white">
            {/* サブタイトル */}
            <span className="inline-block py-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6 tracking-wider font-medium">
              横浜・寿地区 簡易宿泊所ポータル
            </span>

            {/* メインタイトル */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              心休まる場所を、<br className="md:hidden" />ここから。
            </h1>

            {/* 説明文 */}
            <p className="text-lg md:text-xl lg:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
              多様な人々が行き交う街、横浜・寿町。<br className="hidden md:block" />
              あなたのライフスタイルに合った、安心できる宿泊先をご案内します。
            </p>

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/vacancies"
                className="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-stone-50 transition-all shadow-2xl hover:shadow-primary-500/20 w-full sm:w-auto min-w-[220px]"
              >
                空室を探す
                <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
              </Link>
              <Link
                href="/map"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto min-w-[220px] backdrop-blur-sm"
              >
                エリアマップを見る
              </Link>
            </div>
          </div>
        </div>

        {/* スクロールダウンインジケーター */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Latest Vacancies */}
      <section className="bg-stone-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">最新の空室情報</h2>
              <p className="text-slate-600">現在空室のある宿泊所をご紹介します</p>
            </div>
          <Link
            href="/vacancies"
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
          >
            すべて見る
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableLodgings && availableLodgings.length > 0 ? (
              availableLodgings.map((lodging) => (
                <VacancyCard key={lodging.id} lodging={lodging} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                現在空室情報はありません
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">寿地区について</h2>
              <div className="prose prose-lg text-slate-600 space-y-4">
                <p>
                  横浜市中区寿町は、簡易宿泊所が集まる地域として知られています。
                  かつては「ドヤ街」と呼ばれ、日雇い労働者の方々が多く暮らしていました。
                </p>
                <p>
                  現在では、様々な背景を持つ方々が生活する多様性のある地域として、
                  NPOや行政による支援活動が活発に行われています。
                </p>
                <p>
                  このサイトでは、宿泊所の空室情報や周辺の福祉サービス、
                  地域の活動情報を提供し、必要な方に情報が届くことを目指しています。
                </p>
              </div>
              <Link
                href="/activities"
                className="inline-block mt-6 text-primary-600 hover:text-primary-700 font-semibold"
              >
                活動紹介を見る →
              </Link>
            </div>

            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={getUnsplashImage('yokohama', 800, 1000)}
                alt="横浜・寿地区の風景"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">横浜市中区寿町</h3>
                <p className="text-white/90">多様性のある地域コミュニティ</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">宿泊施設</h3>
                  <p className="text-slate-600">手頃な価格で利用できる簡易宿泊所をご紹介</p>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">周辺サービス</h3>
                  <p className="text-slate-600">福祉、医療、就労支援などの施設情報</p>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">支援活動</h3>
                  <p className="text-slate-600">NPOや行政による様々な支援プログラム</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-stone-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">周辺サービス</h2>
          <p className="text-slate-600 text-center mb-16">寿地区周辺の主な支援施設</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">福祉相談</h3>
              <p className="text-sm text-slate-600">生活、福祉に関する各種相談窓口</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">医療施設</h3>
              <p className="text-sm text-slate-600">診療所、薬局などの医療機関</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">就労支援</h3>
              <p className="text-sm text-slate-600">職業訓練、求人紹介など</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">交流施設</h3>
              <p className="text-sm text-slate-600">地域センター、協働スペースなど</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/map"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              マップで詳しく見る
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">その他のサービス</h2>
          <p className="text-slate-600 text-center mb-16">随時公開予定の機能</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 公式LINE */}
            <div className="bg-stone-50 rounded-xl p-8 shadow-sm text-center border-2 border-dashed border-stone-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">公式LINE</h3>
              <p className="text-sm text-slate-600 mb-4">空室情報の自動通知サービス</p>
              <span className="inline-block px-4 py-2 bg-stone-200 text-stone-600 text-xs font-semibold rounded-full">随時公開</span>
            </div>

            {/* オンライン予約 */}
            <div className="bg-stone-50 rounded-xl p-8 shadow-sm text-center border-2 border-dashed border-stone-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">オンライン予約</h3>
              <p className="text-sm text-slate-600 mb-4">24時間いつでも予約可能</p>
              <span className="inline-block px-4 py-2 bg-stone-200 text-stone-600 text-xs font-semibold rounded-full">随時公開</span>
            </div>

            {/* 多言語対応 */}
            <div className="bg-stone-50 rounded-xl p-8 shadow-sm text-center border-2 border-dashed border-stone-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">多言語対応</h3>
              <p className="text-sm text-slate-600 mb-4">英語・中国語・韓国語対応</p>
              <span className="inline-block px-4 py-2 bg-stone-200 text-stone-600 text-xs font-semibold rounded-full">随時公開</span>
            </div>

            {/* バーチャルツアー */}
            <div className="bg-stone-50 rounded-xl p-8 shadow-sm text-center border-2 border-dashed border-stone-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-orange-600">
                  <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">バーチャルツアー</h3>
              <p className="text-sm text-slate-600 mb-4">360°室内見学機能</p>
              <span className="inline-block px-4 py-2 bg-stone-200 text-stone-600 text-xs font-semibold rounded-full">随時公開</span>
            </div>

            {/* レビュー・評価 */}
            <div className="bg-stone-50 rounded-xl p-8 shadow-sm text-center border-2 border-dashed border-stone-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">レビュー・評価</h3>
              <p className="text-sm text-slate-600 mb-4">利用者の声を共有</p>
              <span className="inline-block px-4 py-2 bg-stone-200 text-stone-600 text-xs font-semibold rounded-full">随時公開</span>
            </div>

            {/* お気に入り機能 */}
            <div className="bg-stone-50 rounded-xl p-8 shadow-sm text-center border-2 border-dashed border-stone-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">お気に入り機能</h3>
              <p className="text-sm text-slate-600 mb-4">気になる宿泊所を保存</p>
              <span className="inline-block px-4 py-2 bg-stone-200 text-stone-600 text-xs font-semibold rounded-full">随時公開</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Unified Design */}
      <section className="bg-stone-50 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-12 shadow-md text-center border border-stone-200">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">お困りのことがありますか？</h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              宿泊施設の詳細や周辺サービスについて、お気軽にお問い合わせください。
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
            >
              お問い合わせはこちら
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
