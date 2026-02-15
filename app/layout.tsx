import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '다시만날 | 재회 상담소',
  description:
    '심리학과 데이터 기반으로 재회 가능성을 분석하고 맞춤형 행동 가이드를 제공하는 다시만날 재회 상담소입니다.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head />
      <body className={`font-sans antialiased`}>
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
