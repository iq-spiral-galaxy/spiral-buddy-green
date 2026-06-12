# Claude Code Context — spiral-buddy-green

🟢 **Spiral Buddy Green** — 나선형 학습 데스크톱 앱, **실천적 지혜 학습용 버디**.

## 갤럭시 패밀리

[iq-spiral-galaxy](https://github.com/iq-spiral-galaxy): 🔴 Red(AI/수학) · 🟢 Green(실천적 지혜) · 🔵 Blue(개발).
RGB 삼원색 — 세 버디가 모이면 백색광(완전한 지혜)이 된다는 메타포.

## 이 레포의 기원

[spiral-buddy-blue](https://github.com/iq-spiral-galaxy/spiral-buddy-blue) @ fcf6bf1 (v0.5.87+) 스냅샷에서 부트스트랩됨.
Blue는 실사용 중인 완성형 앱 — 이 레포는 그 인프라를 물려받아 **실천적 지혜** 도메인으로 특화한다.

## ⚠ Phase 0 — 정체성 분기 (다른 작업 전에 반드시 먼저)

Blue와 같은 머신에 공존해야 하므로 아래를 안 바꾸면 **사용자 데이터가 Blue와 충돌**한다:

1. **electron-builder.yml**
   - `appId: com.iq-lab.spiral-buddy-green` (현재 com.iq-lab.spiral-buddy — 안 바꾸면 userData 충돌)
   - `productName: Spiral Buddy Green` (설치 경로/프로세스명/dmg 볼륨명이 여기서 파생)
   - `publish.repo: spiral-buddy-green` (owner는 iq-spiral-galaxy 그대로)
2. **electron/main.cjs**
   - `GH_REPO = "spiral-buddy-green"` (자동 업데이트 체크/다운로드 대상)
   - `PREFERRED_PORT = 4557` (Blue 4517 — 같으면 localStorage origin 충돌 + 동시 실행 불가)
   - macOS 업데이트 스크립트의 하드코딩 경로: "Spiral Buddy" → "Spiral Buddy Green" (osascript 앱명, /Applications 경로, dmg 볼륨명, asset 파일명 prefix)
   - Windows relaunch 후보 경로의 spiral-buddy → 새 productName 파생형
3. **src/vault.ts + src/chapter-preview-cache.ts** (SPIRAL_DIR 중복 정의 주의)
   - 기본 vault sub-dir: "spiral-buddy" → "spiral-buddy-green" (Blue 노트와 섞이면 안 됨)
4. **.github/workflows/release.yml**
   - 릴리즈 본문 설치 명령 URL + latest-alias asset 이름 (Spiral-Buddy-latest-* → 새 productName 파생)
5. **package.json**: name → spiral-buddy-green, version → 0.1.0부터 시작
6. **README.md**: 🟢 Green 정체성으로 재작성 (패밀리 한 줄은 유지)
7. **브랜드 컬러**: client/styles.css의 --accent 계열(시안/바이올렛)을 green 팔레트로. 로고 SVG gradient(client/index.html)도

Phase 0 끝나면 `pnpm i && pnpm build`로 검증하고 첫 태그(v0.1.0) 전에 빌드 워크플로 동작 확인.

## 콘텐츠 분기 (Phase 1)

- ✅ Green의 curated org는 [`iq-phronesis-lab`](https://github.com/iq-phronesis-lab) — 실천지 31개 레포, 6-레이어 스택
  (L0 Thinking Tools 5 · L1 Money 7 · L2 People 6 · L3 Rules 5 · L4 Reading the World 4 · L5 Synthesis 4)
- ✅ `data/curated-domains.json` 재작성 완료 — 6개 레이어 도메인 + 코스 프리셋 4종 (사고 도구부터/창업가/투자자/전체)
- ✅ curatedOrg 기본값·UI 텍스트 전부 iq-phronesis-lab으로 교체 (config.ts/main.cjs/app.js/setup)
- ⬜ 시스템 프롬프트(src/session-store.ts SESSION_SYSTEM)를 실천적 지혜 학습 성격에 맞게 조정 검토

## 물려받은 인프라 (바꾸지 말 것 — Blue에서 검증된 핵심)

- **자동 업데이트**: in-app 다운로드(Node https, 진행률) + installer 직접 실행. PowerShell 스크립트 방식으로 되돌리지 말 것 (Blue에서 TLS/정책 문제로 폐기)
- **업데이트 실패 가시화**: pending-update marker → 다음 부팅 때 판정
- **세션 영속화**: turn마다 디스크 snapshot (userData/sessions/) — 재시작 후 resume
- **고정 포트**: localStorage origin 안정화 (테마/패널폭/일시정지 목록 유지)
- **서버 TTL 캐시**: notes 30s / roadmaps 60s / chapters 30s + 쓰기 시 invalidate
- **보안**: API 키 safeStorage 암호화, openExternal whitelist, DOMPurify(renderMarkdown)
- **SSE**: AbortController group + inactivity timeout + safeMarkedInto (marked 실패 fallback)

## 아키텍처 (Blue 기준)

```
src/        Hono API 서버 (config/roadmap/vault/session-store/claude/curated/routes/server/mcp)
client/     vanilla JS SPA (app.js 단일 파일 ~5600줄 + styles.css ~9300줄)
electron/   main.cjs (업데이트/워크스페이스/IPC) + preload + setup wizard
data/       curated 도메인 매핑
```

## 릴리즈 관례 (Blue와 동일)

feature 브랜치 → commit → tag(vX.Y.Z) → push → GitHub Actions 빌드 대기 → 성공 시 main FF → 임시 브랜치 삭제.
직접 main push는 docs 전용 변경만.

## Blue에서 배운 함정들 (반복 금지)

- CSS: flex 안에서 margin auto는 stretch를 무력화 (fit-content 추락) / grid 1fr은 minmax(0,1fr)로
- marked.parse는 반드시 try/catch (특정 마크다운에서 throw → UI 잠금 사고)
- 라이트 모드 gradient text는 -webkit-text-fill-color까지 리셋해야 보임
- inline style은 CSS 클래스 변수를 이기므로 클래스 토글 기능과 충돌 주의
- setup wizard 저장은 기존 config를 merge해야 함 (덮어쓰면 멀티 워크스페이스 소실)
