// iq-spiral-buddy client — SSE 스트림 lifecycle 관리 (공유 모듈)
//
// 모든 스트리밍 fetch는 handle을 만들어 group("session"/"lookup")으로
// 추적하고, 패널 닫기/세션 전환 시 abortStreams(group)으로 일괄 중단.
// chunk 간 STREAM_INACTIVITY_MS 넘으면 자동 abort (총 시간 제한이 아니라
// "멈춤" 감지 — 긴 생성은 chunk가 계속 오므로 안 걸림).
//
// _activeStreams는 이 모듈 내부 상태 — export 안 함.

export const STREAM_INACTIVITY_MS = 60_000;
const _activeStreams = new Set();

export function createStreamHandle(group) {
  const handle = {
    group,
    controller: new AbortController(),
    // 사용자 액션(패널 닫기/세션 전환)에 의한 중단 = true → 에러 UI 안 띄움
    intentional: false,
  };
  _activeStreams.add(handle);
  return handle;
}

export function finishStreamHandle(handle) {
  _activeStreams.delete(handle);
}

/** group의 진행 중 스트림 전부 중단. group 생략 시 전체. */
export function abortStreams(group) {
  for (const h of [..._activeStreams]) {
    if (group && h.group !== group) continue;
    h.intentional = true;
    try {
      h.controller.abort();
    } catch {}
    _activeStreams.delete(h);
  }
}

export function isIntentionalAbort(err, handle) {
  return !!handle?.intentional && err?.name === "AbortError";
}

/**
 * reader를 inactivity timeout과 함께 소비. chunk마다 onChunk(text) 호출.
 * 멈춤 감지 시 abort + throw — 호출자 catch에서 사용자에게 표시.
 */
export async function pumpStream(reader, handle, onChunk) {
  const decoder = new TextDecoder();
  while (true) {
    let timer = null;
    let result;
    const readP = reader.read();
    // race에서 진 read의 늦은 reject가 unhandled rejection 안 되게
    readP.catch(() => {});
    try {
      result = await Promise.race([
        readP,
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            try {
              handle.controller.abort();
            } catch {}
            reject(
              new Error(
                `서버 응답이 ${STREAM_INACTIVITY_MS / 1000}초간 멈춰서 중단했어요 — 다시 시도해주세요`,
              ),
            );
          }, STREAM_INACTIVITY_MS);
        }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
    if (result.done) break;
    onChunk(decoder.decode(result.value, { stream: true }));
  }
}

export function parseSseMessage(raw) {
  const lines = raw.split("\n");
  let event = "message";
  let data = "";
  for (const line of lines) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) data += line.slice(5).trim();
  }
  if (!data) return null;
  try {
    return { event, data: JSON.parse(data) };
  } catch {
    return null;
  }
}
