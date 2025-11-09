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

interface AnalysisResponse {
  response: string
  tokens_used: number
  tokens_remaining_today: number
}

/**
 * FormData를 LLM에게 보낼 자연어 메시지로 변환
 */
function formatFormDataToMessage(formData: FormData): string {
  const genderMap: Record<string, string> = {
    male: "남성",
    female: "여성"
  }

  const durationMap: Record<string, string> = {
    "less-than-6m": "6개월 미만",
    "6m-1y": "6개월~1년",
    "1y-3y": "1년~3년",
    "3y-5y": "3년~5년",
    "more-than-5y": "5년 이상"
  }

  const distanceMap: Record<string, string> = {
    "same-area": "같은 동네",
    "same-city": "같은 도시",
    "nearby-city": "인근 도시",
    "far": "먼 거리",
    "different-country": "다른 나라"
  }

  const contactMap: Record<string, string> = {
    blocked: "차단 상태",
    "no-contact": "완전 단절",
    occasional: "가끔 연락",
    friends: "친구로 지냄",
    regular: "자주 연락"
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
    other: "기타"
  }

  const religionMap: Record<string, string> = {
    none: "무교",
    christian: "기독교",
    catholic: "천주교",
    buddhist: "불교",
    other: "기타"
  }

  const message = `
# 재회 확률 분석 요청

## 본인 정보
- 성별: ${genderMap[formData.myGender] || formData.myGender}
- 나이: ${formData.myAge}세
${formData.myMBTI ? `- MBTI: ${formData.myMBTI}` : ''}
${formData.myReligion ? `- 종교: ${religionMap[formData.myReligion] || formData.myReligion}` : ''}
- 성격 키워드: ${formData.myPersonalityPreset.join(', ')}${formData.myPersonalityCustom ? `, ${formData.myPersonalityCustom}` : ''}

## 상대방 정보
- 성별: ${genderMap[formData.partnerGender] || formData.partnerGender}
- 나이: ${formData.partnerAge}세
${formData.partnerMBTI ? `- MBTI: ${formData.partnerMBTI}` : ''}
${formData.partnerReligion ? `- 종교: ${religionMap[formData.partnerReligion] || formData.partnerReligion}` : ''}
- 성격 키워드: ${formData.partnerPersonalityPreset.join(', ')}${formData.partnerPersonalityCustom ? `, ${formData.partnerPersonalityCustom}` : ''}
${formData.partnerCareer ? `- 직업/진로: ${formData.partnerCareer}` : ''}

## 관계 정보
- 교제 기간: ${durationMap[formData.relationshipDuration] || formData.relationshipDuration}
- 이별 날짜: ${formData.breakupDate}
- 현재 거주 거리: ${distanceMap[formData.distance] || formData.distance}
- 현재 연락 상태: ${contactMap[formData.currentContact] || formData.currentContact}

## 이별 사유
- 주된 사유: ${reasonMap[formData.breakupReason] || formData.breakupReason}
- 상세 설명: ${formData.breakupReasonDetail}

${formData.additionalInfo ? `## 추가 정보\n${formData.additionalInfo}` : ''}

위 정보를 바탕으로 재회 확률을 분석하고, 구체적인 액션 플랜을 제시해주세요.
`.trim()

  return message
}

/**
 * 백엔드 API에 재회 분석 요청
 */
export async function analyzeReunionProbability(formData: FormData): Promise<AnalysisResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'your-api-key-1'

  const message = formatFormDataToMessage(formData)

  console.log('=== API 요청 시작 ===')
  console.log('API URL:', `${apiUrl}/api/v1/chat`)
  console.log('요청 메시지:', message)

  const response = await fetch(`${apiUrl}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      message: message,
      max_tokens: 2000
    })
  })

  console.log('응답 상태:', response.status, response.statusText)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API 에러:', errorData)
    throw new Error(errorData.error || `API request failed with status ${response.status}`)
  }

  const data: AnalysisResponse = await response.json()
  console.log('=== API 응답 성공 ===')
  console.log('응답 데이터:', data)
  console.log('사용된 토큰:', data.tokens_used)
  console.log('남은 토큰:', data.tokens_remaining_today)
  console.log('응답 내용 길이:', data.response.length, '자')

  return data
}
