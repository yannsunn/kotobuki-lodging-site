import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">寿地区について</h3>
            <p className="text-gray-300 text-sm">
              横浜市中区寿町は、支援と共生の地域です。
              このサイトでは簡易宿泊所の空室情報や周辺サービスを提供しています。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">クイックリンク</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/vacancies" className="text-gray-300 hover:text-white transition-colors">
                  空室情報
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-gray-300 hover:text-white transition-colors">
                  周辺マップ
                </Link>
              </li>
              <li>
                <Link href="/activities" className="text-gray-300 hover:text-white transition-colors">
                  活動紹介
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>寿地区センター</p>
              <p>〒231-0026</p>
              <p>神奈川県横浜市中区寿町2-2-1</p>
              <p>TEL: 045-222-3333</p>
              <p className="mt-4 text-xs">
                受付時間: 月〜金 9:00-17:00
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; 2025 寿地区簡易宿泊所情報サイト. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
