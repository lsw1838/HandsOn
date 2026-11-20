---
name: set-pp
description: Prepare a Power Platform development environment with Git, project dependencies, PAC target discovery, .env, plugins, MCP connections, and an unmanaged Solution.
---

## 프로젝트 공통 기준

이 Skill 폴더에서 `../../../`에 있는 [AGENTS.md](../../../AGENTS.md)를 먼저 읽는다. 개인 전역 Skill/운영 문서를 참조하지 않고 프로젝트에 포함된 Skill과 공급 플러그인만 사용한다. 작업 단위 완료 시 AGENTS.md의 검증·자동 로컬 커밋 규칙을 적용한다. 현재 프로젝트 루트를 기준으로 경로를 확인한다.

# Set PP

`$set-pp`는 프로젝트 의존성, Git, PAC 환경, 플러그인·MCP, `.env`와 Solution을 준비한다. 실제 Power Platform 작업에는 프로젝트에 포함된 공급 Skill을 사용한다. 현재 프로젝트에 연결할 것으로 확인한 대상만 사용한다. 준비가 끝나면 `$connect-pp`로 Canvas Studio 연결을 이어간다.

## 기준 읽기

1. 이 Skill 위치에서 `../../../`로 프로젝트 루트를 확인한다. CWD나 사용자 홈을 프로젝트로 추정하지 않는다.
2. [AGENTS.md](../../../AGENTS.md)의 공통 규칙, [시작 안내](../../../docs/getting-started.md), [STATUS.md](../../../STATUS.md)를 읽는다. `.env`와 workflow.config.json은 필요한 키만 확인하고 인증 정보 전체를 출력하지 않는다.
3. 재호출 시 기록과 실제 상태를 대조해 완료된 설치·로그인·리소스를 재사용한다. 재시작/로그인 후에도 같은 호출로 이어간다. 단계마다 다음 명령 입력을 요구하지 않는다.

## 환경값 자동 수집

[환경·Solution·Canvas 자동 조회](references/environment-discovery.md)를 읽고 적용한다. PAC의 활성 환경/프로필과 실제 Solution/Publisher를 조회해 .env.example의 대응 키를 작성한다. 조회 가능한 환경 이름·ID·URL과 Publisher/Solution ID는 자동으로 수집한다. Solution 생성 전에는 확인 가능한 환경 값부터 기록하고 생성 후 실제 결과를 추가한다. Canvas 앱이 아직 없으면 관련 값은 비워 두며 connect-pp에서 조회한다.

## .NET SDK 준비

Dataverse와 Canvas MCP 설정에 앞서 프로젝트 루트에서 `dotnet --version`을 실행한다. 정상 종료하면 `global.json`에 맞는 SDK가 선택된 것이므로 재사용한다. `dotnet --list-sdks`에 다른 버전이 표시되는 것만으로 완료 처리하지 않는다.

1. `dotnet`이 없거나 호환 SDK를 찾지 못하면 `global.json`의 `sdk.version`, `rollForward`, `allowPrerelease`를 읽는다. Windows에서는 `winget show --id Microsoft.DotNet.SDK.10 --exact --source winget --versions`로 프로젝트가 요구하는 SDK 계열의 설치 후보를 조회한다. 현재 `latestFeature`와 `allowPrerelease: false` 조합에서는 지정 버전과 같은 메이저·마이너이며 지정 버전 이상인 정식 SDK 중 가장 최신을 선택한다. 설정이 바뀌면 그 설정의 호환 조건과 SDK 계열을 사용한다.
2. 선택한 버전을 `winget install --id Microsoft.DotNet.SDK.10 --exact --source winget --version <선택한 버전>`으로 설치한다. WinGet을 사용할 수 없으면 [Microsoft .NET 다운로드](https://dotnet.microsoft.com/download/dotnet/10.0)의 해당 계열에서 호환되는 Windows **SDK 설치 프로그램**을 사용한다. 설치 승인이나 조직 정책으로 막히면 필요한 조치만 안내한다.
3. SDK를 설치한 뒤 프로젝트 루트에서 `dotnet --version`을 다시 실행한다. 기존 터미널에서 설치 경로가 보이지 않으면 VS Code와 터미널을 다시 열고 같은 Skill로 확인을 이어간다. 재확인 전까지 준비 완료로 표시하지 않는다. `global.json`과 기존 SDK는 유지하며, 공급 Dataverse 문서의 .NET 9 설치 예시보다 이 프로젝트의 SDK 설정을 우선한다.

## 준비 실행

- Node/npm, PAC, Git, Chrome, Codex CLI를 점검한다. Git은 `git --version`으로 실제 실행을 확인하고 없으면 설치한다. 설치 후 PATH가 반영되지 않으면 VS Code/터미널 재시작을 안내한다. 프로젝트의 lock 기준 설치·Toolkit 빌드와 로컬 플러그인 등록은 시작 안내의 의존성 설치·플러그인 등록 절차를 따른다. Toolkit 검사 통과는 실제 앱 연결 검증을 대신하지 않는다. 유효한 설치는 반복하지 않고 누락된 도구만 준비한다. 설치 권한·관리 정책을 우회하지 않는다.
- PAC 활성 프로필과 선택 환경을 먼저 조회한다. 로그인/선택이 없을 때만 사용자를 안내한다. 조회 가능한 URL·ID는 직접 수집한다. 기존 Dataverse/프로젝트 대상과 다르면 그 충돌만 확인한다.
- [dv-connect](../../../vendor/power-platform-skills-codex/plugins/dataverse/skills/dv-connect/SKILL.md)를 읽고 선택한 PAC 환경에 연결한다. 해당 Skill의 Codex 참조에 따라 `.env` 작성, SDK/helper, 별도 인증, 프로젝트 범위 MCP 설정과 실제 읽기 검증을 수행한다. 기본 예제 프로필/다른 호스트 설정을 그대로 복사하지 않는다.
- 공급 플러그인이 아직 설치되지 않아도 번들 문서를 직접 읽고 등록할 수 있다. vendor 파일을 수정하거나 전역 자체 Skill/커스텀 에이전트를 추가하지 않는다.
- Canvas Authoring MCP가 등록·기동되는지 확인한다. 앱/Studio 세션이 이미 지정돼 있으면 configure-canvas-mcp로 연결하고, 없으면 '앱 생성 후 세션 연결'로 남긴다. 새 앱·데이터 원본·업무 테이블을 준비 완료를 위해 임의 생성하지 않는다. Studio의 수동 데이터 추가는 앱 구현 때 안내한다.
- 실행 호스트별 브라우저 준비는 AGENTS.md와 시작 안내를 따른다. **VS Code/CLI에서는 Playwright MCP를 브라우저 검증 경로로 준비**한다. 고정 npm 의존성을 재사용해 `npm run mcp:playwright`로 서버를 시작하고 프로젝트의 기존 playwright MCP 항목을 활성화한다. 필요 재시작 후 실제 도구/탭 읽기를 확인하며, Microsoft 로그인/MFA만 사용자가 처리한다. OpenAI Browser 호스트 오류를 재설치/반복 호출로 해결하려 하지 않는다. 데스크톱에서 Browser가 동작하면 별도 Playwright 서버를 의무화하지 않는다.
- 프로젝트의 Canvas·Dataverse 플러그인만 등록한다.

## Git 저장소와 커밋 준비

Git 설치 확인에서 끝내지 않고 **이 프로젝트에서 로컬 커밋할 수 있는 상태**까지 준비한다.

1. 프로젝트 루트의 저장소 상태와 실제 Git top-level을 확인한다. 프로젝트 폴더에 저장소가 없으면 그 루트에서 `git init -b main`을 실행한다. 상위의 다른 저장소가 감지되면 Git 저장소 경계를 확인한 뒤 현재 프로젝트만 준비한다.
2. 기존 저장소의 브랜치·커밋·remote·사용자 변경은 그대로 사용한다.
3. 유효한 기존 Git 작성자 이름/이메일을 재사용한다. 터미널에서도 커밋할 수 있도록 로컬 작성자 설정을 확인한다. 필요한 값이 없으면 사용할 이름·이메일만 한 번에 묻고 이 저장소의 `git config --local`에 기록한다. 이름과 이메일은 현재 사용자가 제공한 값을 쓴다. GitHub 로그인은 로컬 커밋의 필수 조건이 아니다.
4. stage 전에 `.gitignore`를 확인한다. 실제 `.env`, 인증 캐시/프로필, node_modules, .venv, .workflow, 테스트 결과와 개인 데이터는 제외하고, `.env.example`, 프로젝트 Skill, 공급 소스/라이선스는 포함한다. 새 저장소의 첫 커밋 대상 파일을 검토한다.
5. HEAD가 없는 새 저장소에는 확인한 골격/준비 파일의 첫 로컬 커밋을 만든다. 기존 HEAD가 있으면 사용자 변경을 일괄 stage/commit하거나 검증용 빈 커밋을 만들지 않는다. 재호출로 첫 커밋을 반복하지 않는다. 서명/훅/저장소 정책을 끄지 말고 실패 원인을 해결하거나 필요한 사용자 조치만 안내한다.
6. 기존 저장소에서도 이번 준비로 변경한 배포 가능한 지침/설정이 있으면 AGENTS.md의 작업 단위 커밋 규칙으로 그 부분만 커밋한다. 실제 .env/인증 캐시만 바뀌었다면 빈 커밋을 만들지 않는다.
7. 새 저장소는 `git log -1`과 상태로 첫 커밋을 확인한다. 기존 저장소는 작성자·저장소/상태를 확인한다. 원격 저장소 생성·연결 변경·push는 이 준비 호출만으로 실행하지 않는다.

## Solution 준비

`$set-pp`의 범위에는 선택한 개발 환경의 **Publisher와 비관리형 Solution** 준비가 포함된다.

- 기존 `.env`/workflow 설정과 실제 환경에서 해당 Solution·Publisher를 조회한다. 맞는 대상이면 재사용한다.
- 대상이 미정이면 사용할 Solution과 Publisher의 이름·접두사를 한 번에 확인한다. 새로 만드는 경우 프로젝트에 맞는 이름과 접두사를 제안한다.
- 사용자가 그 대상/이름을 선택하면 [dv-solution](../../../vendor/power-platform-skills-codex/plugins/dataverse/skills/dv-solution/SKILL.md)의 생성 절차로 필요한 Publisher/Solution만 준비한다. 같은 선택을 거듭 확인하지 않는다. prefix 확인은 dv-solution의 요구를 따른다.
- 실제 생성 결과를 재조회하여 식별값과 Publisher 소속을 확인하고 `.env`/workflow.config.json에 기록한다. 로컬 `pac solution init`만으로 환경의 Solution이 생성됐다고 판단하지 않는다.
- 새 환경, 보안 역할/관리자 동의/allowlist 변경, 테이블·업무 행·앱·Flow 생성, 게시·배포는 이 호출 범위가 아니다. 해당 조치가 필요하면 대상과 필요한 권한만 구체적으로 안내한다.

## 개입과 이어가기

- 조회할 수 없는 대상 선택, 새 Solution 이름과 Publisher 접두사, 설정 충돌처럼 결정이 필요한 내용만 사용자에게 묻는다. 비밀번호·토큰을 채팅으로 받지 않는다.
- 로그인/MFA, 필요한 설치 권한, 호스트 재시작은 사용자가 처리한다. 그 외 설정 파일 작성/검사와 가능한 다음 단계는 에이전트가 수행한다.
- 호스트가 새 MCP를 아직 로딩하지 못했다면 실제 연결 성공으로 표시하지 않는다. STATUS.md에 현재 단계·구체적 다음 검증·남은 사용자 조치만 남기고 재시작 후 같은 호출로 이어간다. 동일 실패의 로그인·등록을 근거 없이 반복하지 않는다.

## 완료 보고

Git 초기화/작성자/첫 커밋 상태, 도구/패키지, PAC 대상, Dataverse 실제 읽기/MCP, Solution, Canvas 서버/세션, 현재 호스트의 브라우저 도구 준비/실제 읽기 상태를 짧게 구분해 보고한다. 설정 파일 존재만으로 성공을 선언하지 않는다. Canvas 앱이 없어 세션 연결을 남긴 것은 준비 결과에 명시한다.

확인한 현재 상태와 남은 조치는 STATUS.md에 갱신한다. 한국어 파일은 UTF-8로 명시해 저장한 뒤 다시 읽어 한글과 원문이 유지되는지 확인한다. 물음표로 변환된 본문은 연결 완료 근거로 재사용하지 않는다. 완료 시 업무 아이디어/설계/구현을 시작하지 않는다. 다음 연결 준비는 [connect-pp](../connect-pp/SKILL.md)로 이어가도록 안내한다.
