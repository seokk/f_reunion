"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight, Loader2 } from "lucide-react"
import { ReconciliationReport } from "@/components/reconciliation-report"
import { analyzeReunionProbability } from "@/lib/api"

interface FormData {
  // Personal info
  myGender: string
  myAge: string
  myMBTI: string
  myPersonalityPreset: string[]
  myPersonalityCustom: string
  myReligion: string

  // Partner info
  partnerGender: string
  partnerAge: string
  partnerMBTI: string
  partnerPersonalityPreset: string[]
  partnerPersonalityCustom: string
  partnerReligion: string

  // Relationship info
  relationshipDuration: string
  breakupDate: string
  breakupReason: string
  breakupReasonDetail: string
  currentContact: string
  distance: string
  partnerCareer: string
  additionalInfo: string
}

const personalityKeywords = [
  "직설적",
  "회피형",
  "불안형",
  "안정형",
  "예민함",
  "무던함",
  "소극적",
  "적극적",
  "내향",
  "외향",
  "신중함",
  "즉흥적",
]

export function ConsultationForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [formData, setFormData] = useState<FormData>({
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

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const togglePersonality = (field: "myPersonalityPreset" | "partnerPersonalityPreset", value: string) => {
    const current = formData[field]
    if (current.includes(value)) {
      updateFormData(
        field,
        current.filter((v) => v !== value),
      )
    } else {
      updateFormData(field, [...current, value])
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError("")

    try {
      const result = await analyzeReunionProbability(formData)
      setAnalysisResult(result.response)
      setShowReport(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "분석 중 오류가 발생했습니다."
      setError(errorMessage)
      console.error("Analysis error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showReport) {
    return <ReconciliationReport formData={formData} analysisResult={analysisResult} />
  }

  const totalSteps = 4

  return (
    <section id="consultation" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                단계 {step} / {totalSteps}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}% 완료</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary depth-sm">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <Card className="p-6 md:p-8 depth-lg border">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">기본 정보</h2>
                  <p className="text-muted-foreground">두 분의 기본 정보를 입력해주세요.</p>
                </div>

                <div className="space-y-6">
                  {/* My info */}
                  <div className="space-y-4 rounded-lg border bg-card/50 p-4">
                    <h3 className="font-semibold text-primary">본인</h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>성별</Label>
                        <RadioGroup
                          value={formData.myGender}
                          onValueChange={(value) => updateFormData("myGender", value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="my-male" />
                            <Label htmlFor="my-male" className="font-normal">
                              남성
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="my-female" />
                            <Label htmlFor="my-female" className="font-normal">
                              여성
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="myAge">나이</Label>
                        <Input
                          id="myAge"
                          type="number"
                          placeholder="예: 28"
                          value={formData.myAge}
                          onChange={(e) => updateFormData("myAge", e.target.value)}
                          className="depth-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Partner info */}
                  <div className="space-y-4 rounded-lg border bg-card/50 p-4">
                    <h3 className="font-semibold text-primary">상대방</h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>성별</Label>
                        <RadioGroup
                          value={formData.partnerGender}
                          onValueChange={(value) => updateFormData("partnerGender", value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="partner-male" />
                            <Label htmlFor="partner-male" className="font-normal">
                              남성
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="partner-female" />
                            <Label htmlFor="partner-female" className="font-normal">
                              여성
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partnerAge">나이</Label>
                        <Input
                          id="partnerAge"
                          type="number"
                          placeholder="예: 30"
                          value={formData.partnerAge}
                          onChange={(e) => updateFormData("partnerAge", e.target.value)}
                          className="depth-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent depth-sm" disabled>
                    이전
                  </Button>
                  <Button className="flex-1 depth-md hover:depth-lg transition-all" onClick={() => setStep(2)}>
                    다음 단계
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">성격 및 특성</h2>
                  <p className="text-muted-foreground">두 분의 성격과 특성을 알려주세요.</p>
                </div>

                <div className="space-y-6">
                  {/* My personality */}
                  <div className="space-y-4 rounded-lg border bg-card/50 p-4">
                    <h3 className="font-semibold text-primary">본인</h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="myMBTI">MBTI (선택)</Label>
                        <Input
                          id="myMBTI"
                          placeholder="예: INFP"
                          value={formData.myMBTI}
                          onChange={(e) => updateFormData("myMBTI", e.target.value.toUpperCase())}
                          className="depth-sm"
                          maxLength={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="myReligion">종교 (선택)</Label>
                        <Select
                          value={formData.myReligion}
                          onValueChange={(value) => updateFormData("myReligion", value)}
                        >
                          <SelectTrigger id="myReligion" className="depth-sm">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">무교</SelectItem>
                            <SelectItem value="christian">기독교</SelectItem>
                            <SelectItem value="catholic">천주교</SelectItem>
                            <SelectItem value="buddhist">불교</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>성격 키워드 (복수 선택 가능)</Label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {personalityKeywords.map((trait) => (
                          <Button
                            key={trait}
                            type="button"
                            variant={formData.myPersonalityPreset.includes(trait) ? "default" : "outline"}
                            className="h-9 text-sm depth-sm"
                            onClick={() => togglePersonality("myPersonalityPreset", trait)}
                          >
                            {trait}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="myPersonalityCustom" className="text-xs">
                          기타 성격 키워드
                        </Label>
                        <Input
                          id="myPersonalityCustom"
                          placeholder="예: 감성적, 책임감 있는, 우유부단한 등"
                          value={formData.myPersonalityCustom}
                          onChange={(e) => updateFormData("myPersonalityCustom", e.target.value)}
                          className="depth-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Partner personality */}
                  <div className="space-y-4 rounded-lg border bg-card/50 p-4">
                    <h3 className="font-semibold text-primary">상대방</h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="partnerMBTI">MBTI (선택)</Label>
                        <Input
                          id="partnerMBTI"
                          placeholder="예: ENFJ"
                          value={formData.partnerMBTI}
                          onChange={(e) => updateFormData("partnerMBTI", e.target.value.toUpperCase())}
                          className="depth-sm"
                          maxLength={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partnerReligion">종교 (선택)</Label>
                        <Select
                          value={formData.partnerReligion}
                          onValueChange={(value) => updateFormData("partnerReligion", value)}
                        >
                          <SelectTrigger id="partnerReligion" className="depth-sm">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">무교</SelectItem>
                            <SelectItem value="christian">기독교</SelectItem>
                            <SelectItem value="catholic">천주교</SelectItem>
                            <SelectItem value="buddhist">불교</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>성격 키워드 (복수 선택 가능)</Label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {personalityKeywords.map((trait) => (
                          <Button
                            key={trait}
                            type="button"
                            variant={formData.partnerPersonalityPreset.includes(trait) ? "default" : "outline"}
                            className="h-9 text-sm depth-sm"
                            onClick={() => togglePersonality("partnerPersonalityPreset", trait)}
                          >
                            {trait}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="partnerPersonalityCustom" className="text-xs">
                          기타 성격 키워드
                        </Label>
                        <Input
                          id="partnerPersonalityCustom"
                          placeholder="예: 감성적, 책임감 있는, 우유부단한 등"
                          value={formData.partnerPersonalityCustom}
                          onChange={(e) => updateFormData("partnerPersonalityCustom", e.target.value)}
                          className="depth-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent depth-sm" onClick={() => setStep(1)}>
                    이전
                  </Button>
                  <Button className="flex-1 depth-md hover:depth-lg transition-all" onClick={() => setStep(3)}>
                    다음 단계
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">관계 정보</h2>
                  <p className="text-muted-foreground">두 분의 관계에 대해 알려주세요.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="relationshipDuration">교제 기간</Label>
                      <Select
                        value={formData.relationshipDuration}
                        onValueChange={(value) => updateFormData("relationshipDuration", value)}
                      >
                        <SelectTrigger id="relationshipDuration" className="depth-sm">
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="less-than-6m">6개월 미만</SelectItem>
                          <SelectItem value="6m-1y">6개월~1년</SelectItem>
                          <SelectItem value="1y-3y">1년~3년</SelectItem>
                          <SelectItem value="3y-5y">3년~5년</SelectItem>
                          <SelectItem value="more-than-5y">5년 이상</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="breakupDate">이별 날짜</Label>
                      <Input
                        id="breakupDate"
                        type="date"
                        value={formData.breakupDate}
                        onChange={(e) => updateFormData("breakupDate", e.target.value)}
                        className="depth-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="distance">거주 거리</Label>
                      <Select value={formData.distance} onValueChange={(value) => updateFormData("distance", value)}>
                        <SelectTrigger id="distance" className="depth-sm">
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="same-area">같은 동네</SelectItem>
                          <SelectItem value="same-city">같은 도시</SelectItem>
                          <SelectItem value="nearby-city">인근 도시</SelectItem>
                          <SelectItem value="far">먼 거리</SelectItem>
                          <SelectItem value="different-country">다른 나라</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentContact">현재 연락 상태</Label>
                      <Select
                        value={formData.currentContact}
                        onValueChange={(value) => updateFormData("currentContact", value)}
                      >
                        <SelectTrigger id="currentContact" className="depth-sm">
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blocked">차단 상태</SelectItem>
                          <SelectItem value="no-contact">완전 단절</SelectItem>
                          <SelectItem value="occasional">가끔 연락</SelectItem>
                          <SelectItem value="friends">친구로 지냄</SelectItem>
                          <SelectItem value="regular">자주 연락</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partnerCareer">상대방 직업/진로 상황 (선택)</Label>
                    <Input
                      id="partnerCareer"
                      placeholder="예: 대학생, 직장인, 취업 준비 중 등"
                      value={formData.partnerCareer}
                      onChange={(e) => updateFormData("partnerCareer", e.target.value)}
                      className="depth-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent depth-sm" onClick={() => setStep(2)}>
                    이전
                  </Button>
                  <Button className="flex-1 depth-md hover:depth-lg transition-all" onClick={() => setStep(4)}>
                    다음 단계
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">이별 사유 및 추가 정보</h2>
                  <p className="text-muted-foreground">구체적인 정보를 입력할수록 더 정확한 분석이 가능합니다.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="breakupReason">주된 이별 사유</Label>
                    <Select
                      value={formData.breakupReason}
                      onValueChange={(value) => updateFormData("breakupReason", value)}
                    >
                      <SelectTrigger id="breakupReason" className="depth-sm">
                        <SelectValue placeholder="선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personality">성격 차이</SelectItem>
                        <SelectItem value="distance">장거리 연애</SelectItem>
                        <SelectItem value="family">가족 반대</SelectItem>
                        <SelectItem value="career">진로/취업 문제</SelectItem>
                        <SelectItem value="values">가치관 차이</SelectItem>
                        <SelectItem value="communication">소통 부족</SelectItem>
                        <SelectItem value="trust">신뢰 문제</SelectItem>
                        <SelectItem value="third-party">제3자 개입</SelectItem>
                        <SelectItem value="marriage">결혼 의지/시기 불일치</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breakupReasonDetail">이별 사유 상세 설명</Label>
                    <Textarea
                      id="breakupReasonDetail"
                      placeholder="구체적인 이별 사유를 입력할수록 더 정확한 재회 확률을 계산할 수 있어요.&#10;&#10;예: 서로 바빠서 자주 못 만났고, 그러다 보니 오해가 쌓여서 헤어지게 되었어요."
                      rows={5}
                      value={formData.breakupReasonDetail}
                      onChange={(e) => updateFormData("breakupReasonDetail", e.target.value)}
                      className="depth-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">기타 참고 내용 (선택)</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="재회 확률 계산에 참고할 수 있는 추가 정보를 입력해주세요.&#10;&#10;예: 같은 직장에 다니고 있어요, 공통 친구가 많아요, 재회 시도를 한 적이 있어요, 상대방이 새로운 사람을 만나고 있어요 등"
                      rows={5}
                      value={formData.additionalInfo}
                      onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                      className="depth-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      선택사항이지만, 입력하시면 더 정확하고 맞춤화된 분석이 가능합니다.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <p className="font-semibold mb-1">오류 발생</p>
                    <p>{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent depth-sm" onClick={() => setStep(3)}>
                    이전
                  </Button>
                  <Button
                    className="flex-1 depth-md hover:depth-lg transition-all"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.breakupReason || !formData.breakupReasonDetail}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      <>
                        분석 결과 보기
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}
