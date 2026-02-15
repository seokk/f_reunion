"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ReconciliationReport } from "@/components/reconciliation-report"
import { StepFour, StepOne, StepThree, StepTwo } from "@/components/consultation/steps"
import { analyzeReunionProbability, ReunionAnalysis } from "@/lib/api"
import { AnalyzeErrorState, mapAnalyzeError } from "@/lib/analyze-error"
import { ConsultationFormData, validateConsultationStep } from "@/lib/consultation-schema"

export function ConsultationForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ReunionAnalysis | null>(null)
  const [submitError, setSubmitError] = useState<AnalyzeErrorState | null>(null)
  const [validationError, setValidationError] = useState<string>("")
  const [formData, setFormData] = useState<ConsultationFormData>({
    myGender: "",
    myAge: "",
    myMBTI: "",
    myPersonalityPreset: [],
    myPersonalityCustom: "",
    myReligion: "",
    partnerGender: "",
    partnerAge: "",
    partnerMBTI: "",
    partnerPersonalityPreset: [],
    partnerPersonalityCustom: "",
    partnerReligion: "",
    relationshipDuration: "",
    breakupDate: "",
    breakupReason: "",
    breakupReasonDetail: "",
    currentContact: "",
    distance: "",
    partnerCareer: "",
    additionalInfo: "",
  })

  const updateFormData = <K extends keyof ConsultationFormData>(field: K, value: ConsultationFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setValidationError("")
    setSubmitError(null)
  }

  const togglePersonality = (field: "myPersonalityPreset" | "partnerPersonalityPreset", value: string) => {
    const current = formData[field]
    if (current.includes(value)) {
      updateFormData(
        field,
        current.filter((v) => v !== value),
      )
      return
    }

    updateFormData(field, [...current, value])
  }

  const moveToNextStep = (nextStep: number) => {
    const issues = validateConsultationStep(formData, step)
    if (issues.length > 0) {
      setValidationError(issues[0])
      return
    }

    setValidationError("")
    setStep(nextStep)
  }

  const handleSubmit = async () => {
    const issues = validateConsultationStep(formData, 4)
    if (issues.length > 0) {
      setValidationError(issues[0])
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setValidationError("")

    try {
      const result = await analyzeReunionProbability(formData)
      setAnalysisResult(result)
      setShowReport(true)
    } catch (err) {
      setSubmitError(mapAnalyzeError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showReport) {
    return <ReconciliationReport formData={formData} analysisResult={analysisResult} />
  }

  return (
    <section id="consultation" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>단계 {step} / 4</span>
              <span>{Math.round((step / 4) * 100)}% 완료</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary depth-sm">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>

          <Card className="p-6 md:p-8 depth-lg border">
            {validationError && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1">입력값을 확인해주세요</p>
                <p>{validationError}</p>
              </div>
            )}

            {step === 1 && <StepOne formData={formData} updateFormData={updateFormData} onNext={() => moveToNextStep(2)} />}
            {step === 2 && (
              <StepTwo
                formData={formData}
                updateFormData={updateFormData}
                onBack={() => setStep(1)}
                onNext={() => moveToNextStep(3)}
                togglePersonality={togglePersonality}
              />
            )}
            {step === 3 && (
              <StepThree
                formData={formData}
                updateFormData={updateFormData}
                onBack={() => setStep(2)}
                onNext={() => moveToNextStep(4)}
              />
            )}
            {step === 4 && (
                <StepFour
                  formData={formData}
                  updateFormData={updateFormData}
                  error={submitError}
                  isSubmitting={isSubmitting}
                  onBack={() => setStep(3)}
                  onSubmit={handleSubmit}
                />
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}
