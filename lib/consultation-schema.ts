import { z } from "zod"

const genderValues = ["male", "female"] as const
const durationValues = ["less-than-6m", "6m-1y", "1y-3y", "3y-5y", "more-than-5y"] as const
const distanceValues = ["same-area", "same-city", "nearby-city", "far", "different-country"] as const
const contactValues = ["blocked", "no-contact", "occasional", "friends", "regular"] as const
const breakupReasonValues = [
  "personality",
  "distance",
  "family",
  "career",
  "values",
  "communication",
  "trust",
  "third-party",
  "marriage",
  "other",
] as const
const religionValues = ["none", "christian", "catholic", "buddhist", "other"] as const

const mbtiPattern = /^[EI][NS][FT][JP]$/

const oneOf = (values: readonly string[], message: string) =>
  z.string().refine((value) => values.includes(value), message)

const ageSchema = z
  .string()
  .regex(/^\d+$/, "나이는 숫자로 입력해주세요.")
  .refine((value) => {
    const age = Number(value)
    return age >= 15 && age <= 80
  }, "나이는 15세부터 80세 사이로 입력해주세요.")

const optionalMbtiSchema = z
  .string()
  .trim()
  .toUpperCase()
  .refine((value) => value === "" || mbtiPattern.test(value), "MBTI는 INFP 형식으로 입력해주세요.")

const optionalText = (max: number) => z.string().trim().max(max, `최대 ${max}자까지 입력할 수 있습니다.`)

export const consultationFormSchema = z.object({
  myGender: oneOf(genderValues, "본인 성별을 선택해주세요."),
  myAge: ageSchema,
  myMBTI: optionalMbtiSchema,
  myPersonalityPreset: z.array(z.string()).max(10, "성격 키워드는 최대 10개까지 선택할 수 있습니다."),
  myPersonalityCustom: optionalText(120),
  myReligion: z.union([oneOf(religionValues, "종교를 선택해주세요."), z.literal("")]),

  partnerGender: oneOf(genderValues, "상대방 성별을 선택해주세요."),
  partnerAge: ageSchema,
  partnerMBTI: optionalMbtiSchema,
  partnerPersonalityPreset: z.array(z.string()).max(10, "성격 키워드는 최대 10개까지 선택할 수 있습니다."),
  partnerPersonalityCustom: optionalText(120),
  partnerReligion: z.union([oneOf(religionValues, "종교를 선택해주세요."), z.literal("")]),

  relationshipDuration: oneOf(durationValues, "교제 기간을 선택해주세요."),
  breakupDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "이별 날짜를 선택해주세요.")
    .refine((value) => new Date(`${value}T00:00:00`).getTime() <= Date.now(), "이별 날짜는 오늘 이전이어야 합니다."),
  breakupReason: oneOf(breakupReasonValues, "이별 사유를 선택해주세요."),
  breakupReasonDetail: z.string().trim().min(20, "이별 사유 상세 설명은 20자 이상 입력해주세요.").max(2000),
  currentContact: oneOf(contactValues, "현재 연락 상태를 선택해주세요."),
  distance: oneOf(distanceValues, "거주 거리를 선택해주세요."),
  partnerCareer: optionalText(120),
  additionalInfo: optionalText(2000),
})

export type ConsultationFormData = z.infer<typeof consultationFormSchema>

const stepFields: Record<number, Array<keyof ConsultationFormData>> = {
  1: ["myGender", "myAge", "partnerGender", "partnerAge"],
  2: [
    "myMBTI",
    "myPersonalityPreset",
    "myPersonalityCustom",
    "myReligion",
    "partnerMBTI",
    "partnerPersonalityPreset",
    "partnerPersonalityCustom",
    "partnerReligion",
  ],
  3: ["relationshipDuration", "breakupDate", "distance", "currentContact", "partnerCareer"],
  4: ["breakupReason", "breakupReasonDetail", "additionalInfo"],
}

export function validateConsultationStep(data: ConsultationFormData, step: number): string[] {
  const result = consultationFormSchema.safeParse(data)
  if (result.success) {
    return []
  }

  const currentStepFields = new Set(stepFields[step] ?? [])

  return result.error.issues
    .filter((issue) => currentStepFields.has(issue.path[0] as keyof ConsultationFormData))
    .map((issue) => issue.message)
}
