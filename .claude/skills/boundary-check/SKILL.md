---
name: boundary-check
description: mycraft에서 API 응답과 프론트엔드 훅 사이의 경계면 정합성을 검증하는 스킬. Hunter 페르소나의 핵심 도구. "API 검증", "경계면 확인", "응답 shape 비교", "프론트백 정합성", "이 응답이 프론트랑 맞는지" 표현에 활성화. 단순 존재 확인이 아니라 실제 응답 shape vs 프론트 기대 vs 실제 렌더링까지 교차 비교한다. 모듈이 하나 끝날 때마다 즉시 실행하는 점진적 검증.
---

# Boundary Check

API 엔드포인트와 프론트엔드 훅 사이의 정합성을 검증한다. **존재 확인이 아니라 교차 비교가 목적.**

## 왜 이 스킬이 필요한가

흔한 실수: "API 200 OK 떴고, 프론트 빌드 통과했으니 됐다"고 결론짓는 것.

실제 자주 발견되는 버그:
- API가 `{ data: [...] }` 반환하는데 프론트는 `{ items: [...] }` 기대.
- API가 `id: number`인데 프론트는 `id: string` 기대.
- nullable 필드 처리 불일치 (API는 `null` 반환, 프론트는 `undefined` 기대).
- 페이지네이션 메타 위치 불일치 (`pagination.total` vs `meta.total`).
- 날짜 포맷 불일치 (ISO 8601 vs Unix timestamp).

이 버그들은 **타입 검사에 잡히지 않는 경우가 많다** (특히 동적 타입이나 느슨한 타입 캐스팅 시).

## 검증 절차

### Step 1: 대상 식별

검증할 경계면 1개를 명확히 정한다:
- API 엔드포인트: `{HTTP Method} {Path}`
- 호출하는 프론트 코드: 훅/컴포넌트 파일 경로

### Step 2: API 측 실제 shape 캡처

방법 (스택에 따라):
- **HTTP 직접 호출**: `curl` / `httpie` / Postman으로 실제 응답을 받아 JSON 저장.
- **백엔드 라우트 코드 읽기**: 응답 직렬화 코드를 읽고 shape 추론.
- **타입 정의 확인**: OpenAPI/tRPC/GraphQL 스키마가 있다면 그것이 1차 source.

기록 형식:
```json
// _workspace/boundary_{endpoint}_api.json
{
  "status": 200,
  "shape": {
    "data": [{"id": "string", "name": "string", "createdAt": "string(ISO)"}],
    "meta": {"total": "number"}
  },
  "sample": { ... 실제 응답 1개 ... }
}
```

### Step 3: 프론트 측 기대 shape 캡처

프론트 훅(또는 fetch 호출)을 읽어 다음을 추출:
- 응답을 받는 함수 시그니처.
- 응답에서 꺼내 쓰는 필드 (전체).
- 각 필드의 사용 위치 (타입 단정 / 옵셔널 체이닝).

기록 형식:
```typescript
// _workspace/boundary_{endpoint}_front.md
// File: src/hooks/useXxx.ts
// Expected shape:
{
  data: [{ id: string, title: string, createdAt: string }]
  // 'meta' 미사용
  // 'name' 대신 'title' 사용 ← 불일치 가능성
}
// Used in: src/components/XxxList.tsx
```

### Step 4: 교차 비교

표로 정렬:

| 필드 | API 측 | 프론트 측 | 일치 여부 | 비고 |
|------|-------|---------|----------|------|
| data[].id | string | string | OK | |
| data[].name | string | (사용 안 함) | OK | 프론트가 'title'을 찾음 |
| data[].title | (없음) | string | **불일치** | 프론트가 존재하지 않는 필드 참조 |
| data[].createdAt | string ISO | string | 부분 일치 | 프론트가 포맷 가정 안 함 → 표시 시 깨질 수 있음 |
| meta.total | number | (사용 안 함) | OK | |

### Step 5: 런타임 검증

가능하면 실제로 실행해본다:
- dev server 띄우고 해당 페이지 열기.
- 네트워크 탭에서 응답 확인.
- 화면에 데이터가 의도대로 그려지는지 시각 확인.
- 빈 응답 / 단일 / 다수 / 매우 큰 응답 케이스.

스크린샷이나 콘솔 로그를 `_workspace/boundary_{endpoint}_runtime.md`에 첨부.

### Step 6: 보고

`_workspace/hunt_report_{topic}.md`에 다음 섹션 추가:

```markdown
## 경계면 점검: {endpoint}

| 필드 | API | 프론트 | 결과 |
|------|-----|------|-----|
| ... | ... | ... | ... |

### 발견된 불일치
1. {필드}: {설명} — 영향: {화면 깨짐/데이터 손실/...}
2. ...

### 권장 조치
- (Forge 작업) {파일:라인} 수정 — {변경 내용}
```

## 자동화 팁

스택이 정해진 후 다음을 고려:
- **Zod / Yup / TypeBox 런타임 스키마**: API 응답을 받자마자 검증, 불일치 시 명확한 에러.
- **OpenAPI codegen** / **tRPC**: 타입 자체를 공유해 컴파일 타임 보장.
- **계약 테스트** (Pact 등): 백엔드 변경 시 프론트 기대와의 충돌 자동 감지.

이러한 도구는 boundary-check를 **자동화**하지만 **대체하지는 않는다**. 도구가 잡지 못하는 의미적 불일치(필드명은 같은데 의미가 다름)는 여전히 사람이 검증.

## 안티패턴

- 타입스크립트가 통과했으니 OK라고 판단 — `as any`, 느슨한 캐스팅 시 검사 무력화.
- 단일 케이스만 테스트 — 빈/큰/null 응답에서 깨지는 코드 흔함.
- 백엔드 코드만 읽고 결론 — 실제 응답이 코드와 다를 수 있음 (미들웨어, 직렬화 변형).
- 한 번에 모든 엔드포인트 검증 시도 — 모듈 단위로 점진적으로.
