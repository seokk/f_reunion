import { NextResponse } from "next/server"
import { consultationFormSchema } from "@/lib/consultation-schema"
import { reunionAnalysisSchema } from "@/lib/reunion-analysis-schema"
import { formatFormDataToMessage } from "@/lib/reunion-message"

interface BackendResponse {
  response: unknown
}

function errorResponse(status: number, errorCode: string, message: string) {
  return NextResponse.json({ errorCode, message }, { status })
}

export async function POST(request: Request) {
  const backendApiUrl = process.env.REUNION_API_URL
  const backendApiKey = process.env.REUNION_API_KEY

  if (!backendApiUrl || !backendApiKey) {
    return errorResponse(500, "CONFIG_ERROR", "서버 설정이 올바르지 않습니다.")
  }

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return errorResponse(400, "BAD_REQUEST", "요청 본문이 올바른 JSON 형식이 아닙니다.")
  }

  const parsedInput = consultationFormSchema.safeParse(rawBody)
  if (!parsedInput.success) {
    return errorResponse(400, "VALIDATION_ERROR", parsedInput.error.issues[0]?.message ?? "입력값을 확인해주세요.")
  }

  try {
    const backendResponse = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": backendApiKey,
      },
      body: JSON.stringify({
        message: formatFormDataToMessage(parsedInput.data),
      }),
      cache: "no-store",
    })

    if (backendResponse.status === 401 || backendResponse.status === 403) {
      return errorResponse(502, "AUTH_ERROR", "분석 서버 인증에 실패했습니다.")
    }

    if (!backendResponse.ok) {
      return errorResponse(502, "UPSTREAM_ERROR", "분석 서버에 일시적인 문제가 발생했습니다.")
    }

    const payload = (await backendResponse.json()) as Partial<BackendResponse>
    if (payload.response === undefined || payload.response === null) {
      return errorResponse(502, "PARSE_ERROR", "분석 결과 형식이 올바르지 않습니다.")
    }

    let parsedRaw: unknown
    if (typeof payload.response === "string") {
      try {
        parsedRaw = JSON.parse(payload.response)
      } catch {
        return errorResponse(502, "PARSE_ERROR", "분석 결과 형식이 올바르지 않습니다.")
      }
    } else {
      parsedRaw = payload.response
    }

    const parsedJson = reunionAnalysisSchema.safeParse(parsedRaw)
    if (!parsedJson.success) {
      return errorResponse(502, "PARSE_ERROR", "분석 결과 형식이 올바르지 않습니다.")
    }

    return NextResponse.json({ analysis: parsedJson.data })
  } catch {
    return errorResponse(502, "NETWORK_ERROR", "네트워크 연결 상태를 확인해주세요.")
  }
}
