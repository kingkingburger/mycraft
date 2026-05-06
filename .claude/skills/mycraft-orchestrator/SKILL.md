---
name: mycraft-orchestrator
description: mycraft 프로젝트(게이미피케이션된 개인 루틴/생산성 웹앱)의 모든 작업을 라우팅하는 메인 오케스트레이터. mycraft 디렉토리에서 새 기능 추가, 버그 수정, 주/월간 리뷰, 아키텍처 결정, 코드 리팩토링, QA 검증, 변경 이력 기록 같은 요청이 들어오면 반드시 이 스킬을 호출한다. "다시 실행", "재실행", "이전 결과 기반으로", "수정해줘", "보완해줘" 같은 후속 작업도 동일하게 트리거. 이 스킬은 5인 길드(Quest Master/Dungeon Architect/Forge/Hunter/Sage) 중 적합한 페르소나로 분기하고, 워크플로우 W1~W4 중 하나를 실행한다. 단순 질문(파일 위치, 페르소나 설명)은 직접 답변 가능 — 이 경우 스킬 호출 불필요.
---

# mycraft Orchestrator

mycraft 프로젝트의 모든 작업을 5인 길드 중 적합한 페르소나로 라우팅하고, 워크플로우(W1~W4) 단계를 조율한다.

## Phase 0: 컨텍스트 확인

작업 시작 전 다음을 확인한다.

1. **프로젝트 루트의 [`AGENTS.md`](../../../AGENTS.md)를 먼저 읽는다.** 이 문서가 SSOT이며, 페르소나·워크플로우·트리거·기술 스택 상태가 모두 거기 있다.
2. `_workspace/` 디렉토리 존재 여부 확인:
   - **있고 사용자가 부분 수정 요청** → 부분 재실행 (해당 페르소나만 재호출)
   - **있고 새 작업** → 기존 폴더를 `_workspace_prev_{YYYY-MM-DD}/`로 이동 후 새 작업
   - **없음** → 초기 실행. 디렉토리 생성.
3. AGENTS.md의 `## 기술 스택` 섹션 확인. **미정 상태에서 기능 구현 요청이 오면 W4(아키텍처 결정)부터 진입한다.**

## Phase 1: 페르소나/워크플로우 선택

사용자 요청을 AGENTS.md의 **트리거 규칙** 표와 매칭한다.

| 사용자 표현 | 워크플로우 | 시작 페르소나 |
|------------|----------|------------|
| 새 기능 / 게임 메커닉 / "만들어줘" | W1 | Quest Master |
| 주/월간 리뷰 / 회고 / 목표 추천 | W2 | Sage |
| 버그 / 안 되는 것 | W3 | Hunter |
| 스택 결정 / 아키텍처 첫 합의 | W4 | Dungeon Architect |
| 명시적 호출 ("Quest Master로 작업") | (해당 워크플로우) | 명시된 페르소나 |

복수 매칭 시 위 행이 우선 (Quest > Sage > Hunter > Architect).

## Phase 2: 실행 모드

### Claude Code 환경 (이 스킬이 동작하는 환경)

**기본: 에이전트 팀**

```
1. TeamCreate(team="mycraft-{topic}-team", members=[필요 페르소나 subagent_type])
2. TaskCreate(워크플로우 단계별 작업)
3. 페르소나들이 SendMessage로 자체 조율
4. 결과 수집 후 사용자에게 종합 보고
5. 마지막에 Sage가 AGENTS.md 변경 이력 갱신
```

**예외: 단일 페르소나만 필요한 작업** (예: 단순 주간 리뷰, 단일 버그 분석)
→ Agent 도구 직접 호출 (subagent_type=`{persona-name}`, model=`opus`).

### Codex 환경

이 스킬 자체는 트리거되지 않지만, AGENTS.md의 부록을 따라 단일 실행자가 페르소나 스위칭으로 수행.

## Phase 3: 워크플로우 실행

### W1. 신규 기능 추가

```
Quest Master (기능 정의)
    → _workspace/quest_{topic}.md
Dungeon Architect (스택/스키마/API)
    → _workspace/architecture_{topic}.md
Forge (구현)
    → 코드 변경 + _workspace/forge_log_{topic}.md
Hunter (검증, 경계면 점검 포함)
    → _workspace/hunt_report_{topic}.md
    실패 시 Forge로 되돌림 (최대 2회 재시도)
Sage (변경 이력 기록)
    → AGENTS.md 변경 이력 갱신
```

### W2. 주간/월간 리뷰

```
Sage (분석)
    → _workspace/review_{period}.md
사용자 합의
    (목표 변경이 새 기능 요구) → W1 진입
```

### W3. 버그 수정

```
Hunter (재현 + 가설)
    → _workspace/bug_{id}.md
Forge (수정 + 자체 검증)
Hunter (재검증 + 회귀 테스트 추가)
Sage (변경 이력 기록)
```

### W4. 아키텍처 결정 (스택 미정 시)

```
Dungeon Architect (사용자에게 4가지 합의: 프론트/백/DB/호스팅)
    → AGENTS.md "기술 스택" 섹션 갱신
Sage (변경 이력 기록)
W1으로 진입 (원래 요청 처리)
```

## Phase 4: 데이터 전달 프로토콜

| 전략 | 사용처 |
|------|------|
| **태스크 기반** (TaskCreate/TaskUpdate) | 워크플로우 진행상황 추적 |
| **파일 기반** (`_workspace/{phase}_{persona}_{topic}.md`) | 페르소나 간 산출물 전달, 감사 추적 |
| **메시지 기반** (SendMessage) | 실시간 조율, 짧은 신호 |

파일명 컨벤션 엄수: `{phase}_{persona}_{topic}.{ext}`. 예: `01_quest_xp_system.md`, `02_architecture_xp_system.md`, `03_forge_log_xp_system.md`, `04_hunt_report_xp_system.md`.

## Phase 5: 에러 핸들링

- 페르소나가 실패하면 1회 재시도. 재실패 시 해당 결과 없이 진행하고, 사용자에게 누락 명시.
- 페르소나 간 결과 충돌 (예: Architect와 Forge의 결정 불일치) → 삭제하지 않고 충돌 보고서로 사용자에게 결정 위임.
- AGENTS.md 변경 이력 기록 실패 → 비차단 (작업 자체는 성공). 다음 Sage 호출 시 누락분 일괄 갱신.

## Phase 6: 마무리

- 최종 산출물(코드, 리뷰, 정의서)의 경로를 사용자에게 보고.
- `_workspace/`는 보존 (사후 검증 / 감사 추적용).
- 후속 피드백 요청: "결과에서 개선할 부분이 있나요? 페르소나 구성이나 워크플로우에 바꾸고 싶은 점이 있나요?"

## 테스트 시나리오

### 정상 흐름 (W1)

사용자 요청: "운동 기록할 때마다 XP 받는 기능 추가해줘"

1. Phase 0: AGENTS.md 읽음. 기술 스택 미정 확인 → W4 우선 진입.
2. W4 실행: Dungeon Architect 호출 → 사용자와 스택 합의 → AGENTS.md 갱신.
3. W1 진입: Quest Master → Architect → Forge → Hunter → Sage.
4. 최종: 코드 변경 + `_workspace/` 4개 산출물 + AGENTS.md 변경 이력 한 줄.

### 에러 흐름

사용자 요청: "지난 주 운동 분석해줘" — 그러나 기록 데이터가 없음.

1. Phase 0: AGENTS.md 읽음. W2 진입.
2. Sage 호출.
3. Sage가 데이터 부재 감지 → 추세 추론 거부 → "데이터 누적 단계" 메시지 + 기록 습관 형성 팁.
4. AGENTS.md 변경 이력 갱신 안 함 (실질 변경 없음).

## 후속 작업 키워드

다음 표현이 들어오면 이전 `_workspace/` 산출물을 기반으로 부분 재실행:

- "다시 실행", "재실행", "업데이트", "수정해줘", "보완해줘"
- "이전 결과 기반으로", "결과 개선"
- "{토픽}의 {부분작업}만 다시"
