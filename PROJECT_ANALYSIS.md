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
5. 프론트는 `lib/api.ts`를 통해 내부 라우트 `/api/reunion/analyze` 호출
6. 내부 라우트(`app/api/reunion/analyze/route.ts`)가 서버 환경변수 기반으로 백엔드 `/api/v1/chat/` 호출
7. 입력은 Zod 스키마(`lib/consultation-schema.ts`)로 검증 후 전송
8. 응답은 스키마(`lib/reunion-analysis-schema.ts`)로 검증 후 화면 표시
9. `ReconciliationReport`에서 일부 내용은 광고 시청 전/후로 분리 노출

## 4) 빌드/배포 특성
- `next.config.mjs`
  - `images.unoptimized: true`
- 타입 에러는 빌드에서 차단됨(`ignoreBuildErrors` 제거)
- `/api/reunion/analyze` 서버 라우트가 추가되어 완전 정적 export 전제와 분리된 구조

## 5) API 연동 구조
- 클라이언트는 내부 API(`/api/reunion/analyze`)만 호출
- 백엔드 URL/API 키는 서버 환경변수 사용
  - `REUNION_API_URL`
  - `REUNION_API_KEY`
- 서버 라우트에서 입력/응답을 스키마 검증하고 표준 에러 코드 반환
  - `VALIDATION_ERROR`, `AUTH_ERROR`, `PARSE_ERROR`, `UPSTREAM_ERROR`, `NETWORK_ERROR` 등

## 6) 유지보수 관점 핵심 포인트
- 타입/스키마 기준점이 분리됨
  - 입력: `lib/consultation-schema.ts`
  - 분석 결과: `lib/reunion-analysis-schema.ts`
  - 프롬프트 메시지 변환: `lib/reunion-message.ts`
- 에러 매핑이 중앙화됨: `lib/analyze-error.ts`
- 대형 컴포넌트가 분리되어 수정 범위가 축소됨
  - `components/consultation/steps.tsx`
  - `components/reconciliation/sections.tsx`

## 7) 즉시 확인이 필요한 리스크
- 잔여 운영 리스크:
  - 내부 API 라우트 사용으로 서버 런타임(또는 동등한 프록시 계층) 필요
  - 환경변수 미설정 시 `CONFIG_ERROR`로 요청 실패
  - `npm run lint`는 현재 `eslint` 실행 환경 정비 필요

## 8) 개선 우선순위 제안
1. 완료: API 키 제거 + BFF(`/api/reunion/analyze`) 적용
2. 완료: 백엔드 URL/API 키 환경변수 분리
3. 완료: `ignoreBuildErrors` 제거
4. 완료: Zod 기반 입력/응답 검증 강화
5. 완료: `consultation-form`/`reconciliation-report` 분리 리팩터링
6. 완료: 에러 상태 UI 표준화(코드별 안내 문구/복구 안내)
7. 후속 권장: CI에 `npm run build` + lint 환경 고정
8. 후속 권장: e2e/통합 테스트 추가(폼 검증, API 오류 코드별 UI 검증)

## 9) 참고 파일
- `f_reunion/lib/api.ts`
- `f_reunion/lib/analyze-error.ts`
- `f_reunion/lib/consultation-schema.ts`
- `f_reunion/lib/reunion-analysis-schema.ts`
- `f_reunion/lib/reunion-message.ts`
- `f_reunion/app/api/reunion/analyze/route.ts`
- `f_reunion/.env.example`
- `f_reunion/components/consultation-form.tsx`
- `f_reunion/components/consultation/steps.tsx`
- `f_reunion/components/reconciliation-report.tsx`
- `f_reunion/components/reconciliation/sections.tsx`
- `f_reunion/next.config.mjs`
- `f_reunion/app/page.tsx`
- `f_reunion/app/about/page.tsx`

## 10) 작업 이력
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

### 2026-02-15 (구조/보안/유지보수 개선)
- 적용 변경:
  1. 프론트 직접 백엔드 호출 제거(BFF 적용)
  - 추가: `f_reunion/app/api/reunion/analyze/route.ts`
  - 변경: `f_reunion/lib/api.ts`
  - 내용: API 키를 서버로 이동하고 내부 라우트만 호출

  2. 환경변수 기반 운영 설정 전환
  - 추가: `f_reunion/.env.example`
  - 내용: `REUNION_API_URL`, `REUNION_API_KEY` 기준으로 실행

  3. 검증/파싱 안정성 강화
  - 추가: `f_reunion/lib/consultation-schema.ts`
  - 추가: `f_reunion/lib/reunion-analysis-schema.ts`
  - 추가: `f_reunion/lib/reunion-message.ts`
  - 내용: 입력/응답 스키마 검증 및 메시지 빌더 분리

  4. 타입 엄격 배포 복구
  - 변경: `f_reunion/next.config.mjs`
  - 내용: `ignoreBuildErrors` 제거

  5. 컴포넌트 모듈화
  - 변경: `f_reunion/components/consultation-form.tsx`
  - 추가: `f_reunion/components/consultation/steps.tsx`
  - 변경: `f_reunion/components/reconciliation-report.tsx`
  - 추가: `f_reunion/components/reconciliation/sections.tsx`
  - 내용: 대형 파일을 상태/표현 계층으로 분리

  6. 에러 UI 표준화
  - 추가: `f_reunion/lib/analyze-error.ts`
  - 변경: `f_reunion/components/consultation-form.tsx`
  - 변경: `f_reunion/components/consultation/steps.tsx`
  - 내용: 네트워크/인증/응답파싱/입력오류를 코드별 문구로 구분 표시

- 검증 결과:
  - `npm run build` 성공
  - 라우트 확인: `/api/reunion/analyze` 생성

### 2026-02-15 (배포 이슈 정리: Firebase 정적 호스팅)
- 배경:
  - 실제 배포는 `Firebase Hosting + f_reunion/out`(정적 산출물) 기반
  - 코드가 `app/api/reunion/analyze`(Next 서버 라우트) 의존으로 변경되어 정적 배포와 불일치 발생
  - 결과적으로 배포 번들에서 구버전 스크립트/로그가 보이거나, API 동작이 기대와 다를 수 있는 상태였음

- 원인:
  - 정적 export(`out`)는 Next 서버 라우트를 포함하지 않음
  - `firebase deploy`는 `f_reunion/out`만 업로드하므로 서버 라우트 기반 구조는 배포 산출물에 반영되지 않음

- 적용 변경:
  1. 정적 배포 호환 구조로 재정렬
  - 변경: `f_reunion/next.config.mjs`
  - 내용: `output: "export"` 명시

  2. 서버 라우트 제거
  - 삭제: `f_reunion/app/api/reunion/analyze/route.ts`

  3. API 호출 경로 정적 호스팅 방식으로 전환
  - 변경: `f_reunion/lib/api.ts`
  - 내용: 내부 `/api/reunion/analyze` 대신 `NEXT_PUBLIC_REUNION_API_URL` 직접 호출

  4. 환경변수 키 정리
  - 변경: `f_reunion/.env.example`
  - 내용: `NEXT_PUBLIC_REUNION_API_URL`, `NEXT_PUBLIC_REUNION_API_KEY` 기준으로 통일

- 검증 결과:
  - `npm run build` 성공, `out/` 재생성 완료
  - 구버전 디버그 문자열(`=== API 응답 성공 ===`)이 최신 `out` 번들에서 제거됨
  - Firebase 정적 배포 기준으로 최신 코드 반영 확인

### 2026-02-15 (UI/콘솔 경고 마무리)
- 적용 변경:
  1. 상담 CTA 아이콘 라벨 추가
  - 변경: `f_reunion/components/reconciliation/sections.tsx`
  - 내용: 인스타그램/텔레그램 아이콘 하단에 `Instagram`, `Telegram` 라벨 표시

  2. AdSense 콘솔 경고 완화
  - 변경: `f_reunion/app/page.tsx`
  - 내용: `next/script` 대신 일반 `<script async ...>`로 전환하여 `data-nscript` 관련 경고 대응

  3. Footer 문의 채널 확장
  - 변경: `f_reunion/components/site-footer.tsx`
  - 내용: 문의 이메일 하단에 인스타그램/텔레그램 아이콘 링크 추가(환경변수 설정 시 노출)

- 참고:
  - CSS preload warning(`preloaded but not used`)은 App Router 정적 배포 환경에서 발생 가능한 성능 힌트 수준 경고로 기능 오류는 아님

- 검증 결과:
  - `npm run build` 성공
  - 배포 후 `/about#consultation`에서 광고 시청 후 상담 아이콘/라벨 표시 확인
  - footer 문의 영역에서 인스타그램/텔레그램 아이콘 노출 확인
