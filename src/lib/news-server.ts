import { createServerFn } from '@tanstack/react-start'

import { API_URL } from '#/lib/auth-client'
import type { NewsArticle, NewsListResult, TagCount } from '#/lib/news-api'

/**
 * Public news reads run through server functions so the list and article pages
 * are server-rendered — which is what makes the per-article SEO meta tags
 * (NEWS-05) show up in the initial HTML rather than after hydration.
 */

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return fallback
    return (await res.json()) as T
  } catch {
    return fallback
  }
}

const EMPTY_LIST: NewsListResult = {
  items: [],
  page: 1,
  perPage: 9,
  total: 0,
  totalPages: 1,
}

export const fetchNewsList = createServerFn({ method: 'GET' })
  .validator(
    (input: { page?: number; perPage?: number; q?: string; tag?: string }) => input,
  )
  .handler(async ({ data }): Promise<NewsListResult> => {
    const search = new URLSearchParams()
    if (data.page) search.set('page', String(data.page))
    if (data.perPage) search.set('perPage', String(data.perPage))
    if (data.q) search.set('q', data.q)
    if (data.tag) search.set('tag', data.tag)

    return getJson(`/api/news?${search.toString()}`, EMPTY_LIST)
  })

export const fetchNewsTags = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<TagCount>> => getJson('/api/news/tags', []),
)

export const fetchArticleBySlug = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data }): Promise<NewsArticle | null> =>
    getJson<NewsArticle | null>(`/api/news/${encodeURIComponent(data)}`, null),
  )
