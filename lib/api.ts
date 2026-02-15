import type { ConsultationFormData } from "@/lib/consultation-schema"
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

interface AnalyzeResponse {
  analysis: ReunionAnalysis
}

interface ErrorResponse {
  errorCode?: ApiErrorCode
  message?: string
}

export async function analyzeReunionProbability(formData: ConsultationFormData): Promise<ReunionAnalysis> {
  let response: Response

  try {
    response = await fetch("/api/reunion/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
  } catch {
    throw new ApiError("NETWORK_ERROR", 0, "네트워크 연결 상태를 확인해주세요.")
  }

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => ({}))) as ErrorResponse

    throw new ApiError(
      errorPayload.errorCode ?? "UNKNOWN_ERROR",
      response.status,
      errorPayload.message ?? "분석 요청에 실패했습니다.",
    )
  }

  const payload = (await response.json()) as AnalyzeResponse
  const parsed = reunionAnalysisSchema.safeParse(payload.analysis)

  if (!parsed.success) {
    throw new ApiError("PARSE_ERROR", 502, "분석 결과 형식이 올바르지 않습니다.")
  }

  return parsed.data
}
