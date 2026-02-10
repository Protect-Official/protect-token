# 📐 프로젝트 스타일 가이드

## 언어
- 문서: 한국어 기본, 코드/변수명은 영어
- 커밋 메시지: 영어
- 채팅: 한국어

## 문서 작성
- 마크다운 형식 사용
- 날짜 형식: `YYYY-MM-DD`
- 결정사항은 반드시 문서화
- DEV-LOG.md에 날짜별로 기록

## 코드
- Rust (Anchor framework) — 온체인 프로그램
- TypeScript — 클라이언트/스크립트/봇
- 들여쓰기: 2 spaces
- 변수명: camelCase
- 상수: UPPER_SNAKE_CASE

## 네이밍
- 토큰 이름/티커: 런칭 전 별도 논의
- 파일명: kebab-case (예: `token-deploy.ts`)
- 폴더 구조: 기능별 분리

## 의사결정
- 중요 결정은 채팅에서 논의 → DEV-LOG.md에 기록
- 보안 관련: SECURITY.md 규칙 우선
- 의견 충돌 시: YK 최종 결정
