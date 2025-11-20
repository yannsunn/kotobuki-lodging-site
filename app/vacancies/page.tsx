import VacanciesClient from './VacanciesClient'
import { createClient } from '@/lib/supabase/server'

export default async function VacanciesPage() {
  const supabase = await createClient()

  // Supabaseから全宿泊所を取得
  const { data: lodgings } = await supabase
    .from('lodgings')
    .select('*')
    .eq('is_published', true)
    .order('vacancies', { ascending: false })

  return <VacanciesClient lodgings={lodgings || []} />
}
