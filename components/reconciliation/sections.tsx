import type { LucideIcon } from "lucide-react"
import {
  Brain,
  Clock,
  Heart,
  Instagram,
  Lock,
  MessageCircle,
  Play,
  Send,
  Target,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ReunionAnalysis } from "@/lib/api"

interface ReportHeaderProps {
  probability: number
  level: string
  levelColor: string
  levelBgColor: string
  hasWatchedAd: boolean
  hasAnalysis: boolean
}

export function ReportHeader({
  probability,
  level,
  levelColor,
  levelBgColor,
  hasWatchedAd,
  hasAnalysis,
}: ReportHeaderProps) {
  return (
    <>
      <div className="text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 depth-md">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 md:mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-balance">재회 가능성 분석 리포트</h1>
        <p className="text-sm md:text-base text-muted-foreground">입력하신 정보를 바탕으로 AI와 심리학적 분석을 진행했습니다</p>
      </div>

      <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 p-6 md:p-8 depth-lg border-2">
        <div className="text-center">
          <p className="mb-2 text-xs md:text-sm font-medium text-muted-foreground">재회 가능 확률</p>
          <div className="mb-4 flex items-center justify-center gap-3 flex-wrap">
            <span className={`text-5xl md:text-6xl font-bold ${levelColor}`}>{probability}%</span>
            <div className={`rounded-full px-3 md:px-4 py-2 ${levelBgColor}`}>
              <span className={`text-lg md:text-xl font-semibold ${levelColor}`}>{level}</span>
            </div>
          </div>
          <Progress value={probability} className="h-3 depth-sm mb-4" />
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            {hasWatchedAd && hasAnalysis
              ? "AI 상세 분석 결과입니다."
              : "입력 정보를 바탕으로 한 예상치입니다. 광고 시청 후 AI 상세 분석을 확인하세요."}
          </p>
        </div>
      </Card>
    </>
  )
}

interface FactorCardProps {
  title: string
  icon: LucideIcon
  score: number
  scoreColor: string
  isUnlocked: boolean
  analysisText?: string
  showLockedHint?: boolean
}

export function FactorCard({
  title,
  icon: Icon,
  score,
  scoreColor,
  isUnlocked,
  analysisText,
  showLockedHint = false,
}: FactorCardProps) {
  return (
    <Card className="p-4 md:p-6 depth-md border">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-base md:text-lg font-semibold">{title}</h3>
      </div>
      {isUnlocked && analysisText ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xl md:text-2xl font-bold ${scoreColor}`}>{score}점</span>
          </div>
          <Progress value={score} className="h-2 mb-3" />
          <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">{analysisText}</div>
        </>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xl md:text-2xl font-bold ${scoreColor}`}>{score}%</span>
            {showLockedHint && <span className="text-xs text-muted-foreground">광고 시청 후 AI 상세 분석 제공</span>}
          </div>
          <Progress value={score} className="h-2" />
        </div>
      )}
    </Card>
  )
}

interface LockedOverlayProps {
  hasWatchedAd: boolean
  isWatchingAd: boolean
  adCountdown: number
  onWatchAd: () => void
}

export function LockedOverlay({ hasWatchedAd, isWatchingAd, adCountdown, onWatchAd }: LockedOverlayProps) {
  if (hasWatchedAd) {
    return null
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
      <div className="absolute inset-0 -m-4 backdrop-blur-md rounded-2xl" />
      <div className="relative w-full">
        <Card className="bg-background/80 p-6 md:p-8 text-center depth-xl border-2 shadow-2xl">
          <div className="mx-auto max-w-md space-y-4">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-balance">상세 분석 리포트 확인하기</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                짧은 광고를 시청하시면 각 요인별 상세 분석과 맞춤형 재회 솔루션을 무료로 확인하실 수 있습니다.
              </p>
            </div>
            <Button size="lg" className="w-full depth-md hover:depth-lg transition-all" onClick={onWatchAd} disabled={isWatchingAd}>
              {isWatchingAd ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  광고 시청 중... ({adCountdown}초)
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  광고 보고 전체 리포트 보기
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

interface PartnerPsychologyCardProps {
  analysis: ReunionAnalysis
}

export function PartnerPsychologyCard({ analysis }: PartnerPsychologyCardProps) {
  return (
    <Card className="p-4 md:p-6 md:p-8 depth-lg border">
      <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">상대방의 현재 심리 추측</h2>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h4 className="mb-2 font-semibold text-primary">이별 사유에 따른 상대방의 현재 상황</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysis.partner_psychology.breakup_reason_analysis}</p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-primary">상대방의 성격 키워드에 따른 현재 심리</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysis.partner_psychology.personality_analysis}</p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-primary">상대방은 현재 재회를 원하는 상태인가?</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysis.partner_psychology.reunion_willingness}</p>
        </div>
      </div>
    </Card>
  )
}

interface ActionPlanCardProps {
  analysis: ReunionAnalysis
}

export function ActionPlanCard({ analysis }: ActionPlanCardProps) {
  const items = [
    { title: "핵심 솔루션", text: analysis.reunion_requirements.solution, icon: Target },
    { title: "연락 시점", text: analysis.reunion_requirements.contact_timing, icon: Clock },
    { title: "접근 스탠스", text: analysis.reunion_requirements.approach_stance, icon: Users },
    { title: "연락 방법", text: analysis.reunion_requirements.contact_method, icon: MessageCircle },
  ]

  return (
    <Card className="p-4 md:p-6 md:p-8 depth-lg border">
      <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">재회를 위한 액션 플랜</h2>
      <div className="space-y-4 md:space-y-6">
        {items.map(({ title, text, icon: Icon }) => (
          <div className="flex gap-4" key={title}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="mb-2 font-semibold">{title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

interface FinalAdviceCardProps {
  analysis: ReunionAnalysis
}

export function FinalAdviceCard({ analysis }: FinalAdviceCardProps) {
  return (
    <Card className="p-4 md:p-6 md:p-8 depth-lg border">
      <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">최종 조언</h2>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h4 className="mb-2 font-semibold text-primary">어떤 접근 방식이 좋을까</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysis.final_advice.approach_method}</p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-primary">감정 표현은 어떻게 하는 게 좋을까</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysis.final_advice.emotion_expression}</p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-primary">어느 시점에 연락하는 게 좋을까</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysis.final_advice.optimal_timing}</p>
        </div>
      </div>
    </Card>
  )
}

export function ConsultationCtaCard() {
  const instagramDmUrl = process.env.NEXT_PUBLIC_INSTAGRAM_DM_URL
  const telegramDmUrl = process.env.NEXT_PUBLIC_TELEGRAM_DM_URL

  const hasContactLinks = Boolean(instagramDmUrl || telegramDmUrl)

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary to-accent p-8 text-center text-primary-foreground depth-xl border-0">
      <h3 className="mb-2 text-2xl font-bold text-balance">더 깊은 상담이 필요하신가요?</h3>
      <p className="mb-6 text-primary-foreground/90">지금 바로 1:1 상담 채널로 연결해 맞춤 조언을 받아보세요.</p>

      {hasContactLinks ? (
        <div className="flex items-center justify-center gap-4">
          {instagramDmUrl && (
            <div className="flex flex-col items-center gap-2">
              <Button
                asChild
                size="icon-lg"
                variant="secondary"
                className="rounded-full bg-background text-foreground hover:bg-background/90 depth-md hover:depth-lg transition-all"
              >
                <a href={instagramDmUrl} target="_blank" rel="noopener noreferrer" aria-label="인스타그램으로 상담하기">
                  <Instagram className="size-5" />
                </a>
              </Button>
              <span className="text-xs text-primary-foreground/90">Instagram</span>
            </div>
          )}
          {telegramDmUrl && (
            <div className="flex flex-col items-center gap-2">
              <Button
                asChild
                size="icon-lg"
                variant="secondary"
                className="rounded-full bg-background text-foreground hover:bg-background/90 depth-md hover:depth-lg transition-all"
              >
                <a href={telegramDmUrl} target="_blank" rel="noopener noreferrer" aria-label="텔레그램으로 상담하기">
                  <Send className="size-5" />
                </a>
              </Button>
              <span className="text-xs text-primary-foreground/90">Telegram</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-primary-foreground/90">
          운영자 설정 필요: <code>NEXT_PUBLIC_INSTAGRAM_DM_URL</code> 또는 <code>NEXT_PUBLIC_TELEGRAM_DM_URL</code>
        </p>
      )}
    </Card>
  )
}

export const factorIcons = {
  emotional: Heart,
  psychological: Brain,
  environmental: Users,
  other: Target,
}
