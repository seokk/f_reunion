"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Heart,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageCircle,
  Download,
  Lock,
  Play,
  Brain,
  Users,
  Target,
  Send,
  Star,
} from "lucide-react"
import { ReunionAnalysis } from "@/lib/api"

interface FormData {
  myGender: string
  myAge: string
  myMBTI: string
  myPersonalityPreset: string[]
  myPersonalityCustom: string
  myReligion: string
  partnerGender: string
  partnerAge: string
  partnerMBTI: string
  partnerPersonalityPreset: string[]
  partnerPersonalityCustom: string
  partnerReligion: string
  relationshipDuration: string
  breakupDate: string
  breakupReason: string
  breakupReasonDetail: string
  currentContact: string
  distance: string
  partnerCareer: string
  additionalInfo: string
}

interface ReconciliationReportProps {
  formData: FormData
  analysisResult: ReunionAnalysis | null
}

export function ReconciliationReport({ formData, analysisResult }: ReconciliationReportProps) {
  const [hasWatchedAd, setHasWatchedAd] = useState(false)
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)

  const [reviewName, setReviewName] = useState("")
  const [reviewStory, setReviewStory] = useState("")
  const [reviewContact, setReviewContact] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // This is a simplified client-side calculation for the initial view.
  const calculateFactors = () => {
    let emotional = 50,
      psychological = 50,
      environmental = 50,
      other = 50
    // Simplified logic for preview
    if (formData?.relationshipDuration.includes("y")) emotional += 15
    if (formData?.currentContact === "regular" || formData?.currentContact === "friends") environmental += 20
    if (formData?.myMBTI && formData?.partnerMBTI) psychological += 10
    return {
      emotional: Math.max(10, Math.min(95, emotional)),
      psychological: Math.max(10, Math.min(95, psychological)),
      environmental: Math.max(10, Math.min(95, environmental)),
      other: Math.max(10, Math.min(95, other)),
    }
  }

  const calculateProbability = () => {
    const factors = calculateFactors()
    return Math.round((factors.emotional + factors.psychological + factors.environmental + factors.other) / 4)
  }

  // Use AI analysis result after ad, otherwise use client-side calculation
  const clientFactors = calculateFactors()
  const aiFactors = analysisResult?.factor_analysis

  const factors =
    hasWatchedAd && aiFactors
      ? {
          emotional: Math.round(aiFactors.emotional.score),
          psychological: Math.round(aiFactors.psychological.score),
          environmental: Math.round(aiFactors.environmental.score),
          other: Math.round(aiFactors.other.score),
        }
      : clientFactors

  const probability =
    hasWatchedAd && analysisResult ? Math.round(analysisResult.overall_probability) : calculateProbability()

  const getProbabilityLevel = () => {
    if (probability >= 70)
      return { level: "높음", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" }
    if (probability >= 50)
      return { level: "보통", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" }
    return { level: "낮음", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" }
  }

  const getFactorLevel = (score: number) => {
    if (score >= 70) return { color: "text-green-600" }
    if (score >= 50) return { color: "text-yellow-600" }
    return { color: "text-red-600" }
  }

  const { level, color, bgColor } = getProbabilityLevel()

  const handleWatchAd = () => {
    setIsWatchingAd(true)
    setAdCountdown(5)
    const interval = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsWatchingAd(false)
          setHasWatchedAd(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmitReview = async () => {
    if (!reviewStory.trim()) {
      alert("재회 성공 스토리를 입력해주세요.")
      return
    }
    setIsSubmittingReview(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmittingReview(false)
    setReviewSubmitted(true)
  }

  return (
    <section className="py-8 md:py-16 lg:py-24">
      <div className="container mx-auto px-3 md:px-4">
        <div className="mx-auto max-w-4xl space-y-6 md:space-y-8">
          {/* --- ALWAYS VISIBLE PART --- */}
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 depth-md">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 md:mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-balance">
              재회 가능성 분석 리포트
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              입력하신 정보를 바탕으로 AI와 심리학적 분석을 진행했습니다
            </p>
          </div>

          <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 p-6 md:p-8 depth-lg border-2">
            <div className="text-center">
              <p className="mb-2 text-xs md:text-sm font-medium text-muted-foreground">재회 가능 확률</p>
              <div className="mb-4 flex items-center justify-center gap-3 flex-wrap">
                <span className={`text-5xl md:text-6xl font-bold ${color}`}>{probability}%</span>
                <div className={`rounded-full px-3 md:px-4 py-2 ${bgColor}`}>
                  <span className={`text-lg md:text-xl font-semibold ${color}`}>{level}</span>
                </div>
              </div>
              <Progress value={probability} className="h-3 depth-sm mb-4" />
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {hasWatchedAd && analysisResult
                  ? "AI 상세 분석 결과입니다."
                  : "입력 정보를 바탕으로 한 예상치입니다. 광고 시청 후 AI 상세 분석을 확인하세요."}
              </p>
            </div>
          </Card>

          <h2 className="text-xl md:text-2xl font-bold pt-4">재회 가능한 확률에 대한 요인 분석</h2>

          <Card className="p-4 md:p-6 depth-md border">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base md:text-lg font-semibold">감정적 요인</h3>
            </div>
            {hasWatchedAd && analysisResult ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.emotional).color}`}>
                    {factors.emotional}점
                  </span>
                </div>
                <Progress value={factors.emotional} className="h-2 mb-3" />
                <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {analysisResult.factor_analysis.emotional.analysis}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.emotional).color}`}>
                    {factors.emotional}%
                  </span>
                  <span className="text-xs text-muted-foreground">광고 시청 후 AI 상세 분석 제공</span>
                </div>
                <Progress value={factors.emotional} className="h-2" />
              </div>
            )}
          </Card>
          {/* --- END OF ALWAYS VISIBLE PART --- */}

          {/* --- LOCKED CONTENT --- */}
          <div className="relative">
            {/* The Blur Overlay and Floating Button */}
            {!hasWatchedAd && (
              <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                {/* Background blur */}
                <div className="absolute inset-0 -m-4 backdrop-blur-md rounded-2xl"></div>

                {/* Floating Card */}
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
                      <Button
                        size="lg"
                        className="w-full depth-md hover:depth-lg transition-all"
                        onClick={handleWatchAd}
                        disabled={isWatchingAd}
                      >
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
            )}

            {/* Content to be Blurred */}
            <div className={`space-y-4 md:space-y-6 ${!hasWatchedAd ? "blur-sm" : ""}`}>
              {/* Psychological factors */}
              <Card className="p-4 md:p-6 depth-md border">
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold">심리적 요인</h3>
                </div>
                {hasWatchedAd && analysisResult ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.psychological).color}`}>
                        {factors.psychological}점
                      </span>
                    </div>
                    <Progress value={factors.psychological} className="h-2 mb-3" />
                    <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                      {analysisResult.factor_analysis.psychological.analysis}
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.psychological).color}`}>
                        {factors.psychological}%
                      </span>
                    </div>
                    <Progress value={factors.psychological} className="h-2" />
                  </div>
                )}
              </Card>

              {/* Environmental factors */}
              <Card className="p-4 md:p-6 depth-md border">
                 <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold">환경적 요인</h3>
                  </div>
                {hasWatchedAd && analysisResult ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.environmental).color}`}>
                        {factors.environmental}점
                      </span>
                    </div>
                    <Progress value={factors.environmental} className="h-2 mb-3" />
                    <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                      {analysisResult.factor_analysis.environmental.analysis}
                    </div>
                  </>
                ) : (
                   <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.environmental).color}`}>
                        {factors.environmental}%
                      </span>
                    </div>
                    <Progress value={factors.environmental} className="h-2" />
                  </div>
                )}
              </Card>

              {/* Other factors */}
              <Card className="p-4 md:p-6 depth-md border">
                <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold">기타 요인</h3>
                  </div>
                 {hasWatchedAd && analysisResult ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.other).color}`}>
                        {factors.other}점
                      </span>
                    </div>
                    <Progress value={factors.other} className="h-2 mb-3" />
                    <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                      {analysisResult.factor_analysis.other.analysis}
                    </div>
                  </>
                ) : (
                   <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.other).color}`}>
                        {factors.other}%
                      </span>
                    </div>
                    <Progress value={factors.other} className="h-2" />
                  </div>
                )}
              </Card>

              {/* The rest of the report, only rendered after ad */}
              {hasWatchedAd && analysisResult && (
                <>
                  <Card className="p-4 md:p-6 md:p-8 depth-lg border">
                    <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">상대방의 현재 심리 추측</h2>
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <h4 className="mb-2 font-semibold text-primary">이별 사유에 따른 상대방의 현재 상황</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {analysisResult.partner_psychology.breakup_reason_analysis}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold text-primary">상대방의 성격 키워드에 따른 현재 심리</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {analysisResult.partner_psychology.personality_analysis}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold text-primary">상대방은 현재 재회를 원하는 상태인가?</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {analysisResult.partner_psychology.reunion_willingness}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 md:p-6 md:p-8 depth-lg border">
                    <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">재회를 위한 액션 플랜</h2>
                     <div className="space-y-4 md:space-y-6">
                        <div className="flex gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm"><Target className="h-5 w-5 text-primary" /></div>
                          <div className="flex-1">
                            <h4 className="mb-2 font-semibold">핵심 솔루션</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysisResult.reunion_requirements.solution}</p>
                          </div>
                        </div>
                         <div className="flex gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm"><Clock className="h-5 w-5 text-primary" /></div>
                          <div className="flex-1">
                            <h4 className="mb-2 font-semibold">연락 시점</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysisResult.reunion_requirements.contact_timing}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm"><Users className="h-5 w-5 text-primary" /></div>
                          <div className="flex-1">
                            <h4 className="mb-2 font-semibold">접근 스탠스</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysisResult.reunion_requirements.approach_stance}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm"><MessageCircle className="h-5 w-5 text-primary" /></div>
                          <div className="flex-1">
                            <h4 className="mb-2 font-semibold">연락 방법</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysisResult.reunion_requirements.contact_method}</p>
                          </div>
                        </div>
                     </div>
                  </Card>

                  <Card className="p-4 md:p-6 md:p-8 depth-lg border">
                    <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">최종 조언</h2>
                    <div className="space-y-4 md:space-y-6">
                       <div>
                        <h4 className="mb-2 font-semibold text-primary">어떤 접근 방식이 좋을까</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysisResult.final_advice.approach_method}</p>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold text-primary">감정 표현은 어떻게 하는 게 좋을까</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysisResult.final_advice.emotion_expression}</p>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold text-primary">어느 시점에 연락하는 게 좋을까</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysisResult.final_advice.optimal_timing}</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="overflow-hidden bg-gradient-to-br from-primary to-accent p-8 text-center text-primary-foreground depth-xl border-0">
                    <h3 className="mb-2 text-2xl font-bold text-balance">더 깊은 상담이 필요하신가요?</h3>
                    <p className="mb-6 text-primary-foreground/90">전문 상담사와의 1:1 맞춤 상담으로 구체적인 실행 계획을 세워보세요</p>
                    <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90 depth-md hover:depth-lg transition-all">
                      전문 상담 신청하기
                    </Button>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
