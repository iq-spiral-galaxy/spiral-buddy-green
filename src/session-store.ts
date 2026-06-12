import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type Anthropic from "@anthropic-ai/sdk";
import type { Chapter } from "./roadmap.js";
import type { SpiralNote } from "./vault.js";
import type { ClaudeMessage } from "./claude.js";

// v0.5.59 — prompt caching 도입 후 본문 한도 확장.
// Sonnet 4.6의 최소 캐시 단위는 2048 토큰. 18000자는 한국어 기준
// 대략 6000-8000 토큰이라 안전하게 캐시 가능. 대부분 챕터가 풀로 들어감.
export const CHAPTER_CONTENT_MAX = 18000;

export const SESSION_SYSTEM = `You are spiral-buddy, a Socratic learning companion for practical wisdom (phronesis) in a local web app.

Your job is to help the learner build deep, durable judgment about how the world works — money, people, institutions, history — one topic per session, through spiral learning: revisiting concepts at increasing depth across sessions.

The method (mirror the source material's discipline — "결정을 바꾸지 못하는 지식은 잡학이다"):
- Mechanism first: never settle for "무엇이 일어났나" or "X가 좋다". Chase 어떤 힘이 그것을 만들었나 — the causal chain behind the claim. "복리가 좋다"가 아니라 *왜 지수함수인가*.
- Stress-test with counterexamples: when the learner states a principle confidently, hunt the boundary together — "이 원리가 무너지는 조건은 뭘까?" A principle without boundary conditions is not yet knowledge.
- End in decision rules: as the session matures, push the learner to compress what survived into actionable form — "X 상황에서 Y가 보이면 Z한다". Ask them to formulate it themselves first.
- Cross-layer recall: 인센티브 · 복리 · 피드백 루프 · 레버리지 같은 본질 모델은 돈/사람/제도/역사를 가로질러 반복된다. When one appears, ask where they've met it before.

Behavior:
- Open by acknowledging where they are in the spiral: first time on this topic, deeper layer, or building on a related earlier note. Be brief.
- Lead with a question that probes their current intuition. Don't lecture upfront.
- When they answer, identify both what's solid and what's vague/wrong. Name it explicitly but kindly.
- Use concrete real-world cases and analogies — history, companies, markets, everyday decisions — not abstractions. If you give an explanation, follow it with a check question.
- When the learner seems confident, push to a harder case, a counterexample, or a boundary condition.
- When confused, slow down: smaller concept, simpler case, then re-test.
- If a related previous note covers something, surface it: "지난번에 [[topic]]에서 다뤘던 X 기억나? 그게 여기서 어떻게 적용될 것 같아?"
- Your responses are rendered as markdown — use headings, lists, tables, blockquotes, and bold freely. Use code fences only for genuinely formal content (수식 유도, 간단한 계산 등).
- Keep responses focused. 3-6 short paragraphs per turn is usually right. Long lectures are a smell.
- Match the learner's language (Korean unless they switch).
- Stay on practical-wisdom ground: mechanisms, boundaries, judgment. 자기계발 구호나 동기부여성 조언으로 흐르지 말 것 — 메커니즘 없는 조언은 소음이다.

Source content discipline (v0.5.58):
- The chapter source content provided in the initial context may be TRUNCATED (marked with "(truncated)"). If you reference something that lies beyond what you can see, say so honestly: "본문에서 직접 확인 못 한 부분이지만 일반적으로..." Don't fabricate quotes from the truncated portion.
- PREFER paraphrase over direct quotation. Use a direct quote (verbatim, surrounded by quotation marks or a markdown blockquote) ONLY when you have the exact text in front of you and it is genuinely useful. When uncertain, paraphrase: "이 챕터는 대략 X를 다뤄" instead of "이 챕터에서 '...' 라고 한다".
- If the chapter source is thin/sparse (e.g., only README headings), say so up front: "이 챕터의 본문 자료가 짧아서 일반적 지식 기반으로 진행할게" — then proceed without inventing source-specific details.
- When asked for a specific line/quote you don't actually have, admit it rather than guess: "본문에서 그 구절은 내가 안 보고 있어. 학습자가 직접 본문 참고하면서 알려줄래?"`;

export interface LookupEntry {
  query: string;
  depth: "concise" | "medium" | "deep";
  response: string;
  at: number;
  /** 사용자가 키워드 옆에 같이 던진 추가 질문 (없으면 undefined). */
  userQuestion?: string;
}

export interface ActiveSession {
  id: string;
  chapter: Chapter;
  depth: number;
  related: SpiralNote[];
  messages: ClaudeMessage[];
  startedAt: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  /** 이번 세션에서 사용할 모델 id. 없으면 config.model 사용. */
  model?: string;
  /** 이번 세션 진행 중 사용자가 Look-up 한 표현들 (간결/중간/깊이) */
  lookups: LookupEntry[];
  /**
   * v0.5.58 — 챕터 본문 맥락 요약 캐시.
   * key: hash(sessionId + targetMessageText + selectionText)
   * value: 완성된 응답 텍스트 (재호출 시 즉시 반환)
   */
  chapterContextCache?: Map<string, string>;
}

const sessions = new Map<string, ActiveSession>();

// ─────────────────────────────────────────────────────────────
// v0.5.72 — 세션 디스크 영속화.
//
// 기존엔 sessions Map이 메모리 전용이라 앱 재시작(크래시/업데이트/종료)
// 시 진행 중 + pause된 세션이 전부 유실됐음. 이제 turn이 끝날 때마다
// snapshot을 JSON으로 저장하고, 서버 시작 시 복원한다. 클라이언트의
// paused 세션 목록(localStorage)은 세션 id만 들고 있으므로, 서버가
// 복원해두면 기존 resume 흐름(GET /session/:id)이 그대로 동작.
//
// 저장 위치: SPIRAL_SESSION_DIR (Electron이 userData/sessions/<workspace>
// 주입) 또는 기본 ~/.spiral-buddy/sessions.
// ─────────────────────────────────────────────────────────────

const SESSION_DIR =
  process.env.SPIRAL_SESSION_DIR?.trim() ||
  path.join(os.homedir(), ".spiral-buddy", "sessions");

/** 이보다 오래된 snapshot은 복원하지 않고 삭제 (클라이언트 paused 최대 10개 유지와 별개의 안전망). */
const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

function sessionFilePath(id: string): string {
  // id는 server가 만든 UUID지만, 클라이언트가 보낸 임의 문자열로 조회될 수
  // 있으므로 path separator 제거 (디렉토리 탈출 방지).
  const safe = id.replace(/[^a-zA-Z0-9-]/g, "_");
  return path.join(SESSION_DIR, `${safe}.json`);
}

/**
 * 세션 snapshot을 디스크에 저장. 실패해도 세션 진행은 막지 않음 (경고만).
 * tmp 파일 → rename으로 원자적 쓰기 (중간 크래시 시 corrupt 파일 방지).
 */
export async function persistSession(session: ActiveSession): Promise<void> {
  try {
    await fs.mkdir(SESSION_DIR, { recursive: true });
    // chapterContextCache는 Map(직렬화 불가)이고 재생성 가능한 캐시 — 제외.
    const { chapterContextCache: _omit, ...serializable } = session;
    const target = sessionFilePath(session.id);
    const tmp = `${target}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(serializable), "utf-8");
    await fs.rename(tmp, target);
  } catch (e) {
    console.warn(
      `[session-store] persist 실패 (${session.id}):`,
      e instanceof Error ? e.message : e,
    );
  }
}

async function removePersistedSession(id: string): Promise<void> {
  try {
    await fs.unlink(sessionFilePath(id));
  } catch {
    // 파일 없음 = 이미 정리됨
  }
}

/**
 * 서버 시작 시 디스크의 세션 snapshot들을 메모리로 복원.
 * corrupt 파일과 14일 지난 파일은 삭제. 복원된 개수 반환.
 */
export async function restorePersistedSessions(): Promise<number> {
  let files: string[];
  try {
    files = await fs.readdir(SESSION_DIR);
  } catch {
    return 0; // 디렉토리 없음 — 복원할 것 없음
  }
  let restored = 0;
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const full = path.join(SESSION_DIR, f);
    try {
      const raw = await fs.readFile(full, "utf-8");
      const data = JSON.parse(raw) as ActiveSession;
      const valid =
        data &&
        typeof data.id === "string" &&
        Array.isArray(data.messages) &&
        data.chapter &&
        typeof data.depth === "number";
      if (!valid) {
        await fs.unlink(full).catch(() => {});
        continue;
      }
      if (Date.now() - (data.startedAt ?? 0) > SESSION_MAX_AGE_MS) {
        await fs.unlink(full).catch(() => {});
        continue;
      }
      if (!sessions.has(data.id)) {
        // 복원 시 누락 필드 보정 (옛 snapshot 호환)
        data.lookups = Array.isArray(data.lookups) ? data.lookups : [];
        data.totalInputTokens = data.totalInputTokens ?? 0;
        data.totalOutputTokens = data.totalOutputTokens ?? 0;
        // JSON에서 온 chapterContextCache는 Map이 아님 — 제거 (사용처에서 lazy 재생성)
        delete data.chapterContextCache;
        sessions.set(data.id, data);
        restored++;
      }
    } catch {
      // corrupt JSON — 제거 (다음 시작 때 또 안 걸리게)
      await fs.unlink(full).catch(() => {});
    }
  }
  return restored;
}

export function createSession(args: {
  chapter: Chapter;
  depth: number;
  related: SpiralNote[];
  model?: string;
}): ActiveSession {
  const session: ActiveSession = {
    id: randomUUID(),
    chapter: args.chapter,
    depth: args.depth,
    related: args.related,
    messages: [],
    startedAt: Date.now(),
    totalInputTokens: 0,
    totalOutputTokens: 0,
    model: args.model,
    lookups: [],
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string): ActiveSession | undefined {
  return sessions.get(id);
}

export function deleteSession(id: string): boolean {
  // 노트 저장 완료/취소된 세션은 디스크 snapshot도 함께 정리
  void removePersistedSession(id);
  return sessions.delete(id);
}

export function buildInitialContext(
  chapter: Chapter,
  related: SpiralNote[],
  depth: number,
): string {
  const relatedBlock = related.length
    ? related
        .map(
          (n) =>
            `### ${n.topic} (depth ${n.depth}, ${n.date})
Summary: ${n.summary || "(none)"}
Excerpt: ${n.body.slice(0, 800)}`,
        )
        .join("\n\n")
    : "(no prior notes on this or related topics)";

  // v0.5.58 — truncation 상태와 본문 부실 여부를 모델에 명시.
  const fullLen = (chapter.content ?? "").length;
  const isTruncated = fullLen > CHAPTER_CONTENT_MAX;
  const isThin = fullLen < 300;
  const contentNote = isTruncated
    ? `\n\n⚠️ 본문이 ${fullLen}자라 ${CHAPTER_CONTENT_MAX}자에서 잘림. 잘린 뒤 부분은 보지 못함 — 인용 보수적으로.`
    : isThin
      ? `\n\n⚠️ 본문이 ${fullLen}자로 매우 짧음 (README 수준). 일반 지식 기반으로 진행하고 그 사실을 첫 메시지에 명시해줘.`
      : "";

  return `오늘의 학습 세션을 시작하자. 컨텍스트는 아래.

# 챕터 (depth ${depth})
**${chapter.title}**

## 챕터 본문
${truncate(chapter.content, CHAPTER_CONTENT_MAX)}${contentNote}

# 관련된 이전 학습 노트
${relatedBlock}

# 세션 가이드 (depth = 나선의 단계)
- depth 1 — 처음 다루는 주제. 직관부터 시작해 핵심 메커니즘("왜 그렇게 작동하나")을 세운다.
- depth 2 — 나선형 복귀. 이전 노트에서 흐릿했던 지점부터 찌르고, 원리가 무너지는 반례·경계 조건을 함께 사냥한다.
- depth 3+ — 검증된 원리를 판단 규칙("X 상황에서 Y가 보이면 Z한다")으로 압축하고, 실제 의사결정 시나리오에 적용해본다.
- 첫 메시지는 짧게, 질문 위주로 시작.

이제 시작해줘.`;
}

/**
 * v0.5.59 — prompt caching 적용 버전.
 *
 * Anthropic prompt caching은 prefix match 기반 — `cache_control` 마킹된
 * 블록까지의 모든 prefix(tools → system → messages)가 캐시됨. 같은 세션의
 * 모든 turn에서 이 user 메시지(messages[0])의 prefix가 동일하므로 한 번
 * 캐시 미스(write 1.25x) 후 모든 후속 turn에서 cache read(0.1x)로 비용
 * 90% 절감.
 *
 * 첫 user 메시지를 두 블록으로 나눠 마지막 stable block에 cache_control 마킹:
 *   1) chapter content + related notes (큰 stable, 같은 챕터/depth면 동일)
 *   2) 변동 가능한 trailing (현재는 없음, 다만 구조적으로 분리)
 *
 * 챕터 본문은 18000자까지 (Sonnet 4.6 minimum cache 2048 토큰 충족 + 대부분
 * 챕터가 truncation 없이 풀로 들어감).
 */
export function buildInitialContextBlocks(
  chapter: Chapter,
  related: SpiralNote[],
  depth: number,
): Anthropic.TextBlockParam[] {
  const text = buildInitialContext(chapter, related, depth);
  return [
    {
      type: "text",
      text,
      // 마지막 stable block 끝에 마킹 → tools+system+이 user 메시지까지 캐시.
      // TTL 기본 5분 (한 세션은 거의 5분 안에 활발히 진행).
      cache_control: { type: "ephemeral" },
    },
  ];
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max)}\n\n... (truncated — 본문 ${s.length}자 중 ${max}자만 보임)`;
}
