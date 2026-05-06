# mycraft — Claude Code Pointer

> **이 파일은 포인터다. 페르소나·워크플로우·트리거 규칙의 SSOT는 [AGENTS.md](./AGENTS.md)다.**
> Claude Code와 Codex 모두 같은 동작을 하도록, 정의는 한 곳(AGENTS.md)에서만 관리한다.

## 가장 먼저 할 일

1. 같은 디렉토리의 [AGENTS.md](./AGENTS.md)를 읽는다. 페르소나 5명, 워크플로우, 트리거 규칙이 모두 거기에 있다.
2. 사용자 요청을 받으면 AGENTS.md의 **트리거 규칙** 표를 참고하여 어느 페르소나로 시작할지 판단한다.

## Claude Code 특화 사항

Codex와 달리 Claude Code는 다음 자원을 추가로 사용할 수 있다.

- **에이전트 정의**: `.claude/agents/{name}.md`
  - `quest-master`, `dungeon-architect`, `forge`, `hunter`, `sage` (5개)
  - 각 파일은 AGENTS.md의 해당 페르소나 섹션을 인터페이스 형식으로 노출한다 (model: opus 명시).
  - 호출 방법: Agent 도구의 `subagent_type`으로 지정.

- **스킬 정의**: `.claude/skills/{name}/SKILL.md`
  - `mycraft-orchestrator` — 메인 라우터. mycraft 작업 일반에 자동 트리거.
  - `gamification-design` — 게임 메커닉(XP/레벨/보상) 설계.
  - `weekly-review` — 주/월간 기록 분석 + 다음 목표 추천.
  - `boundary-check` — API↔프론트 경계면 정합성 검증.

- **실행 모드**: 기본적으로 **에이전트 팀** (TeamCreate + SendMessage + TaskCreate). 단일 작업이면 Agent 도구 직접 호출.

## 운영 규칙

- 모든 변경은 AGENTS.md의 **변경 이력** 테이블에 기록한다 (Sage 페르소나 책임).
- `.claude/`의 페르소나/스킬 정의를 추가/수정할 때 AGENTS.md의 정의와 일치하는지 반드시 확인한다. 불일치는 AGENTS.md를 정답으로 삼는다.
- 중간 산출물은 `_workspace/`에, 최종 산출물만 사용자 지정 경로에.
- 기술 스택은 현재 미정. Dungeon Architect 페르소나가 사용자와 첫 합의 후 AGENTS.md의 "기술 스택" 섹션을 갱신한다.

## 사용자 정보

- 사용자: 원민호 (`uvcdev03@gmail.com`)
- 환경: Windows + PowerShell
- 선호 언어: TypeScript (bun) / Python (uv)

## 변경 이력

이 파일의 변경 이력은 별도로 관리하지 않는다. **AGENTS.md의 변경 이력 표가 정답이다.**
