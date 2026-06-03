export interface Category {
  id: string
  slug: string
  name: string
  description: string
  display_order: number
  nominee_count?: number
  created_at?: string
  updated_at?: string
}

export interface Nominee {
  id: string
  category_id: string
  name: string
  description: string
  image_url: string | null
  display_order: number
  created_at?: string
  updated_at?: string
}

export interface CategoryWithNominees extends Category {
  nominees: Nominee[]
}

export interface NomineeWithCategory extends Nominee {
  category: Pick<Category, 'id' | 'slug' | 'name'>
}

export interface VoteResultsPayload {
  stats: {
    totalVotes: number
    uniqueVoters: number
    categoriesCount: number
    lastVoteAt: string | null
  }
  results: Array<{
    id: string
    slug: string
    name: string
    totalVotes: number
    nominees: Array<{
      id: string
      name: string
      imageUrl: string | null
      votes: number
      percentage: number
    }>
  }>
}
