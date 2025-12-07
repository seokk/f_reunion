
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

// Structured Output 타입 정의
interface FactorScore {
  score: number
  analysis: string
}

interface FactorAnalysis {
  emotional: FactorScore
  psychological: FactorScore
  environmental: FactorScore
  other: FactorScore
}

interface PartnerPsychology {
  breakup_reason_analysis: string
  personality_analysis: string
  reunion_willingness: string
}

interface ReunionRequirements {
  solution: string
  contact_timing: string
  approach_stance: string
  contact_method: string
  considerations: string[]
}

interface RelationshipMaintenanceTip {
  title: string
  description: string
}

interface RelationshipMaintenance {
  introduction: string
  tips: RelationshipMaintenanceTip[]
}

interface FinalAdvice {
  approach_method: string
  emotion_expression: string
  optimal_timing: string
}

export interface ReunionAnalysis {
  overall_probability: number
  factor_analysis: FactorAnalysis
  partner_psychology: PartnerPsychology
  reunion_requirements: ReunionRequirements
  relationship_maintenance: RelationshipMaintenance
  final_advice: FinalAdvice
}

interface AnalysisResponse {
  response: string  // JSON 문자열
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
export async function analyzeReunionProbability(formData: FormData): Promise<ReunionAnalysis> {
  const backendApiUrl = 'https://reunion-147203938140.europe-west1.run.app/api/v1/chat/'

  const message = formatFormDataToMessage(formData);

  console.log('=== API 요청 시작 (백엔드 직접 호출) ===');
  console.log('API URL:', backendApiUrl);
  console.log('message:', message);

  const response = await fetch(backendApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'your-api-key-1' // API 키 헤더 추가
    },
    body: JSON.stringify({
      message: message
    })
  });

  console.log('응답 상태:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API 에러:', errorText);
    throw new Error(`API 요청 실패: ${response.status} ${errorText}`);
  }

  // 백엔드 응답이 AnalysisResponse 형태라고 가정
  const analysisResponse: AnalysisResponse = await response.json();

  try {
    // response 필드는 JSON 문자열이므로 파싱
    const analysisResult: ReunionAnalysis = JSON.parse(analysisResponse.response);
    console.log('=== API 응답 성공 ===');
    console.log('파싱된 분석 결과:', analysisResult);
    return analysisResult;
  } catch (e) {
    console.error("Failed to parse the 'response' field from the backend.", e);
    // 백엔드에서 받은 원본 문자열을 로그로 남겨 디버깅을 돕습니다.
    console.error("Original 'response' string:", analysisResponse.response);
    throw new Error("Backend response parsing failed.");
  }
}
