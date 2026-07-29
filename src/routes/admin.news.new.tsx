import { createFileRoute } from '@tanstack/react-router'

import { ArticleForm } from '#/components/site/article-form'

export const Route = createFileRoute('/admin/news/new')({
  component: () => <ArticleForm />,
  head: () => ({
    meta: [{ title: 'Smilekrub Network | เขียนข่าวใหม่' }],
  }),
})
