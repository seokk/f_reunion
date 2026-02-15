# f_reunion 프로젝트 분석 (프론트엔드)

## 1) 개요
- 기술 스택: `Next.js(App Router)`, `React`, `TypeScript`, `Tailwind CSS v4`, `Radix UI`
- 실행 포트: `8020` (`package.json` scripts 기준)
- 목적: 재회 상담 입력 폼을 받아 백엔드 분석 API 호출 후 리포트 UI 제공

## 2) 디렉터리/핵심 파일
- `app/page.tsx`: 메인 랜딩 페이지
- `app/about/page.tsx`: 상담 폼 진입 페이지
- `components/hero.tsx`: 상단 소개/유도 섹션
- `components/consultation-form.tsx`: 멀티스텝 입력 폼 + API 호출 트리거
- `components/reconciliation-report.tsx`: 분석 결과 리포트 렌더링
- `lib/api.ts`: 백엔드 호출 및 응답 파싱 로직
- `app/layout.tsx`: 전역 레이아웃, 메타, 광고 스크립트
- `app/globals.css`: 디자인 토큰/테마 변수

## 3) 사용자 플로우
1. 사용자가 `app/page.tsx`에서 서비스 소개 확인
2. `상담 시작하기`로 `/about#consultation` 이동
3. `ConsultationForm`에서 4단계 정보 입력
4. 제출 시 `analyzeReunionProbability()` 실행
5. `lib/api.ts`가 백엔드 `/api/v1/chat/` 직접 호출
6. 응답의 `response` 문자열(JSON)을 다시 `JSON.parse`하여 화면 표시
7. `ReconciliationReport`에서 일부 내용은 광고 시청 전/후로 분리 노출

## 4) 빌드/배포 특성
- `next.config.mjs`
  - `typescript.ignoreBuildErrors: true` (타입 에러가 있어도 빌드 진행)
  - `output: 'export'` (정적 export 전제)
  - `images.unoptimized: true`
- `dist/` 폴더 존재로 정적 산출물 배포 흐름이 이미 사용 중인 상태로 보임

## 5) API 연동 구조
- 백엔드 URL이 코드에 하드코딩:
  - `https://reunion-147203938140.europe-west1.run.app/api/v1/chat/`
- 헤더 `X-API-Key`도 프론트 코드에 하드코딩
- 실패 시 에러 텍스트를 그대로 `Error`로 변환

## 6) 유지보수 관점 핵심 포인트
- API 스키마는 `lib/api.ts`의 `ReunionAnalysis` 타입과 강결합
- 백엔드 응답 필드 `response`가 문자열 JSON이라는 가정에 의존
- 폼 검증이 강하지 않아(필수값/범위 제한 부족) 잘못된 요청 가능
- `consultation-form.tsx`, `reconciliation-report.tsx` 단일 파일이 크고 상태가 많아 변경 난이도 높음

## 7) 즉시 확인이 필요한 리스크
- 비밀정보 노출:
  - `lib/api.ts`에 API 키가 클라이언트 번들로 노출됨
- 운영 안정성:
  - 백엔드 URL 하드코딩으로 환경별(dev/stage/prod) 전환 어려움
  - `ignoreBuildErrors: true`로 타입 이슈가 배포에 누락될 가능성
- 보안/비용:
  - 누구나 브라우저에서 키 확인 후 백엔드 직접 호출 가능

## 8) 개선 우선순위 제안
1. API 키를 프론트에서 제거하고, Next 서버 라우트(BFF) 또는 백엔드 인증 재설계
2. API URL을 환경변수(`NEXT_PUBLIC_API_BASE_URL` 등)로 분리
3. `ignoreBuildErrors` 제거 후 타입 에러를 CI에서 차단
4. 폼 스키마 기반 검증(`zod`/`react-hook-form`) 강화
5. `consultation-form`/`reconciliation-report`를 단계별 컴포넌트로 분리
6. 에러 상태 UI 표준화(네트워크, 인증, 파싱 실패 케이스 분리)

## 9) 참고 파일
- `f_reunion/lib/api.ts`
- `f_reunion/components/consultation-form.tsx`
- `f_reunion/components/reconciliation-report.tsx`
- `f_reunion/next.config.mjs`
- `f_reunion/app/page.tsx`
- `f_reunion/app/about/page.tsx`

## 10) 작업 이력 (AdSense 정책 대응)
### 2026-02-15
- 배경:
  - AdSense 경고: `Google-served ads on screens without publisher-content`
  - 이슈 포인트: 전역 광고 스크립트 로드로 인해 콘텐츠가 얇거나 행동 유도 중심 화면(`about` 입력 단계 등)에서도 광고 노출 가능성

- 적용 변경:
  1. 전역 footer 추가 및 정책 접근성 강화
  - 추가: `f_reunion/components/site-footer.tsx`
  - 반영: `f_reunion/app/layout.tsx`
  - 내용: `개인정보처리방침`, `이용약관`, 문의 이메일, 서비스 안내 링크 상시 노출

  2. 정책 페이지 신설
  - 추가: `f_reunion/app/privacy/page.tsx`
  - 추가: `f_reunion/app/terms/page.tsx`
  - 목적: 정책 문서의 상시 접근 보장

  3. AdSense 노출 범위 제한
  - 변경: `f_reunion/app/layout.tsx`
  - 변경: `f_reunion/app/page.tsx`
  - 내용: AdSense 스크립트를 전역에서 제거하고 메인 페이지(`/`)에서만 로드하도록 변경

  4. `about` 콘텐츠 밀도 보강
  - 변경: `f_reunion/app/about/page.tsx`
  - 내용: 운영 원칙/콘텐츠 품질/문의 안내/FAQ 섹션 추가로 저가치 화면 판정 리스크 완화

  5. 정책 문서 원문 동기화 구조로 전환
  - 추가: `f_reunion/lib/policy-text.ts`
  - 변경: `f_reunion/app/privacy/page.tsx`
  - 변경: `f_reunion/app/terms/page.tsx`
  - 내용: `ADSENSE_PROCESS.md`를 직접 읽어 개인정보처리방침/이용약관을 페이지에 원문 그대로 출력

  6. 정책 페이지 가독성 개선(원문 유지)
  - 추가: `f_reunion/components/policy-markdown.tsx`
  - 변경: `f_reunion/app/privacy/page.tsx`
  - 변경: `f_reunion/app/terms/page.tsx`
  - 내용: 마크다운 스타일 렌더링(`제목`, `목록`, `강조`, `링크`) 적용, 내용 축약 없음

- 검증 결과:
  - `npm run build` 성공
  - 정적 라우트 생성 확인: `/`, `/about`, `/privacy`, `/terms`
