import type { Metadata } from 'next'
import { PolicyMarkdown } from '@/components/policy-markdown'
import { getPolicySourceText } from '@/lib/policy-text'

export const metadata: Metadata = {
  title: '개인정보처리방침 | 다시만날',
  description: '다시만날 서비스의 개인정보 수집, 이용, 보관 및 권리 행사 방법을 안내합니다.',
}

export default async function PrivacyPage() {
  const { privacy } = await getPolicySourceText()

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <PolicyMarkdown text={privacy} />
      </div>
    </main>
  )
}
