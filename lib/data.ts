export interface Lodging {
  id: string
  name: string
  address: string
  phone: string
  capacity: number
  vacancies: number
  pricePerNight: number
  facilities: string[]
  description: string
  imageUrl: string
  latitude: number
  longitude: number
  lastUpdated: string
}

export interface Service {
  id: string
  name: string
  category: 'welfare' | 'medical' | 'employment' | 'other'
  address: string
  phone: string
  description: string
  latitude: number
  longitude: number
}

export const lodgings: Lodging[] = [
  {
    id: '1',
    name: 'ホテル寿荘',
    address: '神奈川県横浜市中区寿町1-1-1',
    phone: '045-123-4567',
    capacity: 50,
    vacancies: 5,
    pricePerNight: 1800,
    facilities: ['個室', '共同浴場', 'Wi-Fi', '冷暖房完備'],
    description: '清潔で快適な個室をご提供。24時間フロント対応で安心してご利用いただけます。',
    imageUrl: '/images/lodging-1.jpg',
    latitude: 35.4437,
    longitude: 139.6380,
    lastUpdated: '2025-11-06'
  },
  {
    id: '2',
    name: 'グリーンハウス寿',
    address: '神奈川県横浜市中区寿町1-2-3',
    phone: '045-234-5678',
    capacity: 30,
    vacancies: 8,
    pricePerNight: 1500,
    facilities: ['相部屋', '共同浴場', '食堂', 'ランドリー'],
    description: '手頃な価格で温かい雰囲気。長期滞在も歓迎いたします。',
    imageUrl: '/images/lodging-2.jpg',
    latitude: 35.4440,
    longitude: 139.6385,
    lastUpdated: '2025-11-06'
  },
  {
    id: '3',
    name: '第一寿ハウス',
    address: '神奈川県横浜市中区寿町2-1-5',
    phone: '045-345-6789',
    capacity: 40,
    vacancies: 2,
    pricePerNight: 2000,
    facilities: ['個室', '共同浴場', 'Wi-Fi', '食事提供', '洗濯機'],
    description: '駅から徒歩3分の好立地。就労支援サービスとの連携もあります。',
    imageUrl: '/images/lodging-3.jpg',
    latitude: 35.4445,
    longitude: 139.6390,
    lastUpdated: '2025-11-05'
  },
  {
    id: '4',
    name: 'さくら荘',
    address: '神奈川県横浜市中区寿町2-3-7',
    phone: '045-456-7890',
    capacity: 25,
    vacancies: 10,
    pricePerNight: 1600,
    facilities: ['個室', '共同浴場', 'テレビ', '冷蔵庫'],
    description: '女性専用フロアあり。安心・安全な環境を提供します。',
    imageUrl: '/images/lodging-4.jpg',
    latitude: 35.4435,
    longitude: 139.6375,
    lastUpdated: '2025-11-06'
  },
  {
    id: '5',
    name: 'コミュニティハウス寿',
    address: '神奈川県横浜市中区寿町3-2-1',
    phone: '045-567-8901',
    capacity: 60,
    vacancies: 15,
    pricePerNight: 1400,
    facilities: ['相部屋', '共同浴場', '共同キッチン', 'ランドリー', '談話室'],
    description: '交流を大切にするコミュニティ型宿泊所。各種相談にも対応します。',
    imageUrl: '/images/lodging-5.jpg',
    latitude: 35.4450,
    longitude: 139.6395,
    lastUpdated: '2025-11-05'
  },
  {
    id: '6',
    name: 'ニュー寿ホテル',
    address: '神奈川県横浜市中区寿町3-4-2',
    phone: '045-678-9012',
    capacity: 35,
    vacancies: 0,
    pricePerNight: 2200,
    facilities: ['個室', '専用浴室', 'Wi-Fi', 'エアコン', 'テレビ'],
    description: '全室個室・専用浴室付き。プライバシーを重視される方におすすめ。',
    imageUrl: '/images/lodging-6.jpg',
    latitude: 35.4455,
    longitude: 139.6400,
    lastUpdated: '2025-11-06'
  },
  {
    id: '7',
    name: 'サンライズ寿',
    address: '神奈川県横浜市中区寿町1-5-8',
    phone: '045-789-0123',
    capacity: 45,
    vacancies: 7,
    pricePerNight: 1700,
    facilities: ['個室', '共同浴場', 'Wi-Fi', '食堂', '自動販売機'],
    description: '明るく清潔な施設。生活保護受給中の方もご相談ください。',
    imageUrl: '/images/lodging-7.jpg',
    latitude: 35.4442,
    longitude: 139.6382,
    lastUpdated: '2025-11-06'
  },
  {
    id: '8',
    name: '寿ビジネスホテル',
    address: '神奈川県横浜市中区寿町2-6-4',
    phone: '045-890-1234',
    capacity: 55,
    vacancies: 12,
    pricePerNight: 2500,
    facilities: ['個室', '専用浴室', 'Wi-Fi', 'デスク', 'エアコン', '冷蔵庫'],
    description: '仕事を探している方に最適。インターネット環境完備で就活もサポート。',
    imageUrl: '/images/lodging-8.jpg',
    latitude: 35.4448,
    longitude: 139.6388,
    lastUpdated: '2025-11-05'
  }
]

export const services: Service[] = [
  {
    id: 's1',
    name: '寿生活館',
    category: 'welfare',
    address: '神奈川県横浜市中区寿町1-3-2',
    phone: '045-111-2222',
    description: '生活相談、就労支援、福祉制度の案内などを行っています。',
    latitude: 35.4438,
    longitude: 139.6378
  },
  {
    id: 's2',
    name: '寿地区センター',
    category: 'welfare',
    address: '神奈川県横浜市中区寿町2-2-1',
    phone: '045-222-3333',
    description: '地域の交流拠点。各種イベントや相談会を開催しています。',
    latitude: 35.4443,
    longitude: 139.6383
  },
  {
    id: 's3',
    name: 'よこはま夢ファンド',
    category: 'employment',
    address: '神奈川県横浜市中区寿町1-4-3',
    phone: '045-333-4444',
    description: '就労支援、職業訓練、求人紹介を行っています。',
    latitude: 35.4441,
    longitude: 139.6381
  },
  {
    id: 's4',
    name: '寿診療所',
    category: 'medical',
    address: '神奈川県横浜市中区寿町2-4-5',
    phone: '045-444-5555',
    description: '地域の医療を支える診療所。内科・外科に対応しています。',
    latitude: 35.4446,
    longitude: 139.6386
  },
  {
    id: 's5',
    name: 'コトブキ調剤薬局',
    category: 'medical',
    address: '神奈川県横浜市中区寿町2-4-6',
    phone: '045-555-6666',
    description: '寿診療所の処方箋に対応。健康相談も受け付けています。',
    latitude: 35.4447,
    longitude: 139.6387
  },
  {
    id: 's6',
    name: '横浜市寿福祉プラザ',
    category: 'welfare',
    address: '神奈川県横浜市中区寿町3-1-1',
    phone: '045-666-7777',
    description: '福祉サービスの総合窓口。各種申請手続きのサポートを行います。',
    latitude: 35.4449,
    longitude: 139.6391
  },
  {
    id: 's7',
    name: 'ことぶき協働スペース',
    category: 'other',
    address: '神奈川県横浜市中区寿町1-6-2',
    phone: '045-777-8888',
    description: '地域活動の拠点。フリースペース、会議室の利用ができます。',
    latitude: 35.4444,
    longitude: 139.6384
  },
  {
    id: 's8',
    name: '中区福祉保健センター',
    category: 'welfare',
    address: '神奈川県横浜市中区日本大通35',
    phone: '045-224-8181',
    description: '生活保護、介護保険、障害福祉などの相談窓口です。',
    latitude: 35.4461,
    longitude: 139.6427
  }
]

export function getLodgingById(id: string): Lodging | undefined {
  return lodgings.find(l => l.id === id)
}

export function getAvailableLodgings(): Lodging[] {
  return lodgings.filter(l => l.vacancies > 0).sort((a, b) => b.vacancies - a.vacancies)
}

export function getServicesByCategory(category: Service['category']): Service[] {
  return services.filter(s => s.category === category)
}
