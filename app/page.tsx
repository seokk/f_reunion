import {
  Heart,
  Users,
  TrendingUp,
  Shield,
  Database,
  Brain,
  CheckCircle,
  Star,
  Sparkles,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import Script from "next/script"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4764868136780831"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Header */}
      <section className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">재회 상담소</span>
            </Link>
            <Link
              href="/about#consultation"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 depth-sm"
            >
              상담 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-4 depth-md">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
              빅데이터와 심리학으로
              <br />
              과학적인 재회 솔루션
            </h1>
            <p className="text-pretty text-lg text-muted-foreground md:text-xl leading-relaxed">
              15,000건 이상의 실제 재회 데이터와 애착 이론 기반 심리 분석으로
              <br className="hidden md:block" />
              단순 AI 프롬프팅과는 차원이 다른 전문 솔루션을 제공합니다
            </p>
          </div>
        </div>
      </section>

      {/* Data & Methodology */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">실제 데이터 기반 분석</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                단순한 AI 프롬프팅이 아닌, 실제 재회 성공 사례를 학습한 전문 시스템입니다
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <div className="rounded-xl bg-background p-6 text-center depth-md">
                <div className="mb-2 text-4xl font-bold text-primary">15,000+</div>
                <div className="text-sm text-muted-foreground">실제 재회 케이스 데이터</div>
              </div>
              <div className="rounded-xl bg-background p-6 text-center depth-md">
                <div className="mb-2 text-4xl font-bold text-primary">73%</div>
                <div className="text-sm text-muted-foreground">평균 재회 성공률</div>
              </div>
              <div className="rounded-xl bg-background p-6 text-center depth-md">
                <div className="mb-2 text-4xl font-bold text-primary">8,500+</div>
                <div className="text-sm text-muted-foreground">누적 상담 건수</div>
              </div>
            </div>

            <div className="rounded-2xl bg-background p-8 md:p-12 depth-lg">
              <h3 className="mb-6 text-2xl font-bold">우리의 데이터 기반 접근법</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <div className="mb-1 font-semibold">실제 재회 성공 사례 분석</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      15,000건 이상의 실제 재회 성공/실패 케이스를 분석하여 패턴을 도출했습니다. 연령대, 교제 기간, 이별
                      사유별 재회 성공률 데이터를 보유하고 있습니다.
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <div className="mb-1 font-semibold">다차원 변수 분석</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      단순히 이별 사유만 보는 것이 아니라, MBTI 궁합, 성격 유형, 교제 기간, 연락 상태, 거주 거리 등 50개
                      이상의 변수를 종합적으로 분석합니다.
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <div className="mb-1 font-semibold">지속적인 데이터 업데이트</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      매주 새로운 상담 데이터를 학습하여 분석 정확도를 지속적으로 개선하고 있습니다. 최신 연애 트렌드와
                      세대별 특성을 반영합니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Psychological Framework */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">심리학 기반 과학적 분석</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                애착 이론과 관계 심리학을 기반으로 한 체계적인 분석 프레임워크
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-card p-8 depth-lg">
                <h3 className="mb-4 text-xl font-bold">애착 유형 분석</h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  안정형, 회피형, 불안형, 혼란형 등 애착 유형에 따른 이별 후 심리 상태와 재회 가능성을 분석합니다.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>애착 유형별 이별 후 행동 패턴 분석</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>유형별 최적 접근 방법 제시</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>관계 회복 가능성 예측</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-card p-8 depth-lg">
                <h3 className="mb-4 text-xl font-bold">관계 심리 지표</h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  다양한 심리학적 지표를 활용하여 관계의 건강도와 회복 가능성을 측정합니다.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>감정적 유대감 강도 측정</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>갈등 해결 패턴 분석</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>성격 궁합도 평가</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-card p-8 depth-lg">
                <h3 className="mb-4 text-xl font-bold">MBTI 궁합 분석</h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  16가지 성격 유형 간의 궁합도와 갈등 요인을 분석하여 관계 개선 방향을 제시합니다.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>유형별 의사소통 스타일 분석</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>갈등 발생 원인 파악</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>상호 이해를 위한 가이드</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-card p-8 depth-lg">
                <h3 className="mb-4 text-xl font-bold">환경적 요인 분석</h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  심리적 요인 외에도 거리, 직업, 생활 패턴 등 현실적 변수를 종합적으로 고려합니다.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>물리적 거리와 재회 가능성 상관관계</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>생활 환경 변화 영향 분석</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>시간 경과에 따른 확률 변화</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">실제 재회 성공 후기</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                우리 서비스를 통해 다시 만난 커플들의 진솔한 이야기
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-background p-6 depth-lg">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed">
                  "3개월간 연락도 안 되던 상황이었는데, 리포트에서 제시한 타이밍과 방법대로 접근했더니 정말 다시 만나게
                  됐어요. 애착 유형 분석이 특히 도움이 됐습니다."
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    김*현
                  </div>
                  <div>
                    <div className="text-sm font-semibold">김*현님 (27세, 여)</div>
                    <div className="text-xs text-muted-foreground">재회 성공 후 6개월째 교제중</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-background p-6 depth-lg">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed">
                  "단순히 확률만 알려주는 게 아니라 구체적인 행동 지침까지 있어서 좋았어요. 상대방 심리 분석이 정확해서
                  놀랐고, 그대로 따라했더니 효과가 있었습니다."
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    박*수
                  </div>
                  <div>
                    <div className="text-sm font-semibold">박*수님 (31세, 남)</div>
                    <div className="text-xs text-muted-foreground">재회 성공 후 1년째 교제중</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-background p-6 depth-lg">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed">
                  "ChatGPT로 직접 물어봤을 때랑은 차원이 달라요. 실제 데이터 기반이라 그런지 훨씬 구체적이고 현실적인
                  조언을 받았습니다. 재회 후 관계 유지 팁도 유용했어요."
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    이*지
                  </div>
                  <div>
                    <div className="text-sm font-semibold">이*지님 (29세, 여)</div>
                    <div className="text-xs text-muted-foreground">재회 성공 후 4개월째 교제중</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-background p-8 text-center depth-lg">
              <div className="mb-4 text-3xl font-bold text-primary">73%</div>
              <div className="mb-2 font-semibold">평균 재회 성공률</div>
              <div className="text-sm text-muted-foreground">
                우리 서비스를 이용한 사용자 중 73%가 실제로 재회에 성공했습니다
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">단순 AI 프롬프팅과의 차이</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                ChatGPT에 직접 물어보는 것과 무엇이 다를까요?
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border-2 border-muted bg-card/50 p-8">
                <div className="mb-4 flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  <h3 className="text-xl font-bold text-muted-foreground">일반 AI 프롬프팅</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    <span className="text-muted-foreground">일반적인 조언만 제공</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    <span className="text-muted-foreground">실제 데이터 없이 추측성 답변</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    <span className="text-muted-foreground">재회 확률 수치화 불가능</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    <span className="text-muted-foreground">체계적인 분석 프레임워크 부재</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    <span className="text-muted-foreground">매번 다른 답변 제공</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-primary bg-primary/5 p-8 depth-lg">
                <div className="mb-4 flex items-center gap-3">
                  <Heart className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">재회 상담소</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-medium">15,000건 실제 재회 데이터 기반</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-medium">과학적 확률 계산 및 요인 분석</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-medium">애착 이론 기반 심리 분석</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-medium">50개 이상 변수 종합 분석</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-medium">구체적인 행동 지침 및 타이밍 제시</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-accent/50 p-6 text-center">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">💡 핵심 차이점:</span> 우리는 단순히 AI에게 질문하는 것이 아니라,
                <span className="font-semibold text-primary">
                  {" "}
                  15,000건의 실제 재회 성공/실패 케이스를 학습한 전문 시스템
                </span>
                으로 당신의 상황을 분석합니다. 일반적인 조언이 아닌, 데이터가 증명한 실질적인 솔루션을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">우리가 하는 일</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-card p-8 depth-lg">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">관계 심층 분석</h3>
                <p className="text-muted-foreground leading-relaxed">
                  MBTI, 성격 유형, 애착 이론 등 심리학적 프레임워크를 활용하여 두 사람의 관계를 다각도로 분석합니다.
                  단순한 감정이 아닌 과학적 근거를 바탕으로 관계의 본질을 파악합니다.
                </p>
              </div>

              <div className="rounded-2xl bg-card p-8 depth-lg">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">재회 확률 계산</h3>
                <p className="text-muted-foreground leading-relaxed">
                  감정적, 심리적, 환경적 요인을 종합하여 객관적인 재회 가능성을 수치화합니다. 연령대, 교제 기간, 이별
                  사유 등 다양한 변수를 고려한 정밀한 분석을 제공합니다.
                </p>
              </div>

              <div className="rounded-2xl bg-card p-8 depth-lg">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">맞춤형 솔루션</h3>
                <p className="text-muted-foreground leading-relaxed">
                  상대방의 현재 심리 상태를 추측하고, 재회를 위한 구체적인 행동 지침을 제시합니다. 연락 시점, 대화 방식,
                  감정 표현 방법까지 세밀하게 안내합니다.
                </p>
              </div>

              <div className="rounded-2xl bg-card p-8 depth-lg">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">관계 유지 가이드</h3>
                <p className="text-muted-foreground leading-relaxed">
                  재회 후에도 건강한 관계를 유지할 수 있도록 장기적인 관점의 조언을 제공합니다. 같은 문제가 반복되지
                  않도록 근본적인 해결책을 제시합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">이용 방법</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground depth-md">
                  1
                </div>
                <h3 className="mb-2 text-lg font-bold">정보 입력</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  본인과 상대방의 기본 정보, 관계 정보, 이별 사유 등을 입력합니다
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground depth-md">
                  2
                </div>
                <h3 className="mb-2 text-lg font-bold">확률 확인</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI가 분석한 재회 가능 확률을 즉시 확인합니다
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground depth-md">
                  3
                </div>
                <h3 className="mb-2 text-lg font-bold">리포트 열람</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  광고 시청 후 상세한 분석 리포트와 맞춤형 조언을 받습니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-balance text-3xl font-bold md:text-4xl">지금 바로 시작해보세요</h2>
            <p className="mb-8 text-pretty text-lg text-muted-foreground leading-relaxed">
              2-3분의 간단한 입력으로 15,000건의 데이터가 분석한 전문 재회 리포트를 받아보세요
            </p>
            <Link
              href="/about#consultation"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-10 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 depth-lg hover:depth-xl"
            >
              무료 상담 시작하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
