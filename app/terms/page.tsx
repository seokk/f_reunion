import type { Metadata } from 'next'
import { PolicyMarkdown } from '@/components/policy-markdown'
import { getPolicySourceText } from '@/lib/policy-text'

export const metadata: Metadata = {
  title: '이용약관 | 다시만날',
  description: '다시만날 서비스 이용자의 권리, 의무 및 책임사항을 안내합니다.',
}

export default async function TermsPage() {
  const { terms } = await getPolicySourceText()

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <PolicyMarkdown text={terms} />
      </div>
    </main>
  )
}
