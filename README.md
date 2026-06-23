# 🌀 Spiral Buddy — 🟢 Green

> AI 버디와 함께하는 **나선형 학습** 데스크톱 앱 — **실천적 지혜 학습용 버디**.
> [iq-spiral-galaxy](https://github.com/iq-spiral-galaxy) 패밀리: 🔴 Red(AI/수학) · 🟢 Green(실천적 지혜) · 🔵 Blue(개발)
> 로드맵 따라가며 학습 → 버디(AI)와 Socratic 대화로 **메커니즘 → 반례 → 판단 규칙** 증류 → **8섹션 구조 노트**로 자동 축적 → 다음 세션에 이전 노트가 컨텍스트로 합류 → 규칙은 **판단 규칙 인덱스**에 쌓임.

<p align="center">
  <a href="https://github.com/iq-spiral-galaxy/spiral-buddy-green/releases/latest"><img alt="latest release" src="https://img.shields.io/github/v/release/iq-spiral-galaxy/spiral-buddy-green?display_name=tag&style=flat-square"></a>
  <img alt="platforms" src="https://img.shields.io/badge/macOS%20%C2%B7%20Windows%20%C2%B7%20Linux-supported-brightgreen?style=flat-square">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-green?style=flat-square">
</p>

---

## 🟢 Green이 다루는 것

돈 · 사람 · 제도 · 역사 — 세상이 작동하는 메커니즘을 판단 규칙으로 증류하는 **실천적 지혜(phronesis)** 영역을 나선형으로 반복 학습합니다. 개발 학습용 [🔵 Blue](https://github.com/iq-spiral-galaxy/spiral-buddy-blue)의 검증된 인프라(자동 업데이트 · 세션 영속화 · 8섹션 노트 파이프라인)를 그대로 물려받은 형제 앱이라 **같은 머신에 Blue와 공존**할 수 있습니다 (포트 · 설정 · 노트 폴더 모두 분리).

> 📚 학습 콘텐츠는 [**IQ Phronesis Lab**](https://github.com/iq-phronesis-lab) — *"Distill, don't collect"*. 6-레이어 스택 31개 레포를 앱에서 한 번에 받을 수 있습니다.

---

<details>
<summary>⚡ <b>30초 설치 — 한 줄 명령으로 바로 받기</b> &nbsp;(클릭해서 펼치기)</summary>

<br/>

> 💡 **API 호출 X — 어떤 버전인지 신경 X.** 아래 명령들은 GitHub Releases의 고정된 `latest` 별칭 URL을 사용해 다운로드합니다. 시간당 제한(rate-limit) 걸리지 않습니다.

### 🍎 macOS — Apple Silicon (M1/M2/M3/M4)
터미널에 그대로 붙여넣기 — 실행 중이면 자동 종료 → 최신 버전 받기 → 설치 → 재실행까지 한 번에:

```bash
osascript -e 'tell application "Spiral Buddy Green" to quit' 2>/dev/null; sleep 1; \
cd /tmp && \
curl -fL -o /tmp/spiral-green.dmg "https://github.com/iq-spiral-galaxy/spiral-buddy-green/releases/latest/download/Spiral-Buddy-Green-latest-arm64.dmg" && \
MOUNT=$(hdiutil attach -nobrowse /tmp/spiral-green.dmg | grep -o '/Volumes/.*' | head -1) && \
rm -rf '/Applications/Spiral Buddy Green.app' && \
cp -R "$MOUNT/Spiral Buddy Green.app" /Applications/ && \
hdiutil detach -quiet "$MOUNT" && \
xattr -cr '/Applications/Spiral Buddy Green.app' && \
rm -f /tmp/spiral-green.dmg && \
open '/Applications/Spiral Buddy Green.app'
```

### 🍎 macOS — Intel
터미널에 그대로 붙여넣기:

```bash
osascript -e 'tell application "Spiral Buddy Green" to quit' 2>/dev/null; sleep 1; \
cd /tmp && \
curl -fL -o /tmp/spiral-green.dmg "https://github.com/iq-spiral-galaxy/spiral-buddy-green/releases/latest/download/Spiral-Buddy-Green-latest.dmg" && \
MOUNT=$(hdiutil attach -nobrowse /tmp/spiral-green.dmg | grep -o '/Volumes/.*' | head -1) && \
rm -rf '/Applications/Spiral Buddy Green.app' && \
cp -R "$MOUNT/Spiral Buddy Green.app" /Applications/ && \
hdiutil detach -quiet "$MOUNT" && \
xattr -cr '/Applications/Spiral Buddy Green.app' && \
rm -f /tmp/spiral-green.dmg && \
open '/Applications/Spiral Buddy Green.app'
```

### 🪟 Windows (PowerShell)
**PowerShell**(시작 메뉴에서 "PowerShell" 검색) 열고 그대로 붙여넣기 — 실행 중이면 자동 종료 → silent install → 재실행:

```powershell
$ErrorActionPreference = "Stop"
Get-Process "Spiral Buddy Green" -EA SilentlyContinue | Stop-Process -Force
$exe = "$env:TEMP\spiral-buddy-green-setup.exe"
Invoke-WebRequest -Uri "https://github.com/iq-spiral-galaxy/spiral-buddy-green/releases/latest/download/Spiral-Buddy-Green-latest-Setup.exe" -OutFile $exe
Start-Process -FilePath $exe -ArgumentList "/S" -Wait
Remove-Item $exe -Force
$app = "$env:LOCALAPPDATA\Programs\spiral-buddy-green\Spiral Buddy Green.exe"
if (Test-Path $app) { Start-Process $app }
```

### 🐧 Linux
```bash
curl -fL -o ~/SpiralBuddyGreen.AppImage "https://github.com/iq-spiral-galaxy/spiral-buddy-green/releases/latest/download/Spiral-Buddy-Green-latest.AppImage"
chmod +x ~/SpiralBuddyGreen.AppImage
~/SpiralBuddyGreen.AppImage
```

> ⚙️ 앱 안에서도 **설정 > 일반 > "새 버전 사용 가능"** 배너에서 한 번 클릭으로 업데이트 가능 (macOS / Windows).
>
> 첫 실행 시 macOS Gatekeeper 경고("'손상되었기 때문에 열 수 없습니다") — 위 명령의 `xattr -cr`이 해결. 노트·설정·워크스페이스는 vault 또는 `~/Library/Application Support/Spiral Buddy Green/`에 저장돼서 재설치해도 안 사라집니다.

</details>

---

## ✨ 주요 기능

### 🧭 판단 루프 — Green의 학습 사이클

> *"결정을 바꾸지 못하는 지식은 잡학이다."* — 모든 기능이 이 한 문장을 향합니다.

| 단계 | 기능 |
|---|---|
| 챕터 고르기 | 💡 **미리보기 카드**가 "이 챕터로 **내릴 수 있는 판단**"을 미리 보여줌 |
| 세션 | 버디가 **메커니즘 → 반례 → 판단 규칙** 순서로 파고드는 Socratic 대화 |
| 저장 직전 | **세션 종료 가드** — 판단 규칙 없이 끝내려 하면 압축 한 턴 제안 |
| 노트 | "판단 규칙" 섹션 + 본질 모델(인센티브·복리·피드백 루프·레버리지) **자동 태깅** |
| 축적 | **판단 규칙 인덱스** — 모든 노트의 규칙만 모은 개인 의사결정 핸드북 |
| 회수 | **Synthesis 모드** — L5 챕터 진입 시 같은 본질 모델의 과거 노트를 자동 소환 |

### 🗺️ 로드맵 + 챕터 학습 흐름
- **로컬 디렉토리** (사용자 폴더 트리) + **GitHub Curated** ([`iq-phronesis-lab`](https://github.com/iq-phronesis-lab) 31개 distilled 레포) — 두 source 공존
- **6-레이어 hierarchy** — Thinking Tools · Money · People · Rules of the Game · Reading the World · Synthesis
- **💡 챕터 미리보기 카드** — 챕터 옆 💡 클릭 → 한 줄 요약 · 핵심 질문 2~3개 · 선수 지식 · **🧭 내릴 수 있는 판단** (Haiku로 생성, 본문 변경 전까지 영구 캐시)
- README 안의 마크다운 링크 등장 순서를 sub-roadmap 학습 순서로 사용 (번호 prefix 없어도 OK)
- 멀티 워크스페이스 — 여러 학습 컨텍스트를 한 vault의 별도 폴더로 분리 (이름·경로 중복 자동 차단)

### 🧭 4단 계층 사이드바
**도메인 → 카테고리 → 레포 → sub-roadmap → 챕터** 트리. 깊은 자료도 한눈에:

- **마지막 학습 자동 활성화** — 앱 재진입 시 마지막 챕터에 좌측 accent border + "마지막" 뱃지 + 자동 스크롤
- **인라인 검색** (⌘F) — 5개 필드 동시 매칭, 매칭된 노드 임시 펼침 + 텍스트 하이라이트
- **레포별 progress bar** + d1/d2/d3 배지

### 💬 버디와의 Socratic 학습 세션
- **depth 사다리** — 같은 챕터를 나선형으로 반복하되 단계마다 목표가 다름:
  **d1** 원리/메커니즘 직관 세우기 → **d2** 반례·경계 조건 사냥 → **d3+** 판단 규칙 압축 + 의사결정 시나리오 적용
- 이전 노트가 자동으로 새 세션 컨텍스트에 포함 — d2부터는 "헷갈렸던 지점"이 진입점
- **Synthesis 모드** — L5(-everywhere) 챕터 진입 시 같은 본질 모델 태그가 붙은 **다른 레이어의 노트 최대 4개**를 자동 소환. "지난주에 가격 차별에서 만난 인센티브, 여기서 또 나왔지?"를 실제 내 노트 근거로
- **세션 종료 가드** — 판단 규칙 없이 End & Save 하면 *"압축하고 끝낼래?"* 한 턴 제안 (세션당 1회, 스킵 가능)
- **스트리밍 응답** — 실시간 토큰 단위 표시
- **모델 선택** — Sonnet 4.6 (기본·추천) / Opus / Haiku 등
- **세션 Pause / Resume** — 일시정지 후 사이드바 PAUSED 섹션에서 멀티 세션 관리, 클릭으로 컨텍스트 유지하며 재개

### 🔍 Look-up 패널 (사이드 학습)
대화 흐름을 끊지 않고 사이드에서 모르는 표현을 즉시 확인:
- **드래그 + 깊이 선택**: 채팅에서 텍스트 드래그 → 간결 / 중간 / 깊이 / 질문 4가지 응답 옵션
- **질문 추가**: 키워드 + 추가 질문 함께 보내기
- **중복 차단** — 같은 `(키워드, 깊이, 추가 질문)` 조합 재요청 시 새 API 호출 안 함
- 카드 자동 펼침/접기 + 👍/👎 만족도 피드백

### 📝 8섹션 구조 노트 — Principle → Boundary → Rule
세션 종료 후 버디가 대화 로그를 다음 8섹션으로 정돈:
1. 한 줄 요약
2. 핵심 원리 (메커니즘) — *왜 작동하는가*
3. 직관 / 비유
4. 사례 / 반례 — *언제 무너지는가*
5. 헷갈렸던 / 확인이 필요한 지점
6. 판단 규칙 — *"X 상황에서 Y가 보이면 Z한다"*
7. 이전 학습과의 연결 (`[[note-title]]` 위키링크)
8. 다음에 볼 것

여기에 🔍 **학습 중 찾아본 표현** — Look-up 카드들이 callout 블록으로 자동 첨부 (Obsidian 호환)

frontmatter도 정리됨: `repo` → `roadmap` → `chapter` → `depth` → `date` → `tags` → `summary` 순.
세션이 본질 모델을 다뤘으면 `incentives` / `compounding` / `feedback-loops` / `leverage` 태그가 **자동 부여** — Synthesis 모드의 횡단 소환이 이 태그를 사용합니다.

### 🎯 깊이 있는 학습 도구
- **Quiz 단계별 난이도** — Quiz 버튼을 누를수록 어려워짐 (원리 확인 → 적용 → 반례·경계조건 → 판단 시나리오)
- **✨ 프롬프트 다듬기** — 보내기 전 거친 질문을 명확한 학습 질문으로 자동 정돈 (`⌘J` / `⌘⇧↵`), `⌘Z`로 원본 복원
- **Cmd+K 통합 검색** — 로드맵·챕터·노트 한 번에

### 🧭 판단 규칙 인덱스 — Green 전용
사이드바 **판단 규칙** 버튼 → vault의 모든 노트에서 "판단 규칙" 섹션만 추출해 한 화면에:
- **레이어별 그룹** (Thinking Tools / Money / People / …) + 규칙 수 배지
- **검색** — 규칙 본문 + 출처(레포·챕터) 동시 매칭
- 규칙 클릭 → 원본 노트를 옵시디언에서 열기
- 학습이 쌓일수록 두꺼워지는 **개인 의사결정 핸드북** — *"결정을 바꾸지 못하는 지식은 잡학이다"*

### 📊 학습 추적
- **활동 캘린더** — 1년치 contribution graph + 5단계 강도
- **Streak 표시** — 연속 학습 일수 + 7일/14일/30일 도달 시 시각 효과
- **챕터별 진도** — 사이드바에 d1/d2/d3 배지 + 진행도 bar

### 🌗 라이트 / 다크 모드 · 🗑️ 안전한 노트 관리 · 🔁 자동 업데이트 · 🛡️ API 오류 자동 복구
- 삭제는 `.trash/`로 이동 (30일 후 자동 청소), 업데이트는 GitHub Releases 폴링 + 원클릭 설치, API `overloaded_error`는 backoff 자동 재시도

---

## 📚 IQ Phronesis Lab 학습 자료 — 6개 레이어 / 31개 레포

설정 모달에서 한 번에 받기. 레이어별 또는 코스 프리셋으로 선택 가능 — **이미 받은 레포는 자동 skip (incremental)**.

| Order | 레이어 | 내용 / 레포 수 |
|---|---|---|
| 1 | 🧠 **Thinking Tools** (L0) | 확률 · 결정 · 멘탈모델 · 편향 · 통계 — 모든 판단의 운영체제 (5) |
| 2 | 💰 **Money** (L1) | 금리 · 재무제표 · 유닛 이코노믹스 · 밸류에이션 · 거시 사이클 · 시장 (7) |
| 3 | 🧲 **People** (L2) | 설득 · 포지셔닝 · 그로스 · 가격 · 카피 · 협상 (6) |
| 4 | ⚖️ **Rules of the Game** (L3) | 미시경제 · 게임이론 · 인센티브 설계 · 창업자 법무 · 전략과 해자 (5) |
| 5 | 📜 **Reading the World** (L4) | 경제사 · 기업 흥망 · 기술 확산 · 지정학 (4) |
| 99 | 🧬 **Synthesis** (L5) | 인센티브 · 복리 · 피드백 루프 · 레버리지 — 레이어 횡단 (4) |

**코스 프리셋** (Setup wizard + 설정 모달 둘 다):
- 🧠 **사고 도구부터** — Thinking Tools (5 repos, 추천 시작점)
- 🚀 **창업가 코스** — Thinking Tools · Money · People · Rules (23 repos)
- 📈 **투자자 코스** — Thinking Tools · Money · Rules · Reading the World (21 repos)
- 🧬 **전체 · 나선형 완주** — 6개 레이어 전부 (31 repos)

---

## 🚀 시작하기

### 1. 다운로드 후 첫 실행

위 한 줄 설치 명령으로 받았다면 자동 실행됨. 그렇지 않으면 `Spiral Buddy Green.app`을 더블클릭.

### 2. 첫 실행 시 Setup Wizard

1. **AI API Key 입력** — 현재 Anthropic 모델 지원, [console.anthropic.com](https://console.anthropic.com/)에서 발급한 `sk-ant-...` 키
2. **노트 보관함 폴더 선택** — 노트가 저장될 폴더 (Obsidian vault 사용 시 자동 감지)
3. *(선택)* **코스 프리셋으로 한 번에 받기** — 위 4종 중 하나 클릭 → 폴더 지정 → incremental git clone

### 3. 학습 시작

좌측 사이드바에서 챕터 선택 (💡로 미리보기) → 버디와 대화 → `End & Save` → 노트 보관함에 자동 생성, 판단 규칙은 🧭 **판단 규칙 인덱스**에 축적.

---

## ⌨️ 단축키

| 단축키 | 동작 |
|-----|-----|
| `⌘B` | 좌측 사이드바 토글 |
| `⌘L` | 우측 Look-up 패널 토글 |
| `⌘K` | 통합 검색 모달 (노트 본문 fulltext) |
| `⌘F` | 사이드바 inline 검색 (로드맵/챕터 필터) |
| `⌘J` | 입력 다듬기 (보내지 않음) |
| `⌘⇧↵` | 입력 다듬어서 즉시 보내기 |
| `⌘Z` (입력란 포커스 시) | 다듬은 직후 원본 복원 |
| `Enter` (입력란) | 보내기 |
| `Shift+Enter` | 줄바꿈 |
| `Esc` (사이드바 검색) | 검색어 비우기 |
| `Esc` (Look-up 패널) | 패널 닫기 |

---

## 🏗️ 개발 / 빌드

```bash
# 의존성 (pnpm 권장)
pnpm install

# 개발 (브라우저 웹앱 모드 — 백엔드 서버 + 자동 브라우저 열기)
pnpm dev

# Electron dev (TypeScript 빌드 + Electron 실행)
pnpm electron:dev

# 패키징 (현재 OS용)
pnpm electron:build:mac    # macOS dmg
pnpm electron:build:win    # Windows exe
pnpm electron:build:linux  # Linux AppImage
```

`.env` 파일 (개발 모드용):
```
ANTHROPIC_API_KEY=sk-ant-...
SPIRAL_VAULT_PATH=/Users/you/Documents/MyNotes
SPIRAL_ROADMAP_ROOT=/path/to/your/roadmaps   # 선택
SPIRAL_CURATED_ORG=iq-phronesis-lab          # 선택
SPIRAL_MODEL=claude-sonnet-4-6               # 선택
```

---

## 🧩 Claude Desktop MCP (옵션)

같은 노트 vault를 공유하는 9개 MCP 도구:

- `spiral_list_roadmaps` · `spiral_list_chapters` · `spiral_get_chapter_context`
- `spiral_save_note` · `spiral_read_note` · `spiral_list_notes` · `spiral_delete_notes`
- `spiral_search`
- `spiral_install_curated`

Claude Desktop 설정에 추가:
```json
{
  "mcpServers": {
    "spiral-buddy-green": {
      "command": "node",
      "args": ["/path/to/spiral-buddy-green/dist/mcp.js"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-...",
        "SPIRAL_VAULT_PATH": "/Users/you/Documents/MyNotes"
      }
    }
  }
}
```

---

## 📂 데이터 위치

- **노트**: `<vault>/spiral-buddy-green/` (워크스페이스마다 별도 sub-dir — Blue의 `spiral-buddy/`와도 안 섞임)
- **휴지통**: `<vault>/spiral-buddy-green/.trash/` (30일 후 자동 청소)
- **앱 설정**: `~/Library/Application Support/Spiral Buddy Green/spiral-buddy-config.json` (macOS)
- **로그**: `~/Library/Logs/Spiral Buddy Green/server.log` (macOS)

재설치해도 위 데이터는 **모두 보존**됩니다.

---

## 🛠️ 디렉토리 구조

```
src/
  ├ config.ts          ─ 환경변수 + Config 인터페이스
  ├ roadmap.ts         ─ discoverRoadmaps · loadRoadmapChapters
  ├ vault.ts           ─ 노트 R/W, listSpiralNotes, trash 관리
  ├ note-writer.ts     ─ 8섹션 구조화 + Look-up callout 첨부
  ├ spiral.ts          ─ AI 기반 다음 챕터 추천
  ├ session-store.ts   ─ 세션 + lookups + pause state 인메모리 store
  ├ claude.ts          ─ Anthropic SDK wrapper (retry/backoff)
  ├ curated.ts         ─ GitHub 조직 레포 on-demand clone
  ├ categories.ts      ─ org → 도메인/카테고리 매핑 + findDomainForCategory
  ├ routes.ts          ─ Hono API routes
  ├ server.ts          ─ 웹앱 진입점
  └ mcp.ts             ─ MCP 서버 진입점

client/                ─ 브라우저 SPA (vanilla JS + ESM)
electron/              ─ Electron main · preload · setup wizard
docs/                  ─ phase별 spec
scripts/               ─ 통합 테스트, 일회성 도구
data/curated-domains.json     ─ iq-phronesis-lab 6-레이어 hierarchy + 코스 프리셋
```

---

## 🤝 Contributing

PR / 이슈 환영. 큰 변경 전엔 이슈로 먼저 논의해주세요.
기여 절차와 sign-off(`git commit -s`) 방법은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.

> 기여물을 제출하면 [기여자 라이선스 동의서(CLA)](CLA.md)에 동의한 것으로 간주됩니다
> (회사 대신 기여 시 [기업용 CLA](CORPORATE_CLA.md)). 기여물의 저작권은 기여자가 보유하되,
> 프로젝트가 이를 자유롭게 이용·재라이선스할 수 있는 권리를 부여하는 표준 조건입니다.
> 코드 기여는 지분·보상과 무관합니다.

## 📄 License

[MIT](LICENSE) © 2026 iq-spiral-galaxy (Spiral Buddy Green)
