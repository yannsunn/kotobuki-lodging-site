import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto-sans-jp' })

export const metadata: Metadata = {
  title: '寿地区簡易宿泊所情報サイト',
  description: '横浜市中区寿町の簡易宿泊所の空室情報、周辺サービス、支援活動を紹介しています。',
  keywords: '寿町, 簡易宿泊所, 空室情報, 横浜市中区, ドヤ街, 福祉, 支援',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className={`${inter.className} ${notoSansJP.variable} font-sans`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
