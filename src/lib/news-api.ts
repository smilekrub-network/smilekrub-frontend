import { apiJson } from '#/lib/api-client'

export type ArticleStatus = 'DRAFT' | 'PUBLISHED'

/** Row shape returned by the list endpoints (no full `content`). */
export interface NewsListItem {
  id: string
  slug: string
  title: string
  subtitle: string | null
  coverImageUrl: string | null
  category: string
  tags: Array<string>
  status: ArticleStatus
  publishedAt: string | null
  authorName: string
  excerpt: string
  createdAt: string
  updatedAt: string
}

export interface NewsArticle extends Omit<NewsListItem, 'excerpt'> {
  content: string
  contentText: string
  authorUserId: string | null
  metaTitle: string | null
  metaDescription: string | null
}

export interface NewsListResult {
  items: Array<NewsListItem>
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface TagCount {
  tag: string
  count: number
}

export interface ArticleInput {
  title: string
  slug?: string
  subtitle?: string | null
  coverImageUrl?: string | null
  content?: string
  category?: string
  tags?: Array<string>
  status?: ArticleStatus
  publishedAt?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
}

function queryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

// --- admin ---------------------------------------------------------------

export function listAdminNews(params: {
  page?: number
  perPage?: number
  q?: string
  tag?: string
  status?: ArticleStatus
}) {
  return apiJson<NewsListResult>(`/api/admin/news${queryString(params)}`)
}

export function getAdminArticle(id: string) {
  return apiJson<NewsArticle>(`/api/admin/news/${id}`)
}

export function createArticle(body: ArticleInput) {
  return apiJson<NewsArticle>('/api/admin/news', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/** PATCH accepts any subset — the backend merges against the stored row. */
export function updateArticle(id: string, body: Partial<ArticleInput>) {
  return apiJson<NewsArticle>(`/api/admin/news/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function deleteArticle(id: string) {
  return apiJson<{ ok: true }>(`/api/admin/news/${id}`, { method: 'DELETE' })
}
