import Link from 'next/link'
import { Instagram, Send } from 'lucide-react'

export function SiteFooter() {
  const instagramDmUrl = process.env.NEXT_PUBLIC_INSTAGRAM_DM_URL
  const telegramDmUrl = process.env.NEXT_PUBLIC_TELEGRAM_DM_URL

  return (
    <footer className="border-t bg-card/40">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold">다시만날 재회 상담소</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              본 서비스의 분석 결과는 참고용 정보이며 실제 결과를 보장하지 않습니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
              서비스 소개
            </Link>
            <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
              상담 시작
            </Link>
            <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-primary">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-muted-foreground transition-colors hover:text-primary">
              이용약관
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
          <p>문의: againmeet2026@gmail.com</p>
          {(instagramDmUrl || telegramDmUrl) && (
            <div className="mt-2 flex items-center gap-3">
              {instagramDmUrl && (
                <a
                  href={instagramDmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="인스타그램 문의"
                  className="transition-colors hover:text-primary"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {telegramDmUrl && (
                <a
                  href={telegramDmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="텔레그램 문의"
                  className="transition-colors hover:text-primary"
                >
                  <Send className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
          <p className="mt-1">© {new Date().getFullYear()} 다시만날. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
