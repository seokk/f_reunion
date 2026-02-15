import { readFile } from "node:fs/promises"
import path from "node:path"

const TERMS_HEADING = "\n# 이용약관"

export async function getPolicySourceText() {
  const sourcePath = path.join(process.cwd(), "ADSENSE_PROCESS.md")
  const raw = await readFile(sourcePath, "utf8")
  const splitIndex = raw.indexOf(TERMS_HEADING)

  if (splitIndex === -1) {
    throw new Error("이용약관 섹션을 ADSENSE_PROCESS.md에서 찾지 못했습니다.")
  }

  return {
    privacy: raw.slice(0, splitIndex).trim(),
    terms: raw.slice(splitIndex + 1).trim(),
  }
}
