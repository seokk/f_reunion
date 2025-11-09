import { Heart, TrendingUp, Users, Brain } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">재회 상담소</span>
            </div>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              서비스 소개
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-8 pb-12 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-8 md:mb-12">
            <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs md:text-sm font-medium text-primary">
              <Heart className="h-4 w-4" />
              <span>15,000개의 재회 사례 기반 분석</span>
            </div>

            <h1 className="mb-4 text-3xl md:text-5xl font-bold tracking-tight text-balance">
              헤어진 연인,
              <br className="md:hidden" /> 다시 만날 수 있을까?
            </h1>

            <p className="text-base md:text-lg text-muted-foreground text-pretty mb-6 leading-relaxed">
              심리학 기반 분석으로 당신의 재회 확률을 정확하게 예측하고,
              <br className="hidden md:inline" />
              맞춤형 솔루션을 제공합니다
            </p>

            <div className="text-sm text-muted-foreground">⏱️ 단 2-3분이면 완료 | 📊 정확한 데이터 분석</div>
          </div>

          {/* Stats Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-nowrap overflow-x-auto gap-3 md:gap-4 md:grid md:grid-cols-3 pb-2 md:pb-0">
              <div className="rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 p-4 border border-accent/20 flex-shrink-0 md:flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span className="text-xs font-medium text-muted-foreground">분석 사례</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold">15,000+</p>
                <p className="text-xs text-muted-foreground mt-1">실제 재회 데이터</p>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-emerald-100/40 to-emerald-50/40 p-4 border border-emerald-200/40 flex-shrink-0 md:flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-medium text-muted-foreground">분석 항목</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold">50+</p>
                <p className="text-xs text-muted-foreground mt-1">심리학 기반 지표</p>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-4 border border-primary/20 flex-shrink-0 md:flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">전문 분석</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold">50+</p>
                <p className="text-xs text-muted-foreground mt-1">정밀한 지표</p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="flex flex-nowrap overflow-x-auto gap-3 md:gap-4 md:grid md:grid-cols-3 pb-2 md:pb-0">
            <div className="rounded-lg border bg-card p-4 md:p-6 hover:border-primary/50 transition-colors flex-shrink-0 md:flex-shrink-0">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">감정 분석</h3>
              <p className="text-sm text-muted-foreground">당신과 상대방의 감정 상태를 정확히 분석합니다</p>
            </div>

            <div className="rounded-lg border bg-card p-4 md:p-6 hover:border-primary/50 transition-colors flex-shrink-0 md:flex-shrink-0">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">재회 솔루션</h3>
              <p className="text-sm text-muted-foreground">상황에 맞는 구체적인 액션 플랜을 제시합니다</p>
            </div>

            <div className="rounded-lg border bg-card p-4 md:p-6 hover:border-primary/50 transition-colors flex-shrink-0 md:flex-shrink-0">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100/40">
                <Brain className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-2">심리학 기반</h3>
              <p className="text-sm text-muted-foreground">애착 이론과 관계 심리학을 기반으로 분석합니다</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
