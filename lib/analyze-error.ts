import { ApiError, type ApiErrorCode } from "@/lib/api"

export interface AnalyzeErrorState {
  code: ApiErrorCode | "UNKNOWN_ERROR"
  title: string
  description: string
  recovery: string
  tone: "critical" | "warning"
}

export function mapAnalyzeError(error: unknown): AnalyzeErrorState {
  if (!(error instanceof ApiError)) {
    return {
      code: "UNKNOWN_ERROR",
      title: "분석 요청 실패",
      description: "요청을 처리하는 중 알 수 없는 오류가 발생했습니다.",
      recovery: "잠시 후 다시 시도해주세요.",
      tone: "critical",
    }
  }

  switch (error.code) {
    case "NETWORK_ERROR":
      return {
        code: error.code,
        title: "네트워크 연결 오류",
        description: "서버에 연결하지 못했습니다.",
        recovery: "네트워크 상태를 확인한 뒤 다시 시도해주세요.",
        tone: "critical",
      }
    case "AUTH_ERROR":
    case "CONFIG_ERROR":
      return {
        code: error.code,
        title: "인증/설정 오류",
        description: "서비스 인증 또는 서버 설정에 문제가 있습니다.",
        recovery: "잠시 후 다시 시도하고, 반복되면 문의해주세요.",
        tone: "critical",
      }
    case "PARSE_ERROR":
      return {
        code: error.code,
        title: "응답 처리 오류",
        description: "분석 결과를 처리하지 못했습니다.",
        recovery: "잠시 후 다시 시도해주세요.",
        tone: "critical",
      }
    case "UPSTREAM_ERROR":
      return {
        code: error.code,
        title: "분석 서버 오류",
        description: "분석 서버에 일시적인 문제가 발생했습니다.",
        recovery: "잠시 후 다시 시도해주세요.",
        tone: "critical",
      }
    case "VALIDATION_ERROR":
    case "BAD_REQUEST":
      return {
        code: error.code,
        title: "입력값 오류",
        description: error.message || "입력값을 확인해주세요.",
        recovery: "필수 항목과 형식을 확인한 뒤 다시 제출해주세요.",
        tone: "warning",
      }
    default:
      return {
        code: "UNKNOWN_ERROR",
        title: "분석 요청 실패",
        description: error.message || "요청 처리 중 오류가 발생했습니다.",
        recovery: "잠시 후 다시 시도해주세요.",
        tone: "critical",
      }
  }
}
