import Image from 'next/image'
import { getUnsplashImage } from '@/lib/utils/images'

export default function ActivitiesPage() {
  const heroImage = getUnsplashImage('community', 1600, 600)

  const activities = [
    {
      title: '生活相談・支援',
      description: '寿地区では、様々な生活相談や支援活動が行われています。',
      services: [
        '生活保護の申請サポート',
        '住居確保給付金の相談',
        '医療・福祉サービスの案内',
        '各種行政手続きの支援',
      ],
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      ),
    },
    {
      title: '就労支援',
      description: '仕事を探している方向けの様々な支援プログラムがあります。',
      services: [
        '職業訓練プログラム',
        '求人情報の提供',
        '履歴書作成サポート',
        '面接対策講座',
      ],
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
        />
      ),
    },
    {
      title: '医療・健康支援',
      description: '健康管理や医療アクセスをサポートする取り組みです。',
      services: [
        '無料健康相談',
        '医療機関への同行支援',
        '保険証の取得サポート',
        '健康診断の案内',
      ],
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      ),
    },
    {
      title: '地域交流イベント',
      description: '地域の絆を深めるための様々なイベントを開催しています。',
      services: [
        '季節の交流会',
        '食事会・炊き出し',
        '文化・スポーツイベント',
        '地域清掃活動',
      ],
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      <div className="relative h-[400px] bg-gradient-to-r from-primary-600 to-primary-800">
        <Image
          src={heroImage}
          alt="寿地区の支援活動"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/80 to-primary-800/80"></div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">活動紹介</h1>
            <p className="text-xl text-primary-100 max-w-3xl">
              寿地区では、NPOや行政、地域の方々が協力して、様々な支援活動を行っています。
              困ったときは、一人で抱え込まず、お気軽にご相談ください。
            </p>
          </div>
        </div>
      </div>

      {/* Main Activities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((activity, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-7 h-7 text-primary-600"
                    >
                      {activity.icon}
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-gray-600">{activity.description}</p>
                </div>
              </div>

              <ul className="space-y-3">
                {activity.services.map((service, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Organizations */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">主な支援団体</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            寿地区には多くの支援団体が活動しています。それぞれの団体が特色を持った支援を提供しています。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">寿生活館</h3>
              <p className="text-gray-600 text-sm mb-4">
                生活相談、就労支援、福祉制度の案内などを総合的に行っています。
              </p>
              <div className="text-sm text-gray-700">
                <p>TEL: 045-111-2222</p>
                <p>受付: 月〜金 9:00-17:00</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">寿地区センター</h3>
              <p className="text-gray-600 text-sm mb-4">
                地域の交流拠点として、各種イベントや相談会を開催しています。
              </p>
              <div className="text-sm text-gray-700">
                <p>TEL: 045-222-3333</p>
                <p>受付: 月〜金 9:00-17:00</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">よこはま夢ファンド</h3>
              <p className="text-gray-600 text-sm mb-4">
                就労支援、職業訓練、求人紹介を専門に行っています。
              </p>
              <div className="text-sm text-gray-700">
                <p>TEL: 045-333-4444</p>
                <p>受付: 月〜金 10:00-16:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Get Help */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            支援を受けるには
          </h2>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">相談窓口を訪問</h3>
                  <p className="text-gray-600">
                    まずは寿生活館や寿地区センターなどの相談窓口をお訪ねください。
                    予約不要で、相談は無料です。
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">状況をお聞かせください</h3>
                  <p className="text-gray-600">
                    専門のスタッフが丁寧にお話を伺い、あなたの状況に合った支援を一緒に考えます。
                    プライバシーは厳守されます。
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">支援プランの作成</h3>
                  <p className="text-gray-600">
                    住居、就労、医療、福祉など、必要な支援を組み合わせた具体的なプランを作成します。
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">継続的なサポート</h3>
                  <p className="text-gray-600">
                    支援は一度きりではありません。定期的にフォローアップを行い、
                    状況の変化に応じて支援内容を調整します。
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
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
                  <p className="font-semibold mb-1">困ったときは一人で抱え込まないでください</p>
                  <p>
                    どんな小さなことでも構いません。まずはご相談ください。
                    あなたの状況に合った支援を一緒に見つけていきましょう。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          さらに詳しい情報をお求めの方へ
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          お問い合わせフォームまたは電話でお気軽にご連絡ください
        </p>
        <a
          href="/contact"
          className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
        >
          お問い合わせはこちら
        </a>
      </div>
    </div>
  )
}
