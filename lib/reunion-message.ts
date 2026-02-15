import type { ConsultationFormData } from "@/lib/consultation-schema"

export function formatFormDataToMessage(formData: ConsultationFormData): string {
  const genderMap: Record<string, string> = {
    male: "남성",
    female: "여성",
  }

  const durationMap: Record<string, string> = {
    "less-than-6m": "6개월 미만",
    "6m-1y": "6개월~1년",
    "1y-3y": "1년~3년",
    "3y-5y": "3년~5년",
    "more-than-5y": "5년 이상",
  }

  const distanceMap: Record<string, string> = {
    "same-area": "같은 동네",
    "same-city": "같은 도시",
    "nearby-city": "인근 도시",
    far: "먼 거리",
    "different-country": "다른 나라",
  }

  const contactMap: Record<string, string> = {
    blocked: "차단 상태",
    "no-contact": "완전 단절",
    occasional: "가끔 연락",
    friends: "친구로 지냄",
    regular: "자주 연락",
  }

  const reasonMap: Record<string, string> = {
    personality: "성격 차이",
    distance: "장거리 연애",
    family: "가족 반대",
    career: "진로/취업 문제",
    values: "가치관 차이",
    communication: "소통 부족",
    trust: "신뢰 문제",
    "third-party": "제3자 개입",
    marriage: "결혼 의지/시기 불일치",
    other: "기타",
  }

  const religionMap: Record<string, string> = {
    none: "무교",
    christian: "기독교",
    catholic: "천주교",
    buddhist: "불교",
    other: "기타",
  }

  return `
# 재회 확률 분석 요청

## 본인 정보
- 성별: ${genderMap[formData.myGender] || formData.myGender}
- 나이: ${formData.myAge}세
${formData.myMBTI ? `- MBTI: ${formData.myMBTI}` : ""}
${formData.myReligion ? `- 종교: ${religionMap[formData.myReligion] || formData.myReligion}` : ""}
- 성격 키워드: ${formData.myPersonalityPreset.join(", ")}${formData.myPersonalityCustom ? `, ${formData.myPersonalityCustom}` : ""}

## 상대방 정보
- 성별: ${genderMap[formData.partnerGender] || formData.partnerGender}
- 나이: ${formData.partnerAge}세
${formData.partnerMBTI ? `- MBTI: ${formData.partnerMBTI}` : ""}
${formData.partnerReligion ? `- 종교: ${religionMap[formData.partnerReligion] || formData.partnerReligion}` : ""}
- 성격 키워드: ${formData.partnerPersonalityPreset.join(", ")}${formData.partnerPersonalityCustom ? `, ${formData.partnerPersonalityCustom}` : ""}
${formData.partnerCareer ? `- 직업/진로: ${formData.partnerCareer}` : ""}

## 관계 정보
- 교제 기간: ${durationMap[formData.relationshipDuration] || formData.relationshipDuration}
- 이별 날짜: ${formData.breakupDate}
- 현재 거주 거리: ${distanceMap[formData.distance] || formData.distance}
- 현재 연락 상태: ${contactMap[formData.currentContact] || formData.currentContact}

## 이별 사유
- 주된 사유: ${reasonMap[formData.breakupReason] || formData.breakupReason}
- 상세 설명: ${formData.breakupReasonDetail}

${formData.additionalInfo ? `## 추가 정보\n${formData.additionalInfo}` : ""}

위 정보를 바탕으로 재회 확률을 분석하고, 구체적인 액션 플랜을 제시해주세요.
`.trim()
}
