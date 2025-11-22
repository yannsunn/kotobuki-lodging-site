import Link from 'next/link'
import Image from 'next/image'
import { getConsistentImage } from '@/lib/utils/images'

type Lodging = {
  id: string
  name: string
  address: string
  phone: string
  capacity: number
  vacancies: number
  price_per_night: number
  facilities: string[]
  description: string
  image_url: string
  latitude: number
  longitude: number
  last_updated: string
}

interface VacancyCardProps {
  lodging: Lodging
}

export default function VacancyCard({ lodging }: VacancyCardProps) {
  const isAvailable = lodging.vacancies > 0
  const imageUrl = getConsistentImage(lodging.id, 'building', 800, 600)

  return (
    <Link href={`/lodging/${lodging.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-64 bg-gradient-to-br from-orange-50 to-amber-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={lodging.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

          {/* Vacancy Badge */}
          {isAvailable ? (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-green-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
              残 {lodging.vacancies} 室
            </div>
          ) : (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-red-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
              満室
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
              {lodging.name}
            </h3>
            <div className="flex items-center text-slate-500 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5 flex-shrink-0 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="line-clamp-1">{lodging.address}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">{lodging.description}</p>

          {/* Facilities */}
          <div className="flex flex-wrap gap-2 mb-6">
            {lodging.facilities.slice(0, 3).map((facility, index) => (
              <span
                key={index}
                className="inline-flex items-center text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium"
              >
                {facility}
              </span>
            ))}
            {lodging.facilities.length > 3 && (
              <span className="inline-flex items-center text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">
                +{lodging.facilities.length - 3}
              </span>
            )}
          </div>

          {/* Price and Action */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">1泊あたり</span>
              <span className="text-2xl font-bold text-slate-800">
                ¥{lodging.price_per_night.toLocaleString()}
                <span className="text-sm font-normal text-slate-500 ml-1">~</span>
              </span>
            </div>
            <div className="flex items-center text-sm font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
              詳細を見る
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
