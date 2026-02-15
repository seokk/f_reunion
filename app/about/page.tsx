import { Hero } from '@/components/hero'
import { ConsultationForm } from '@/components/consultation-form'

const faqItems = [
  {
    q: '재회 확률 결과는 정확히 맞나요?',
    a: '결과는 실제 사례와 심리학 지표를 바탕으로 계산한 참고 지표이며, 실제 결과를 보장하지 않습니다.',
  },
  {
    q: '입력한 정보는 어떻게 사용되나요?',
    a: '서비스 분석 제공 및 품질 개선 범위에서 최소한으로 활용되며, 상세 기준은 개인정보처리방침에서 확인할 수 있습니다.',
  },
  {
    q: '누가 이 서비스를 사용하면 좋나요?',
    a: '이별 이후 재회 가능성과 행동 방향을 구조적으로 정리하고 싶은 이용자에게 적합합니다.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />

      <section className="py-12 md:py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border bg-background p-5">
              <h2 className="text-base font-semibold">운영 원칙</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                실제 상담 데이터와 관계 심리학 이론을 기반으로 분석하며, 과장된 성공 보장 표현을 사용하지 않습니다.
              </p>
            </div>
            <div className="rounded-xl border bg-background p-5">
              <h2 className="text-base font-semibold">콘텐츠 품질</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                결과 수치뿐 아니라 해석 기준, 행동 가이드, 주의사항을 함께 제공해 실질적인 의사결정에 도움이 되도록 구성합니다.
              </p>
            </div>
            <div className="rounded-xl border bg-background p-5">
              <h2 className="text-base font-semibold">문의 및 정책</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                개인정보처리방침과 이용약관은 사이트 하단에서 항상 확인할 수 있으며, 문의는
                againmeet2026@gmail.com으로 접수받습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="consultation" className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2">지금 바로 시작하세요</p>
            <h2 className="text-2xl md:text-3xl font-bold text-balance">당신의 재회 가능성을 확인해보세요</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              입력한 데이터는 분석 결과 생성에 사용되며, 결과는 참고용 정보입니다. 서비스 이용 전 하단의
              개인정보처리방침/이용약관을 함께 확인해 주세요.
            </p>
          </div>
          <ConsultationForm />
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold md:text-3xl">자주 묻는 질문</h2>
            <div className="mt-6 space-y-4">
              {faqItems.map((item) => (
                <article key={item.q} className="rounded-xl border bg-background p-5">
                  <h3 className="text-base font-semibold">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
