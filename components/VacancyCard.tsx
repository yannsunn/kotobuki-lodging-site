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
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full opacity-100">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={lodging.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay for better badge visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {/* Vacancy Badge */}
          {isAvailable ? (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              空室 {lodging.vacancies}室
            </div>
          ) : (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              満室
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{lodging.name}</h3>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>{lodging.address}</span>
            </div>

            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              <span className="font-semibold text-primary-600">¥{lodging.price_per_night.toLocaleString()}/泊</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lodging.description}</p>

          {/* Facilities */}
          <div className="flex flex-wrap gap-2">
            {lodging.facilities.slice(0, 3).map((facility, index) => (
              <span
                key={index}
                className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded"
              >
                {facility}
              </span>
            ))}
            {lodging.facilities.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                +{lodging.facilities.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
