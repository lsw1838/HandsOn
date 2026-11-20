---
name: connect-pp
description: Verify the selected Dataverse environment and Solution, prepare a Canvas app in Studio, and connect its coauthoring session and available data source. Use after set-pp or to resume the connection.
---

## 프로젝트 공통 기준

이 Skill 폴더에서 `../../../`에 있는 [AGENTS.md](../../../AGENTS.md)를 먼저 읽는다. 개인 전역 Skill/운영 문서를 참조하지 않고 프로젝트에 포함된 Skill과 공급 플러그인만 사용한다. 작업 단위 완료 시 AGENTS.md의 검증·자동 로컬 커밋 규칙을 적용한다. 현재 프로젝트 루트를 기준으로 경로를 확인한다.

# Connect PP

`$set-pp` 다음에 `$connect-pp`로 선택한 Solution의 Canvas 앱을 준비하고 Studio의 Coauthoring 세션을 연결한다. 브라우저 MCP로 기존 앱의 Studio 또는 대상 Solution을 열고, 앱이 없으면 열린 Solution에서 빈 앱을 만들도록 안내한다. 테이블이 아직 없으면 데이터 원본 연결은 테이블 생성 후에 진행한다.

## 현재 대상과 준비 상태

- 이 Skill 위치의 `../../../`에서 프로젝트 루트를 확인하고 [AGENTS.md](../../../AGENTS.md), [시작 안내](../../../docs/getting-started.md), [STATUS.md](../../../STATUS.md)를 읽는다.
- `.env`의 필요한 키와 workflow.config.json을 실제 PAC 대상과 대조한다. 이미 선택한 환경/Solution/앱을 우선 재사용한다. 조회 가능한 값은 직접 수집하고 설정 충돌이나 대상 선택이 필요한 부분만 확인한다.
- 도구·인증·Solution이 아직 준비되지 않았다면 [set-pp](../set-pp/SKILL.md)의 필요한 준비 절차를 읽고 이어간다. 전체 설치·재로그인·Git 초기화를 반복하지 않는다.

## 자동 조회 기준

[환경·Solution·Canvas 자동 조회](../set-pp/references/environment-discovery.md)를 먼저 읽는다. PAC와 실제 Solution/Canvas 메타데이터로 앱 ID와 Studio/실행 URL을 자동으로 찾아 .env와 workflow 설정에 기록한다. URL을 복사해 보내 달라고 사용자에게 요청하지 않는다.

## 1. Dataverse와 Solution 실제 확인

1. 호스트의 Dataverse MCP가 사용 가능한지 확인하고 테이블 목록/스키마 등 작은 메타데이터 조회를 실제로 성공시킨다. 서버 설정 파일 존재나 PAC 대체 조회를 MCP 성공으로 보고하지 않는다.
2. 준비된 Solution의 unique name으로 실제 Solution/Publisher를 읽어 환경·이름·접두사·소속을 확인한다. SDK/CLI 읽기는 포함된 [dv-solution](../../../vendor/power-platform-skills-codex/plugins/dataverse/skills/dv-solution/SKILL.md)을 따른다. Python이 필요하면 프로젝트 `.venv`를 우선 사용하고 번들 helper/기존 인증을 재사용한다.
3. MCP가 현재 세션에 로딩되지 않았으면 [dv-connect](../../../vendor/power-platform-skills-codex/plugins/dataverse/skills/dv-connect/SKILL.md)의 Codex 절차로 설정/기동 상태를 확인한다. 재시작이 필요하면 STATUS에 다음 확인을 남기고 재시작 후 같은 호출로 이어간다. 토큰·비밀번호를 받거나 보안 정책/관리자 동의/allowlist를 임의 변경하지 않는다.

## 2. 브라우저에서 Solution 또는 Studio 열기

브라우저는 AGENTS.md의 실행 호스트별 기준을 따른다. VS Code/CLI에서는 `$set-pp`가 준비한 Playwright MCP를 재사용하고 데스크톱에서는 사용 가능한 Browser를 사용한다. 현재 브라우저의 탭 목록과 페이지를 확인해 대상 탭을 재사용한다. 일반 Chrome의 로그인이나 탭이 Playwright 전용 프로필에 공유된다고 가정하지 않는다.

- **기존 앱이 있으면:** 실제 Canvas 구성요소를 조회해 환경과 Solution 소속을 확인한다. 동일한 Studio 탭이 이미 열려 있으면 재사용한다. 없으면 [자동 조회 기준](../set-pp/references/environment-discovery.md)으로 구성한 Studio URL을 브라우저 MCP로 열고 편집 화면이 표시됐는지 확인한다.
- **앱이 없으면:** 앱 이름만 확인한 뒤 브라우저 MCP로 선택한 Solution을 직접 연다. 이미 검증한 상세 링크가 있으면 사용한다. 없으면 해당 클라우드의 Power Apps Maker 포털에서 확인한 환경의 **Solutions** 목록을 열고, 조회한 이름과 Solution ID에 해당하는 항목을 선택한다. 기본 환경이나 이름이 비슷한 Solution을 임의로 선택하지 않는다.
- **열린 Solution에서 사용자 작업:** **새로 만들기 → 앱 → Canvas 앱**으로 빈 앱을 만들도록 안내한다. 새 Studio 탭이 열리면 저장하고 Coauthoring을 켠 뒤 열어 둔다. 로그인·MFA가 필요하면 현재 열린 브라우저에서 해당 단계만 사용자에게 맡긴다.
- **같은 브라우저에서 이어가기:** 앱이 저장되면 탭 목록에서 새 Studio 탭을 찾고, Solution의 Canvas 구성요소를 다시 조회해 앱 이름·환경·ID를 대조한다. 필요한 경우 원래 Solution 탭에서 구성요소 목록을 새로 고친다. 확인한 Studio 탭을 유지한 채 다음 단계에서 Canvas Authoring MCP에 연결한다.
- 브라우저 도구가 없거나 해당 탭을 열 수 없을 때만 에이전트가 확인한 Solution 또는 Studio 링크를 사용자에게 제공한다. 브라우저가 실제로 대상 화면에 도착했는지 확인하고, 링크만 표시하거나 탐색만 요청한 상태와 구분한다.

## 3. Canvas MCP 세션 연결

- [configure-canvas-mcp](../../../vendor/power-platform-skills-codex/plugins/canvas-apps/skills/configure-canvas-mcp/SKILL.md)를 읽고 적용한다. 플러그인 서버와 직접 실행 대안을 동시에 켜지 않는다.
- 공통 자동 조회 기준에 따라 PAC와 선택한 Solution의 Canvas 구성요소에서 실제 앱 식별자를 읽고 Studio/실행 URL을 구성해 .env에 기록한다. 앞 단계에서 확인한 Studio 탭을 유지한다. 공급 configure-canvas-mcp의 URL 질문 단계는 적용하지 않고 조회한 환경/앱 ID로 connect한다. 여러 앱일 때만 표시 이름을 선택하게 한다.
- connect의 성공을 확인한다. 로그인 계정 불일치·닫힌 탭·Coauthoring 누락·호스트 재시작을 구분하고 공급 Skill의 복구 순서를 따른다. 성공한 뒤 같은 연결을 반복하지 않는다.
- 공통 키 대응대로 확인한 앱 이름·실행용 ID·tenant와 구성한 Studio/실행 URL을 .env에 기록하고 workflow.config.json의 development.canvasAppId/appPlayUrl도 맞춘다. ID를 모르는 주소를 추측하지 않는다. 주소 구성, 활성 세션 연결, 게시·실행 성공은 각각 구분하며 다른 설정은 보존한다.

## 4. Dataverse 데이터 원본 연결

1. 연결할 업무 테이블이 설계/현재 대화에서 이미 정해졌다면 실제 존재와 스키마를 조회한다. 미정이면 사용할 테이블을 짧게 묻는다.
2. 테이블이 아직 없다면 **Canvas 세션 연결 완료, 데이터 원본은 테이블 준비 후 연결**로 남긴다. 이 단계를 채우려고 임의 테이블·샘플 데이터·계정/연락처 테이블을 만들거나 연결하지 않는다.
3. 대상 테이블이 있으면 [add-data-source](../../../vendor/power-platform-skills-codex/plugins/canvas-apps/skills/add-data-source/SKILL.md)를 적용한다. 현재 Canvas MCP는 새 연결을 직접 추가하지 못하므로, 사용자가 열린 Studio의 데이터 패널 → 데이터 추가에서 해당 Dataverse 테이블을 선택하도록 안내한다.
4. 사용자의 완료 응답 후 list_data_sources와 get_data_source_schema로 실제로 보이는 이름과 컬럼/형식을 확인한다. 추가 버튼을 눌렀다는 말만으로 성공 처리하지 않는다. 같은 테이블이 이미 연결돼 있으면 재추가하지 않는다.

## 범위와 완료

- 이 호출은 선택한 Solution의 빈 앱 준비 안내와 연결 검증까지다. 업무 테이블/행 생성, 화면/Power Fx 작성, Flow·외부 연동, 게시/배포는 시작하지 않는다. 기존 YAML을 sync로 덮어쓰지 않는다.
- 사용자가 처리할 일은 필요한 이름·대상 선택, Studio 조작, 로그인/MFA, 호스트 재시작뿐이다. 그 외 조회·설정 기록·실행 가능한 검증은 에이전트가 이어간다.
- Dataverse MCP 읽기, Solution 확인, Canvas 세션, 데이터 원본/스키마 상태를 구분해 짧게 보고한다. 테이블 미준비/로그인 대기/호스트 재시작은 그 단계만 남기며 전체 연결 완료라고 하지 않는다.
- STATUS에는 확인된 현재 상태·다음 행동만 갱신하고, 한국어는 UTF-8 저장 후 다시 읽어 보존을 확인한다. URL의 인증 매개변수·토큰·쿠키는 로그/문서에 남기지 않는다. 이후 같은 `$connect-pp` 호출로 남은 연결을 이어간다.
