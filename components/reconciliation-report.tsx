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
  // useState declarations first
  const [hasWatchedAd, setHasWatchedAd] = useState(false)
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)

  const [reviewName, setReviewName] = useState("")
  const [reviewStory, setReviewStory] = useState("")
  const [reviewContact, setReviewContact] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

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

  // 광고 시청 전: 계산된 값, 광고 시청 후: AI 분석 값
  const clientFactors = calculateFactors()
  const aiFactors = analysisResult?.factor_analysis

  const factors = hasWatchedAd && aiFactors ? {
    emotional: Math.round(aiFactors.emotional.score),
    psychological: Math.round(aiFactors.psychological.score),
    environmental: Math.round(aiFactors.environmental.score),
    other: Math.round(aiFactors.other.score),
  } : clientFactors

  const probability = hasWatchedAd && analysisResult
    ? Math.round(analysisResult.overall_probability)
    : calculateProbability()

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
                    <h2 className="text-lg md:text-2xl font-bold">AI 전문 분석 종합</h2>
                  </div>
                  <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">📊 전체 재회 가능 확률: {Math.round(analysisResult.overall_probability)}%</h3>
                      <p className="text-sm">
                        입력하신 정보를 종합적으로 분석한 결과, 재회 가능 확률은 {Math.round(analysisResult.overall_probability)}%로 평가되었습니다.
                      </p>
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
                    <h3 className="text-base md:text-lg font-semibold">감정적 요인 - {factors.emotional}점</h3>
                  </div>
                  <div className="space-y-3 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                    {analysisResult?.factor_analysis.emotional.analysis || "분석 중..."}
                  </div>
                </Card>

                {/* 2-2: Psychological factors */}
                <Card className="p-4 md:p-6 depth-md border">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold">심리적 요인 - {factors.psychological}점</h3>
                  </div>
                  <div className="space-y-3 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                    {analysisResult?.factor_analysis.psychological.analysis || "분석 중..."}
                  </div>
                </Card>

                {/* 2-3: Environmental factors */}
                <Card className="p-4 md:p-6 depth-md border">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold">환경적 요인 - {factors.environmental}점</h3>
                  </div>
                  <div className="space-y-3 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                    {analysisResult?.factor_analysis.environmental.analysis || "분석 중..."}
                  </div>
                </Card>

                {/* 2-4: Other factors */}
                <Card className="p-4 md:p-6 depth-md border">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold">기타 요인 - {factors.other}점</h3>
                  </div>
                  <div className="space-y-3 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                    {analysisResult?.factor_analysis.other.analysis || "분석 중..."}
                  </div>
                </Card>
              </div>

              <Card className="p-4 md:p-6 md:p-8 depth-lg border">
                <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">상대방의 현재 심리 추측</h2>
                {analysisResult && (
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
                )}
              </Card>

              <Card className="p-4 md:p-6 md:p-8 depth-lg border">
                <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">재회하기 위해 필요한 요소</h2>
                {analysisResult && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2 font-semibold">재회를 위한 솔루션</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {analysisResult.reunion_requirements.solution}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2 font-semibold">연락 시점</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {analysisResult.reunion_requirements.contact_timing}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2 font-semibold">어떤 스탠스를 취해야 하는지</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {analysisResult.reunion_requirements.approach_stance}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 depth-sm">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2 font-semibold">어떤 형태로 연락을 하는 게 좋을지</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {analysisResult.reunion_requirements.contact_method}
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
                          {analysisResult.reunion_requirements.considerations.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              <Card className="p-4 md:p-6 md:p-8 depth-lg border">
                <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">재회 후 관계 유지를 위해 필요한 요소</h2>
                {analysisResult && (
                  <div className="space-y-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
                    <p className="whitespace-pre-wrap">{analysisResult.relationship_maintenance.introduction}</p>
                    <ul className="space-y-3">
                      {analysisResult.relationship_maintenance.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                          <div>
                            <span className="font-semibold text-foreground">{tip.title}: </span>
                            <span className="whitespace-pre-wrap">{tip.description}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>

              <Card className="p-4 md:p-6 md:p-8 depth-lg border">
                <h2 className="mb-4 md:mb-6 text-lg md:text-2xl font-bold">최종 조언</h2>
                {analysisResult && (
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <h4 className="mb-2 font-semibold text-primary">어떤 접근 방식이 좋을까</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {analysisResult.final_advice.approach_method}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-primary">감정 표현은 어떻게 하는 게 좋을까</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {analysisResult.final_advice.emotion_expression}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-primary">어느 시점에 연락하는 게 좋을까</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {analysisResult.final_advice.optimal_timing}
                      </p>
                    </div>
                  </div>
                )}
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
