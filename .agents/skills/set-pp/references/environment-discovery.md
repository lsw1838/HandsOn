# 환경·Solution·Canvas 자동 조회와 .env 기록

`$set-pp`와 `$connect-pp`는 선택한 PAC 대상과 실제 Solution·Canvas 메타데이터를 조회해 URL과 ID를 기록한다. 사용자 개입은 로그인, 권한 확인, 대상 선택, 이름 결정, Studio 조작이 필요한 경우로 한정한다.

## 1. PAC의 활성 대상부터 확인

- `pac auth who`, `pac env who`, 필요 시 `pac auth list`, `pac solution list`를 읽는다. 이름·URL·Tenant ID·Environment ID·실제 활성 프로필을 추출한다. Organization ID를 Environment ID로 쓰지 않는다.
- 명령 출력 전체에는 사용자 식별 정보가 있으므로 문서/로그에 그대로 복사하지 않는다. 토큰 조회 명령을 실행하거나 토큰을 .env에 기록하지 않는다.
- 기존 .env/workflow 대상과 PAC가 다르면 대상 선택만 확인한다. 맞는 대상은 재사용하고 조회 가능한 값을 다시 묻지 않는다. PAC가 로그인되지 않았다면 로그인/환경 선택을 안내한다.

## 2. 선택한 Solution의 실제 구성요소 조회

PAC 목록에 없는 상세 GUID·Publisher·Canvas 소속은 포함된 Dataverse SDK/helper 또는 사용 가능한 MCP의 읽기 도구로 보완한다. 설치된 `.venv`와 번들 `plugins/dataverse/scripts/auth.py`의 `get_client`를 우선 사용한다. 새 인증/HTTP 프록시를 만들 필요가 없다.

Windows에서 번들 `auth.py`를 실행할 때는 Python에 `-X utf8`을 지정한다. UTF-8로 저장한 한글 주석이 포함된 `.env`를 Windows 기본 인코딩으로 읽으면 인증 전에 `UnicodeDecodeError`가 발생할 수 있다.

SDK 1.1의 `records.list()`는 Record 객체를 반환하므로 `record.data`로 값을 읽는다. 객체의 문자열 표현을 JSON으로 취급하거나 그 안에서 GUID를 정규식으로 긁지 않는다.

조회 예시(실제 이름은 현재 설정에서 가져오고 아래 이름을 복사하지 않는다):

```python
# root: 확인한 프로젝트 루트; client: 번들 get_client('dv-connect')의 반환값
# solution_name: 현재 설정/사용자가 선택한 Solution unique name
escaped_name = solution_name.replace("'", "''")
solution_records = client.records.list(
    'solution', filter=f"uniquename eq '{escaped_name}'",
    select=['solutionid', 'uniquename', '_publisherid_value', 'ismanaged'], top=2,
)
solutions = [r.data for r in solution_records]
# 0개/복수이면 새 값으로 덮어쓰지 말고 대상 선택/존재를 먼저 해결한다.
if len(solutions) != 1:
    raise RuntimeError("선택한 Solution의 존재/대상을 먼저 확인하세요.")
solution = solutions[0]
solution_id = solution['solutionid']
publisher_id = solution['_publisherid_value']
publishers = [r.data for r in client.records.list(
    'publisher', filter=f"publisherid eq {publisher_id}",
    select=['publisherid', 'uniquename', 'customizationprefix'], top=1,
)]
components = [r.data for r in client.records.list(
    'solutioncomponent',
    filter=f"_solutionid_value eq {solution_id} and componenttype eq 300",
    select=['objectid'],
)]
apps = []
for component in components:
    object_id = component['objectid']
    apps.extend(r.data for r in client.records.list(
        'canvasapp', filter=f"canvasappid eq {object_id}",
        select=['canvasappid', 'uniquecanvasappid', 'displayname', 'name',
                'appopenuri', 'canvasapptype', 'componentstate'],
    ))
```

- 삭제된 계층(componentstate 2/3)은 후보에서 제외한다. 일반 Canvas 앱(canvasapptype 0)을 대상으로 하고 Code App/Component Library와 구분한다.
- 같은 앱의 계층/중복 행은 실제 앱 식별자로 정리한다. 설정의 앱이 Solution 안에 있으면 재사용하고, 후보가 1개면 자동 선택한다. 여러 개일 때만 표시 이름으로 선택을 묻는다.
- 앱이 없으면 [connect-pp의 브라우저 절차](../../connect-pp/SKILL.md)로 확인한 Solution을 열고, 생성·저장 뒤 이 조회를 다시 실행한다. URL을 보내 달라고 요청하지 않는다. 앱이 Solution에 없는 경우 소속 문제를 먼저 해결한다.
- 실행용 앱 ID는 `uniquecanvasappid`와 `appopenuri`의 앱 식별자를 확인해 결정한다. `canvasappid`는 Dataverse 내부 기본키이므로 값만 보고 실행 ID라고 단정하지 않는다. 메타데이터가 아직 없다면 저장/권한/전파 상태를 확인한다.

## 3. URL은 확인된 식별자로 구성

Public cloud에서 확인된 environment_id, app_id, tenant_id로 다음과 같이 주소를 구성한다. 실제 앱 ID 대신 내부 GUID, 이름, 추정값을 넣지 않는다.

```python
from urllib.parse import urlencode
studio_url = (
    f'https://make.powerapps.com/e/{environment_id}/canvas/?'
    + urlencode({'action': 'edit',
                 'app-id': f'/providers/Microsoft.PowerApps/apps/{app_id}'})
)
play_url = (
    f'https://apps.powerapps.com/play/e/{environment_id}/a/{app_id}?'
    + urlencode({'tenantId': tenant_id})
)
```

- PAC cloud와 실제 appopenuri 호스트/식별자를 대조한다. 다른 cloud에는 Public 주소를 적용하지 않고 공급 configure-canvas-mcp의 cloud 기준과 실제 메타데이터를 사용한다. 조회 실패의 대안으로 사용자 URL 복사를 요구하지 않는다.
- 구성된 URL을 .env에 기록하고 브라우저 MCP에서 해당 Studio 탭을 찾거나 해당 URL을 연다. 로그인·Coauthoring이 필요하면 열린 탭에서 이어간다.
- 구성된 주소는 활성 Studio 세션/게시/실행 성공의 증거가 아니다. Canvas MCP는 조회한 environment_id/app_id와 올바른 environment_category로 connect하고 성공을 별도로 확인한다.
- 공급 configure-canvas-mcp의 **connect 파라미터·로그인 복구**를 참고하되, 그 문서의 '사용자에게 Studio URL 질문' 단계는 이 프로젝트에서 적용하지 않는다.

## 4. .env 키 대응

기존 사용자 키/주석을 보존하고 확인된 값만 생성·갱신한다. 아직 생성되지 않은 앱 등은 빈칸으로 둔다. 여러 개인 설정을 기록하는 파일이며 모든 값이 하나의 프로그램에 자동 로딩되는 것은 아니다.

| 키 | 조회/기록 기준 |
|---|---|
| DATAVERSE_URL / TENANT_ID | PAC 환경/인증의 실제 대상 |
| MCP_CLIENT_ID | 포함된 dv-connect의 Codex 연결 기준 |
| DATAVERSE_PLUGIN_VERSION / DATAVERSE_PLUGIN_AGENT | 실제 manifest 버전 / codex |
| PAC_AUTH_PROFILE | 실제 활성 프로필 이름(없으면 확인한 index) |
| POWER_APPS_ENVIRONMENT_NAME / POWER_APPS_ENVIRONMENT_ID | PAC Friendly Name / Environment ID |
| SOLUTION_NAME / SOLUTION_ID | 실제 Solution unique name / solutionid |
| PUBLISHER_NAME / PUBLISHER_ID / PUBLISHER_PREFIX | 실제 Publisher uniquename / publisherid / customizationprefix |
| CANVAS_APP_NAME / CANVAS_APP_ID | 선택한 앱 표시 이름 / 확인한 실행용 앱 ID |
| CANVAS_APP_TENANT_ID | 실제 앱 대상 tenant. 기존 TENANT_ID와 대조 |
| CANVAS_STUDIO_URL / CANVAS_APP_URL | 확인한 식별자로 구성한 Studio / 실행 주소 |

workflow.config.json의 development 환경/앱, solution 이름/Publisher/prefix도 같은 관측값으로 맞춘다. 기존 다른 설정은 보존한다. CANVAS_APP_URL 구성만으로 앱 게시가 완료됐다고 기록하지 않는다.

POWER_APPS_ENVIRONMENT_ID, CANVAS_APP_ID, CANVAS_APP_TENANT_ID, CANVAS_APP_URL은 포함된 Toolkit의 buildCanvasAppUrlFromEnv가 읽는 process.env 이름과 같다. 현재 모든 runner/MCP가 .env를 자동 로딩한다고 설명하지 않는다. MCP 설정·connect는 Skill이 반영하고 실행 테스트를 만들 때 필요한 env 로딩은 해당 runner에서 처리한다.

이전 프로젝트의 POC_SHAREPOINT_*, 자체 HTTP MCP URL, POWER_PLATFORM_STORAGE_STATE/CDP_ENDPOINT/CONFIG_ROOT/FRAME_SELECTOR와 POC_TEST_*는 이전 custom runner/프록시 기준이다. 그 구현이 없는 현재 프로젝트에 필수 항목으로 복사하지 않는다.

근거: 포함된 configure-canvas-mcp/SKILL.md, Toolkit src/utils/app-helpers.ts, [CanvasApp 메타데이터](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/canvasapp), [PAC canvas](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/canvas).
