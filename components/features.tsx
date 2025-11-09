import { Brain, Heart, MessageCircle, TrendingUp } from "lucide-react"

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">왜 재회 상담소인가요?</h2>
            <p className="text-lg text-muted-foreground">심리학 기반의 과학적 분석으로 정확한 진단을 제공합니다</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-6 depth-lg transition-all hover:depth-xl">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">심리학 기반 분석</h3>
              <p className="text-muted-foreground leading-relaxed">
                MBTI, 애착 이론, 성격 유형 등 검증된 심리학 프레임워크를 활용하여 관계를 분석합니다
              </p>
            </div>

            <div className="rounded-2xl bg-card p-6 depth-lg transition-all hover:depth-xl">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">정확한 확률 계산</h3>
              <p className="text-muted-foreground leading-relaxed">
                감정적, 심리적, 환경적 요인을 종합하여 객관적인 재회 가능성을 수치화합니다
              </p>
            </div>

            <div className="rounded-2xl bg-card p-6 depth-lg transition-all hover:depth-xl">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">맞춤형 솔루션</h3>
              <p className="text-muted-foreground leading-relaxed">
                당신의 상황에 맞는 구체적인 행동 지침과 대화 전략을 제시합니다
              </p>
            </div>

            <div className="rounded-2xl bg-card p-6 depth-lg transition-all hover:depth-xl">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">장기적 관점</h3>
              <p className="text-muted-foreground leading-relaxed">
                재회 후 건강한 관계를 유지할 수 있도록 지속적인 가이드를 제공합니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
