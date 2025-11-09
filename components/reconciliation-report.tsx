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
  analysisResult?: string
}

export function ReconciliationReport({ formData, analysisResult }: ReconciliationReportProps) {
  const calculateFactors = () => {
    let emotional = 50
    let psychological = 50
    let environmental = 50
    let other = 50

    const myPersonality = Array.isArray(formData?.myPersonalityPreset) ? formData.myPersonalityPreset : []
    const partnerPersonality = Array.isArray(formData?.partnerPersonalityPreset) ? formData.partnerPersonalityPreset : []

    // Emotional factors
    if (formData?.relationshipDuration === "more-than-5y") emotional += 20
    else if (formData?.relationshipDuration === "3y-5y") emotional += 15
    else if (formData?.relationshipDuration === "1y-3y") emotional += 10
    else if (formData?.relationshipDuration === "less-than-6m") emotional -= 10

    if (formData?.breakupDate) {
      const breakupDate = new Date(formData.breakupDate)
      const now = new Date()
      const daysSince = Math.floor((now.getTime() - breakupDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysSince < 7) emotional += 15
      else if (daysSince < 30) emotional += 12
      else if (daysSince < 90) emotional += 8
      else if (daysSince > 180) emotional -= 15
    }

    if (formData?.breakupReason === "third-party" || formData?.breakupReason === "trust") emotional -= 25
    else if (formData?.breakupReason === "communication") emotional += 5

    // Psychological factors
    const hasAvoidant =
      (myPersonality && myPersonality.length > 0 && myPersonality.includes("회피형")) ||
      (partnerPersonality && partnerPersonality.length > 0 && partnerPersonality.includes("회피형"))
    const hasAnxious =
      (myPersonality && myPersonality.length > 0 && myPersonality.includes("불안형")) ||
      (partnerPersonality && partnerPersonality.length > 0 && partnerPersonality.includes("불안형"))
    const hasStable =
      (myPersonality && myPersonality.length > 0 && myPersonality.includes("안정형")) ||
      (partnerPersonality && partnerPersonality.length > 0 && partnerPersonality.includes("안정형"))

    if (hasStable) psychological += 15
    if (hasAvoidant && hasAnxious) psychological -= 10
    if (myPersonality && myPersonality.length > 0 && myPersonality.includes("적극적")) psychological += 10
    if (partnerPersonality && partnerPersonality.length > 0 && partnerPersonality.includes("회피형")) psychological -= 5

    if (formData?.myMBTI && formData?.partnerMBTI && formData.myMBTI.length > 0 && formData.partnerMBTI.length > 0) {
      const isSimilar =
        (formData.myMBTI.includes("F") && formData.partnerMBTI.includes("F")) ||
        (formData.myMBTI.includes("T") && formData.partnerMBTI.includes("T"))
      if (isSimilar) psychological += 10
      else psychological -= 5
    }

    // Environmental factors
    if (formData?.currentContact === "regular") environmental += 25
    else if (formData?.currentContact === "friends") environmental += 20
    else if (formData?.currentContact === "occasional") environmental += 10
    else if (formData?.currentContact === "blocked") environmental -= 30

    if (formData?.distance === "same-area" || formData?.distance === "same-city") environmental += 15
    else if (formData?.distance === "different-country") environmental -= 20
    else if (formData?.distance === "far") environmental -= 10

    if (formData?.breakupReason === "distance" || formData?.breakupReason === "career") environmental += 10

    // Other factors
    const myAge = formData?.myAge ? Number.parseInt(formData.myAge) : 0
    const partnerAge = formData?.partnerAge ? Number.parseInt(formData.partnerAge) : 0
    const ageDiff = Math.abs(myAge - partnerAge)

    if (myAge >= 20 && myAge <= 26) other += 10
    if (ageDiff <= 3) other += 10
    else if (ageDiff >= 8) other -= 15

    if (formData?.breakupReason === "personality") other -= 5
    else if (formData?.breakupReason === "values") other -= 10

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

  const factors = calculateFactors()
  const probability = calculateProbability()

  const getProbabilityLevel = () => {
    if (probability >= 70)
      return { level: "높음", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" }
    if (probability >= 50)
      return { level: "보통", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" }
    return { level: "낮음", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" }
  }

  const getFactorLevel = (score: number | undefined | null) => {
    if (score === null || score === undefined || typeof score !== "number")
      return { color: "text-gray-600", bgColor: "bg-gray-500" }
    if (score >= 70) return { color: "text-green-600", bgColor: "bg-green-500" }
    if (score >= 50) return { color: "text-yellow-600", bgColor: "bg-yellow-500" }
    return { color: "text-red-600", bgColor: "bg-red-500" }
  }

  const { level, color, bgColor } = getProbabilityLevel()

  const [hasWatchedAd, setHasWatchedAd] = useState(false)
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)

  const [reviewName, setReviewName] = useState("")
  const [reviewStory, setReviewStory] = useState("")
  const [reviewContact, setReviewContact] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmittingReview(false)
    setReviewSubmitted(true)

    // Reset form
    setTimeout(() => {
      setReviewName("")
      setReviewStory("")
      setReviewContact("")
    }, 2000)
  }

  const getDaysSinceBreakup = () => {
    if (!formData.breakupDate) return 0
    const breakupDate = new Date(formData.breakupDate)
    const now = new Date()
    return Math.floor((now.getTime() - breakupDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  const daysSince = getDaysSinceBreakup()

  return (
    <section className="py-8 md:py-16 lg:py-24">
      <div className="container mx-auto px-3 md:px-4">
        <div className="mx-auto max-w-4xl space-y-6 md:space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 depth-md">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 md:mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-balance">
              재회 가능성 분석 리포트
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              입력하신 정보를 바탕으로 심리학적 분석을 진행했습니다
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
                {probability >= 70
                  ? "감정이 남아있고 환경적 조건도 긍정적입니다"
                  : probability >= 50
                    ? "감정은 남아있으나 현실적 제약이 있습니다"
                    : "현실적 장벽이 크지만 개선 가능성은 있습니다"}
              </p>
            </div>
          </Card>

          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
            <Card className="p-4 md:p-6 depth-md border">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-semibold">감정적 요인</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.emotional).color}`}>
                    {factors.emotional}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {factors.emotional >= 70 ? "긍정적" : factors.emotional >= 50 ? "보통" : "개선 필요"}
                  </span>
                </div>
                <Progress value={factors.emotional} className="h-2" />
                {!hasWatchedAd ? (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    교제 기간:{" "}
                    {formData.relationshipDuration === "more-than-5y"
                      ? "5년 이상"
                      : formData.relationshipDuration === "3y-5y"
                        ? "3-5년"
                        : formData.relationshipDuration === "1y-3y"
                          ? "1-3년"
                          : formData.relationshipDuration === "6m-1y"
                            ? "6개월-1년"
                            : "6개월 미만"}{" "}
                    | 이별 후: {daysSince}일
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground leading-relaxed">교제 기간, 경과 시간</p>
                )}
              </div>
            </Card>

            <Card className="p-4 md:p-6 depth-md border">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-semibold">심리적 요인</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.psychological).color}`}>
                    {factors.psychological}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {factors.psychological >= 70 ? "긍정적" : factors.psychological >= 50 ? "보통" : "개선 필요"}
                  </span>
                </div>
                <Progress value={factors.psychological} className="h-2" />
                {!hasWatchedAd ? (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    본인 MBTI: {formData.myMBTI} | 상대방 MBTI: {formData.partnerMBTI}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground leading-relaxed">성격, MBTI, 애착 유형</p>
                )}
              </div>
            </Card>

            <Card className="p-4 md:p-6 depth-md border">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-semibold">환경적 요인</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.environmental).color}`}>
                    {factors.environmental}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {factors.environmental >= 70 ? "긍정적" : factors.environmental >= 50 ? "보통" : "개선 필요"}
                  </span>
                </div>
                <Progress value={factors.environmental} className="h-2" />
                {!hasWatchedAd ? (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    거리:{" "}
                    {formData.distance === "same-area"
                      ? "같은 동네"
                      : formData.distance === "same-city"
                        ? "같은 도시"
                        : formData.distance === "nearby-city"
                          ? "인근 도시"
                          : formData.distance === "far"
                            ? "먼 거리"
                            : "다른 나라"}{" "}
                    | 연락:{" "}
                    {formData.currentContact === "regular"
                      ? "자주 연락"
                      : formData.currentContact === "friends"
                        ? "친구로 지냄"
                        : formData.currentContact === "occasional"
                          ? "가끔 연락"
                          : formData.currentContact === "no-contact"
                            ? "완전 단절"
                            : "차단"}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground leading-relaxed">거리, 연락 상태</p>
                )}
              </div>
            </Card>

            <Card className="p-4 md:p-6 depth-md border">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-semibold">기타 요인</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.other).color}`}>
                    {factors.other}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {factors.other >= 70 ? "긍정적" : factors.other >= 50 ? "보통" : "개선 필요"}
                  </span>
                </div>
                <Progress value={factors.other} className="h-2" />
                {!hasWatchedAd ? (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    본인 나이: {formData.myAge}세 | 상대방 나이: {formData.partnerAge}세
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground leading-relaxed">연령대, 나이 차이</p>
                )}
              </div>
            </Card>
          </div>

          {!hasWatchedAd ? (
            <Card className="overflow-hidden bg-gradient-to-br from-muted/50 to-muted p-8 md:p-12 text-center depth-xl border-2">
              <div className="mx-auto max-w-md space-y-6">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 depth-md">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-bold text-balance">상세 분석 리포트 확인하기</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    짧은 광고를 시청하시면 각 요인별 상세 분석과 맞춤형 재회 솔루션을 무료로 확인하실 수 있습니다
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>✓ 각 요인별 상세 분석 및 개선 방법</li>
                    <li>✓ 상대방의 현재 심리 상태 추측</li>
                    <li>✓ 재회를 위한 단계별 실행 전략</li>
                    <li>✓ 연락 시점, 방법, 스탠스 가이드</li>
                    <li>✓ 재회 후 관계 유지 솔루션</li>
                  </ul>
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
                <p className="text-xs text-muted-foreground">약 5초 소요됩니다</p>
              </div>
            </Card>
          ) : (
            <>
              {analysisResult && (
                <Card className="p-4 md:p-6 md:p-8 depth-lg border-2 border-primary/20">
                  <div className="mb-4 md:mb-6 flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 md:p-3 depth-md">
                      <Brain className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <h2 className="text-lg md:text-2xl font-bold">AI 전문 분석 결과</h2>
                  </div>
                  <div className="prose prose-sm md:prose-base max-w-none">
                    <div className="whitespace-pre-wrap text-sm md:text-base text-muted-foreground leading-relaxed">
                      {analysisResult}
                    </div>
                  </div>
                </Card>
              )}

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-2xl font-bold">재회 가능 확률 요인 분석</h2>

                {/* 2-1: Emotional factors */}
                <Card className="p-4 md:p-6 depth-md border">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold">감정적 요인</h3>
                  </div>
                  <div className="space-y-3 text-xs md:text-sm leading-relaxed">
                    <p>
                      {formData.relationshipDuration === "more-than-5y" || formData.relationshipDuration === "3y-5y"
                        ? `${formData.relationshipDuration === "more-than-5y" ? "5년 이상" : "3-5년"}의 긴 교제 기간 동안 형성된 깊은 정서적 유대감이 남아있습니다. 이는 재회 시 강력한 동기가 될 수 있습니다.`
                        : "교제 기간이 상대적으로 짧아 감정의 깊이는 제한적일 수 있으나, 미련이 남아있다면 재회 가능성은 충분합니다."}
                    </p>
                    <p>
                      {daysSince < 30
                        ? "이별 후 얼마 지나지 않아 아직 감정이 생생하게 남아있는 시기입니다. 상대방도 감정적으로 혼란스러운 상태일 가능성이 높습니다."
                        : daysSince < 90
                          ? "이별 후 어느 정도 시간이 지나 감정이 정리되기 시작하는 시기입니다. 냉정함을 되찾았지만 미련은 여전히 남아있을 수 있습니다."
                          : "이별 후 상당한 시간이 지났습니다. 새로운 관점에서 관계를 바라볼 수 있는 시기입니다."}
                    </p>
                  </div>
                </Card>

                {/* 2-2: Psychological factors */}
                <Card className="p-4 md:p-6 depth-md border">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold">심리적 요인</h3>
                  </div>
                  <div className="space-y-3 text-xs md:text-sm leading-relaxed">
                    {formData.myPersonalityPreset && formData.myPersonalityPreset.length > 0 && (
                      <p>
                        본인의 성격 특성({formData.myPersonalityPreset.join(", ")})은 재회 과정에서
                        {formData.myPersonalityPreset.includes("적극적")
                          ? " 주도적인 접근을 가능하게 합니다."
                          : formData.myPersonalityPreset.includes("회피형")
                            ? " 신중한 접근이 필요함을 시사합니다."
                            : " 균형잡힌 접근이 효과적일 것입니다."}
                      </p>
                    )}
                    {formData.partnerPersonalityPreset && formData.partnerPersonalityPreset.length > 0 && (
                      <p>
                        상대방의 성격 특성({formData.partnerPersonalityPreset.join(", ")})을 고려할 때,
                        {formData.partnerPersonalityPreset.includes("회피형")
                          ? " 직접적인 압박보다는 여유를 주는 것이 효과적입니다."
                          : formData.partnerPersonalityPreset.includes("불안형")
                            ? " 안정감을 주는 접근이 중요합니다."
                            : formData.partnerPersonalityPreset.includes("안정형")
                              ? " 솔직하고 성숙한 대화가 가능할 것입니다."
                              : " 상대방의 반응을 살피며 단계적으로 접근하는 것이 좋습니다."}
                      </p>
                    )}
                    {formData.myMBTI && formData.partnerMBTI && (
                      <p>
                        MBTI 조합({formData.myMBTI} - {formData.partnerMBTI})을 보면,
                        {(formData.myMBTI.includes("F") && formData.partnerMBTI.includes("T")) ||
                        (formData.myMBTI.includes("T") && formData.partnerMBTI.includes("F"))
                          ? " 감정 표현 방식의 차이가 있을 수 있어 명확한 소통이 중요합니다."
                          : " 비교적 유사한 소통 방식을 가지고 있어 이해가 수월할 것입니다."}
                      </p>
                    )}
                  </div>
                </Card>

                {/* 2-3: Environmental factors */}
                <Card className="p-4 md:p-6 depth-md border">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold">환경적 요인</h3>
                  </div>
                  <div className="space-y-3 text-xs md:text-sm leading-relaxed">
                    <p>
                      거주 거리(
                      {formData.distance === "same-area"
                        ? "같은 동네"
                        : formData.distance === "same-city"
                          ? "같은 도시"
                          : formData.distance === "nearby-city"
                            ? "인근 도시"
                            : formData.distance === "far"
                              ? "먼 거리"
                              : "다른 나라"}
                      )는
                      {formData.distance === "same-area" || formData.distance === "same-city"
                        ? " 재회 후 자주 만날 수 있어 긍정적입니다. 우연한 만남도 가능하여 자연스러운 접근이 용이합니다."
                        : formData.distance === "different-country"
                          ? " 물리적 거리가 큰 장벽이 됩니다. 재회를 위해서는 거리 문제에 대한 명확한 해결책이 필요합니다."
                          : " 자주 만나기는 어렵지만 불가능한 거리는 아닙니다. 의지가 있다면 극복 가능합니다."}
                    </p>
                    <p>
                      현재 연락 상태(
                      {formData.currentContact === "regular"
                        ? "자주 연락"
                        : formData.currentContact === "friends"
                          ? "친구로 지냄"
                          : formData.currentContact === "occasional"
                            ? "가끔 연락"
                            : formData.currentContact === "no-contact"
                              ? "완전 단절"
                              : "차단 상태"}
                      )는
                      {formData.currentContact === "regular" || formData.currentContact === "friends"
                        ? " 매우 긍정적입니다. 이미 소통 채널이 열려있어 재회 제안이 자연스럽게 가능합니다."
                        : formData.currentContact === "blocked"
                          ? " 가장 어려운 상황입니다. 직접 연락보다는 간접적 접근이나 시간을 두고 상황 변화를 기다리는 것이 필요합니다."
                          : " 연락 재개가 필요한 상황입니다. 부담 없는 명분으로 자연스럽게 연락을 시작하는 것이 좋습니다."}
                    </p>
                    {formData.partnerCareer && (
                      <p>
                        상대방의 현재 상황({formData.partnerCareer})을 고려하여 적절한 타이밍을 선택하는 것이
                        중요합니다.
                      </p>
                    )}
                  </div>
                </Card>

                {/* 2-4: Other factors */}
                <Card className="p-4 md:p-6 depth-md border">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold">기타 요인</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xl md:text-2xl font-bold ${getFactorLevel(factors.other).color}`}>
                        {factors.other}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {factors.other >= 70 ? "긍정적" : factors.other >= 50 ? "보통" : "개선 필요"}
                      </span>
                    </div>
                    <Progress value={factors.other} className="h-2" />
                    {!hasWatchedAd ? (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        본인 나이: {formData.myAge}세 | 상대방 나이: {formData.partnerAge}세
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground leading-relaxed">연령대, 나이 차이</p>
                    )}
                  </div>
                </Card>
              </div>

              <Card className="p-4 md:p-6 md:p-8 depth-lg border">
                <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">상대방의 현재 심리 추측</h2>
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h4 className="mb-2 font-semibold text-primary">이별 사유에 따른 상대방의 현재 상황</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {formData.breakupReason === "career" || formData.breakupReason === "distance"
                        ? "현실적 이유로 이별했기 때문에 감정은 남아있지만 상황 때문에 조심스러워하고 있을 가능성이 높습니다. 상황이 개선되었다는 신호를 보내면 긍정적으로 반응할 수 있습니다."
                        : formData.breakupReason === "third-party" || formData.breakupReason === "trust"
                          ? "신뢰가 깨진 상황이라 상대방은 경계심이 매우 높은 상태입니다. 재회를 고려하더라도 신중하게 접근할 것이며, 진심을 증명하는 데 오랜 시간이 필요합니다."
                          : formData.breakupReason === "communication"
                            ? "소통 부족으로 인한 이별이라 답답함과 아쉬움이 남아있을 수 있습니다. 제대로 된 대화를 원하고 있을 가능성이 있습니다."
                            : "이별 결정에 대해 확신이 서지 않아 혼란스러운 상태일 수 있습니다. 시간이 지나면서 결정을 재평가하고 있을 가능성이 있습니다."}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-primary">상대방의 성격 키워드에 따른 현재 심리</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {formData.partnerPersonalityPreset.includes("회피형")
                        ? "회피형 성향이 있어 자신의 감정을 억누르고 거리를 두려는 경향이 있습니다. 미련이 있어도 먼저 연락하기 어려워하며, 압박을 받으면 더 멀어질 수 있습니다."
                        : formData.partnerPersonalityPreset.includes("불안형")
                          ? "불안형 성향이 있어 이별 후에도 감정적으로 혼란스러워하고 있을 가능성이 높습니다. 재회를 원하지만 거절당할까 두려워 먼저 연락하지 못하고 있을 수 있습니다."
                          : formData.partnerPersonalityPreset.includes("안정형")
                            ? "안정형 성향이 있어 이별을 받아들이고 감정을 정리하는 능력이 뛰어납니다. 하지만 합리적으로 관계를 재평가할 수 있어, 변화된 모습을 보여주면 재회를 고려할 수 있습니다."
                            : formData.partnerPersonalityPreset.includes("직설적")
                              ? "직설적인 성향이 있어 이별 결정도 명확했을 것입니다. 하지만 솔직한 대화를 통해 문제를 해결할 수 있다면 재회 가능성이 있습니다."
                              : "상대방의 성격을 고려할 때, 현재 이별에 대해 나름의 방식으로 감정을 정리하고 있을 것입니다."}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-primary">상대방은 현재 재회를 원하는 상태인가?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {formData.currentContact === "regular" || formData.currentContact === "friends"
                        ? "현재 연락을 유지하고 있다는 것은 완전히 정리하지 못했다는 신호입니다. 재회를 직접적으로 원하지는 않더라도, 관계 회복에 대한 여지를 남겨두고 있을 가능성이 높습니다."
                        : formData.currentContact === "blocked"
                          ? "차단 상태라는 것은 현재로서는 재회를 원하지 않는다는 강력한 신호입니다. 시간을 두고 감정이 정리될 때까지 기다리는 것이 필요합니다."
                          : daysSince < 30
                            ? "이별 직후라 아직 감정이 정리되지 않은 상태입니다. 재회를 원하는지 스스로도 확신하지 못하고 있을 가능성이 높습니다."
                            : "어느 정도 시간이 지나 감정이 정리되었지만, 좋은 추억과 미련은 남아있을 것입니다. 적절한 접근이 있다면 재회를 고려할 수 있는 상태입니다."}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 md:p-6 md:p-8 depth-lg border">
                <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">재회하기 위해 필요한 요소</h2>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-semibold">재회를 위한 솔루션</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {formData.breakupReason === "communication"
                          ? "소통 방식을 개선하는 것이 핵심입니다. 상대방의 말을 경청하고, 자신의 감정을 명확하게 표현하는 연습이 필요합니다. 비난보다는 '나 전달법'을 사용하여 대화하세요."
                          : formData.breakupReason === "personality"
                            ? "성격 차이를 인정하고 서로의 다름을 존중하는 태도가 필요합니다. 상대방을 바꾸려 하지 말고, 차이를 조율하는 방법을 찾아야 합니다."
                            : formData.breakupReason === "distance" || formData.breakupReason === "career"
                              ? "현실적 문제가 해결되었거나 해결 방안이 생겼음을 보여주는 것이 중요합니다. 구체적인 계획을 제시하여 안심시키세요."
                              : formData.breakupReason === "trust"
                                ? "신뢰 회복이 최우선입니다. 말보다는 행동으로 변화를 증명해야 하며, 시간이 오래 걸리더라도 일관된 모습을 보여주어야 합니다."
                                : "이별의 근본 원인을 파악하고 그것을 개선하는 것이 가장 중요합니다. 자기 성찰을 통해 변화된 모습을 보여주세요."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-semibold">연락 시점</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {daysSince < 7
                          ? "이별 직후라 감정이 격앙된 상태입니다. 최소 1-2주는 시간을 두고 서로 진정한 후 연락하는 것이 좋습니다."
                          : daysSince < 30
                            ? "적절한 시기입니다. 너무 오래 기다리면 감정이 식을 수 있으니, 지금부터 자연스럽게 접근을 시작하세요."
                            : daysSince < 90
                              ? "어느 정도 시간이 지나 냉정을 되찾은 시기입니다. 가벼운 안부로 시작하여 반응을 살펴보세요."
                              : "상당한 시간이 지났습니다. 새로운 시작이라는 마음으로 접근하되, 과거를 반성하는 모습을 보여주는 것이 중요합니다."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-semibold">어떤 스탠스를 취해야 하는지</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {formData.partnerPersonalityPreset.includes("회피형")
                          ? "감정적 압박을 주지 않는 중립적 스탠스가 효과적입니다. 여유를 주고 상대방이 편안함을 느끼도록 하세요."
                          : formData.partnerPersonalityPreset.includes("불안형")
                            ? "안정감을 주는 따뜻한 스탠스가 필요합니다. 진심을 담아 감정을 표현하되, 부담을 주지 않도록 주의하세요."
                            : formData.breakupReason === "trust"
                              ? "진지하고 책임감 있는 스탠스가 필요합니다. 가벼운 태도는 역효과를 낼 수 있으니 신중하게 접근하세요."
                              : "감정적이면서도 이성적인 균형잡힌 스탠스가 좋습니다. 감정에만 호소하지 말고, 현실적인 해결책도 함께 제시하세요."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-semibold">어떤 형태로 연락을 하는 게 좋을지</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {formData.currentContact === "blocked"
                          ? "직접 연락이 어려운 상황입니다. 공통 친구를 통한 간접 접근이나, SNS를 통해 변화된 모습을 보여주는 것부터 시작하세요."
                          : formData.currentContact === "no-contact"
                            ? "문자 메시지로 가볍게 시작하는 것이 좋습니다. '안부 인사', '공통 관심사', '추억의 장소' 등 부담 없는 주제로 대화를 열어보세요."
                            : formData.currentContact === "occasional" || formData.currentContact === "friends"
                              ? "이미 연락하고 있다면 대화의 질을 높이는 것이 중요합니다. 온라인 대화에서 점차 전화, 그리고 직접 만남으로 발전시켜 나가세요."
                              : "현재 관계를 고려하여 자연스러운 방법을 선택하세요. 급하게 진행하지 말고 단계적으로 접근하는 것이 중요합니다."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm">
                      <AlertCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-semibold">연락하기 전 고려해봐야 할 요소</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>
                            상대방의 현재 상황: 바쁜 시기(시험, 프로젝트 등)는 피하고 여유로운 때를 선택하세요
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>제3자의 존재: 상대방이 새로운 사람을 만나고 있다면 타이밍을 재고해야 합니다</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>자신의 변화: 이별 원인이 된 문제를 개선했는지 스스로 점검하세요</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>거절 대비: 거절당할 가능성도 염두에 두고, 감정적으로 준비하세요</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 md:p-6 md:p-8 depth-lg border">
                <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">재회 후 관계 유지를 위해 필요한 요소</h2>
                <div className="space-y-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
                  <p>재회에 성공했다면, 같은 문제가 반복되지 않도록 관계 유지에 더욱 신경 써야 합니다.</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">정기적인 감정 점검: </span>주 1회 정도 서로의
                        감정 상태를 확인하는 시간을 가지세요. 작은 불만도 쌓이기 전에 해소하는 것이 중요합니다.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">소통 루틴 만들기: </span>
                        바쁘더라도 하루 한 번은 의미 있는 대화를 나누는 습관을 들이세요. 형식적인 안부가 아닌 진심 어린
                        대화가 필요합니다.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">갈등 해결 규칙 정하기: </span>
                        싸울 때의 규칙을 미리 정해두세요. 예: 인신공격 금지, 과거 문제 꺼내지 않기, 24시간 내 화해하기
                        등
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">개인 시간 존중: </span>
                        재회 후 집착하지 말고 서로의 개인 시간과 공간을 존중하세요. 건강한 거리감이 관계를 더 단단하게
                        만듭니다.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">긍정적 경험 쌓기: </span>
                        함께 새로운 추억을 만들어가세요. 과거의 좋은 기억에만 의존하지 말고, 새로운 경험을 통해 관계를
                        발전시키세요.
                      </div>
                    </li>
                  </ul>
                </div>
              </Card>

              <Card className="p-4 md:p-6 md:p-8 depth-lg border">
                <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">최종 조언</h2>
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h4 className="mb-2 font-semibold text-primary">어떤 접근 방식이 좋을까</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {formData.partnerPersonalityPreset.includes("직설적") || formData.partnerPersonalityPreset.includes("안정형")
                        ? "직접적 접근이 효과적입니다. 솔직하게 재회 의사를 밝히고, 변화된 모습과 구체적인 계획을 제시하세요. 상대방도 명확한 의사 표현을 선호할 것입니다."
                        : formData.partnerPersonalityPreset.includes("회피형") ||
                            formData.partnerPersonalityPreset.includes("예민함")
                          ? "우회적 접근이 필요합니다. 재회를 직접 언급하기보다는 자연스럽게 관계를 회복해 나가면서 상대방이 편안함을 느끼도록 하세요."
                          : "단계적 접근이 좋습니다. 먼저 친구 관계를 회복하고, 신뢰를 쌓은 후 재회를 제안하는 것이 안전합니다."}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-primary">감정 표현은 어떻게 하는 게 좋을까</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      진심과 공감을 중심으로 표현하세요. "네가 그랬잖아"보다는 "내가 그때 이렇게 느꼈어"처럼 자신의
                      감정을 솔직하게 전달하는 것이 좋습니다. 상대방의 입장도 이해하고 있음을 보여주고, 과거의 잘못을
                      인정하는 겸손한 태도가 필요합니다.
                      {formData.partnerPersonalityPreset.includes("감성적") || formData.myMBTI?.includes("F")
                        ? " 감정적 표현을 두려워하지 마세요. 진심 어린 감정 표현이 상대방의 마음을 움직일 것입니다."
                        : " 과도한 감정 표현보다는 차분하고 이성적인 톤을 유지하면서도 진심을 담아 표현하세요."}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-primary">어느 시점에 연락하는 게 좋을까</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {daysSince < 14
                        ? "아직 이별 직후라 감정이 격앙되어 있습니다. 최소 2-3주는 기다린 후 연락하는 것이 좋습니다. 그 사이 자기 성찰과 개선에 집중하세요."
                        : daysSince < 60
                          ? "지금이 적절한 시기입니다. 너무 오래 기다리면 감정이 식을 수 있으니, 이번 주 내로 가벼운 안부로 시작해보세요."
                          : daysSince < 120
                            ? "어느 정도 시간이 지났지만 아직 늦지 않았습니다. 자연스러운 명분(생일, 기념일, 공통 관심사)을 만들어 연락해보세요."
                            : "상당한 시간이 지났습니다. 상대방이 이미 감정을 정리했을 가능성이 있으니, 신중하게 접근하되 새로운 시작이라는 마음으로 연락하세요."}{" "}
                      상대방의 정서적 안정도를 최우선으로 고려하고, 바쁜 시기나 힘든 시기는 피하는 것이 좋습니다.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Additional info */}
              {formData.additionalInfo && (
                <Card className="bg-muted/50 p-6 depth-md border">
                  <h4 className="mb-2 font-semibold">입력하신 추가 정보</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{formData.additionalInfo}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    이 정보를 바탕으로 위의 분석에 추가적인 맥락을 반영했습니다.
                  </p>
                </Card>
              )}

              {/* CTA */}
              <Card className="overflow-hidden bg-gradient-to-br from-primary to-accent p-8 text-center text-primary-foreground depth-xl border-0">
                <h3 className="mb-2 text-2xl font-bold text-balance">더 깊은 상담이 필요하신가요?</h3>
                <p className="mb-6 text-primary-foreground/90">
                  전문 상담사와의 1:1 맞춤 상담으로 구체적인 실행 계획을 세워보세요
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-background text-foreground hover:bg-background/90 depth-md hover:depth-lg transition-all"
                  >
                    전문 상담 신청하기
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 depth-sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    리포트 저장하기
                  </Button>
                </div>
              </Card>

              <Card className="overflow-hidden bg-gradient-to-br from-accent/10 to-primary/10 p-8 md:p-10 depth-lg border-2">
                <div className="text-center mb-6">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 depth-md">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-balance">재회에 성공하셨나요?</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    우리 솔루션을 사용하고 재회에 성공한 이야기를 보내주세요!
                    <br />
                    후기는 서비스 소개 페이지에 게시되어 다른 분들에게 희망을 전달합니다.
                  </p>
                </div>

                {reviewSubmitted ? (
                  <div className="text-center py-8">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">후기가 성공적으로 제출되었습니다!</h4>
                    <p className="text-sm text-muted-foreground">
                      소중한 이야기를 공유해주셔서 감사합니다. 검토 후 서비스 소개 페이지에 게시될 예정입니다.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="review-name">이름 (선택사항)</Label>
                      <Input
                        id="review-name"
                        placeholder="익명으로 남기려면 비워두세요"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="depth-sm"
                      />
                      <p className="text-xs text-muted-foreground">이름을 입력하지 않으면 '익명'으로 게시됩니다</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="review-story">재회 성공 스토리 *</Label>
                      <Textarea
                        id="review-story"
                        placeholder="어떻게 재회에 성공하셨나요? 우리 솔루션이 어떻게 도움이 되었는지 자유롭게 작성해주세요."
                        value={reviewStory}
                        onChange={(e) => setReviewStory(e.target.value)}
                        rows={6}
                        className="depth-sm resize-none"
                      />
                      <p className="text-xs text-muted-foreground">최소 50자 이상 작성해주세요</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="review-contact">연락처 (이메일 또는 SNS)</Label>
                      <Input
                        id="review-contact"
                        placeholder="example@email.com 또는 @instagram_id"
                        value={reviewContact}
                        onChange={(e) => setReviewContact(e.target.value)}
                        className="depth-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        진짜 후기임을 증명하기 위해 연락처가 함께 게시됩니다
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full depth-md hover:depth-lg transition-all"
                      onClick={handleSubmitReview}
                      disabled={isSubmittingReview || !reviewStory.trim()}
                    >
                      {isSubmittingReview ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          제출 중...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          후기 제출하기
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      제출하신 후기는 검토 후 2-3일 내에 게시됩니다
                    </p>
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
