import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Newspaper } from 'lucide-react'

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ArticleForm } from '#/components/site/article-form'
import { getAdminArticle } from '#/lib/news-api'
import type { NewsArticle } from '#/lib/news-api'

export const Route = createFileRoute('/admin/news/$articleId')({
  component: EditArticle,
  head: () => ({
    meta: [{ title: 'Smilekrub Network | แก้ไขข่าว' }],
  }),
})

function EditArticle() {
  const { articleId } = Route.useParams()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading')

  useEffect(() => {
    let cancelled = false

    void getAdminArticle(articleId).then((res) => {
      if (cancelled) return
      if (!res.ok) {
        setState('missing')
        return
      }
      setArticle(res.data)
      setState('ready')
    })

    return () => {
      cancelled = true
    }
  }, [articleId])

  if (state === 'loading') {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  if (state === 'missing' || !article) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Newspaper />
          </EmptyMedia>
          <EmptyTitle>ไม่พบบทความนี้</EmptyTitle>
          <EmptyDescription>บทความอาจถูกลบไปแล้ว</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  // Remount when a different article loads so the form re-seeds its state.
  return <ArticleForm key={article.id} article={article} />
}
