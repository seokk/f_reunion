import type { ConsultationFormData } from "@/lib/consultation-schema"
import { formatFormDataToMessage } from "@/lib/reunion-message"
import { reunionAnalysisSchema, type ReunionAnalysis } from "@/lib/reunion-analysis-schema"

export { type ReunionAnalysis }

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "AUTH_ERROR"
  | "UPSTREAM_ERROR"
  | "PARSE_ERROR"
  | "NETWORK_ERROR"
  | "BAD_REQUEST"
  | "CONFIG_ERROR"
  | "UNKNOWN_ERROR"

export class ApiError extends Error {
  code: ApiErrorCode
  status: number

  constructor(code: ApiErrorCode, status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.status = status
  }
}

export async function analyzeReunionProbability(formData: ConsultationFormData): Promise<ReunionAnalysis> {
  const backendApiUrl = process.env.NEXT_PUBLIC_REUNION_API_URL
  const backendApiKey = process.env.NEXT_PUBLIC_REUNION_API_KEY

  if (!backendApiUrl) {
    throw new ApiError("CONFIG_ERROR", 500, "NEXT_PUBLIC_REUNION_API_URL 설정이 필요합니다.")
  }

  let response: Response

  try {
    response = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      body: JSON.stringify({
        message: formatFormDataToMessage(formData),
      }),
    })
  } catch {
    throw new ApiError("NETWORK_ERROR", 0, "네트워크 연결 상태를 확인해주세요.")
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new ApiError("AUTH_ERROR", response.status, "인증에 실패했습니다.")
    }
    throw new ApiError("UPSTREAM_ERROR", response.status, "분석 요청에 실패했습니다.")
  }

  const payload = (await response.json()) as { response?: unknown }
  const rawResponse = payload.response

  if (rawResponse === undefined || rawResponse === null) {
    throw new ApiError("PARSE_ERROR", 502, "분석 결과 형식이 올바르지 않습니다.")
  }

  let parsedRaw: unknown
  if (typeof rawResponse === "string") {
    try {
      parsedRaw = JSON.parse(rawResponse)
    } catch {
      throw new ApiError("PARSE_ERROR", 502, "분석 결과 형식이 올바르지 않습니다.")
    }
  } else {
    parsedRaw = rawResponse
  }

  const parsed = reunionAnalysisSchema.safeParse(parsedRaw)

  if (!parsed.success) {
    throw new ApiError("PARSE_ERROR", 502, "분석 결과 형식이 올바르지 않습니다.")
  }

  return parsed.data
}
