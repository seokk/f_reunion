"use client"

import { useState } from "react"
import {
  ActionPlanCard,
  ConsultationCtaCard,
  FactorCard,
  factorIcons,
  FinalAdviceCard,
  LockedOverlay,
  PartnerPsychologyCard,
  ReportHeader,
} from "@/components/reconciliation/sections"
import type { ReunionAnalysis } from "@/lib/api"
import type { ConsultationFormData } from "@/lib/consultation-schema"

interface ReconciliationReportProps {
  formData: ConsultationFormData
  analysisResult: ReunionAnalysis | null
}

export function ReconciliationReport({ formData, analysisResult }: ReconciliationReportProps) {
  const [hasWatchedAd, setHasWatchedAd] = useState(false)
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)

  const calculateFactors = () => {
    let emotional = 50
    let psychological = 50
    let environmental = 50
    const other = 50

    if (formData.relationshipDuration.includes("y")) emotional += 15
    if (formData.currentContact === "regular" || formData.currentContact === "friends") environmental += 20
    if (formData.myMBTI && formData.partnerMBTI) psychological += 10

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

  const probability = hasWatchedAd && analysisResult ? Math.round(analysisResult.overall_probability) : calculateProbability()

  const getProbabilityLevel = () => {
    if (probability >= 70) {
      return { level: "높음", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" }
    }

    if (probability >= 50) {
      return { level: "보통", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" }
    }

    return { level: "낮음", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" }
  }

  const getFactorColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
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

  const factorMeta: Array<{
    key: keyof typeof factors
    title: string
    analysis?: string
    showLockedHint?: boolean
  }> = [
    {
      key: "emotional",
      title: "감정적 요인",
      analysis: analysisResult?.factor_analysis.emotional.analysis,
      showLockedHint: true,
    },
    {
      key: "psychological",
      title: "심리적 요인",
      analysis: analysisResult?.factor_analysis.psychological.analysis,
    },
    {
      key: "environmental",
      title: "환경적 요인",
      analysis: analysisResult?.factor_analysis.environmental.analysis,
    },
    {
      key: "other",
      title: "기타 요인",
      analysis: analysisResult?.factor_analysis.other.analysis,
    },
  ]

  return (
    <section className="py-8 md:py-16 lg:py-24">
      <div className="container mx-auto px-3 md:px-4">
        <div className="mx-auto max-w-4xl space-y-6 md:space-y-8">
          <ReportHeader
            probability={probability}
            level={level}
            levelColor={color}
            levelBgColor={bgColor}
            hasWatchedAd={hasWatchedAd}
            hasAnalysis={Boolean(analysisResult)}
          />

          <h2 className="text-xl md:text-2xl font-bold pt-4">재회 가능한 확률에 대한 요인 분석</h2>

          <FactorCard
            title="감정적 요인"
            icon={factorIcons.emotional}
            score={factors.emotional}
            scoreColor={getFactorColor(factors.emotional)}
            isUnlocked={hasWatchedAd && Boolean(analysisResult)}
            analysisText={analysisResult?.factor_analysis.emotional.analysis}
            showLockedHint
          />

          <div className="relative">
            <LockedOverlay
              hasWatchedAd={hasWatchedAd}
              isWatchingAd={isWatchingAd}
              adCountdown={adCountdown}
              onWatchAd={handleWatchAd}
            />

            <div className={`space-y-4 md:space-y-6 ${!hasWatchedAd ? "blur-sm" : ""}`}>
              {factorMeta
                .filter((item) => item.key !== "emotional")
                .map((item) => (
                  <FactorCard
                    key={item.key}
                    title={item.title}
                    icon={factorIcons[item.key]}
                    score={factors[item.key]}
                    scoreColor={getFactorColor(factors[item.key])}
                    isUnlocked={hasWatchedAd && Boolean(analysisResult)}
                    analysisText={item.analysis}
                    showLockedHint={item.showLockedHint}
                  />
                ))}

              {hasWatchedAd && analysisResult && (
                <>
                  <PartnerPsychologyCard analysis={analysisResult} />
                  <ActionPlanCard analysis={analysisResult} />
                  <FinalAdviceCard analysis={analysisResult} />
                  <ConsultationCtaCard />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
