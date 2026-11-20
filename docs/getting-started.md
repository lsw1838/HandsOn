# 시작 안내

## 필요한 프로그램과 권한

VS Code와 Codex 확장, Node.js 24 및 npm, PAC CLI, Git, Chrome을 준비합니다. Power Platform 계정으로 Dataverse 개발 환경에 접근하고, 필요한 Solution과 Canvas 앱을 만들 수 있는 권한이 있어야 합니다.

## 환경 준비와 앱 연결

VS Code에서 프로젝트 폴더 전체를 열고 Codex에 로그인합니다. 아래 두 명령은 Codex 채팅에 순서대로 입력합니다.

1. **`$set-pp`** — `global.json`에 맞는 .NET SDK를 확인하고, 없으면 설치합니다. 프로젝트 의존성·플러그인·MCP를 준비하고 Git을 확인합니다. PAC에 로그인하고 개발 환경을 선택하면, Codex가 환경과 Solution 메타데이터를 조회해 `.env`와 `workflow.config.json`에 기록합니다. 기존 Publisher와 Solution을 선택하거나 새로 만들 수 있습니다.
2. **`$connect-pp`** — 선택한 Solution의 Canvas 앱과 Studio의 Coauthoring 세션을 연결합니다. Codex가 브라우저 MCP로 기존 앱의 Studio를 열거나, 앱이 없으면 선택한 Solution을 직접 열어 줍니다. 열린 화면에서 빈 Canvas 앱을 만들고 Coauthoring을 켜면, Codex가 새 Studio 탭을 찾아 연결을 이어갑니다. 필요한 로그인이나 MFA는 직접 진행하고 Studio 탭을 열어둡니다.

Git 저장소가 없는 폴더에서는 `$set-pp`가 `git init -b main`과 첫 로컬 커밋을 준비합니다. 작성자 정보가 없으면 이름과 이메일을 받아 저장소에만 설정합니다. 실제 `.env`, 인증 정보, 브라우저 프로필은 커밋에서 제외합니다.

## 앱 만들기

연결 후 만들 앱을 자연어로 요청합니다. [게시판 목업](../mockup/board.html)과 [DB 명세](../mockup/board-db.md)를 활용하려면 다음과 같이 요청할 수 있습니다.

> mockup/board.html과 mockup/board-db.md를 참고해서 Dataverse 기반 게시판 Canvas 앱을 만들어줘. 글 등록, 목록, 상세 모달, 수정, 삭제를 구현해줘.

Codex가 테이블을 준비한 뒤, 필요한 경우 Studio의 **데이터 → 데이터 추가**에서 그 테이블을 선택하도록 안내합니다. 연결이 끝나면 화면과 Power Fx를 구현하고, 테스트 글 하나를 등록해 상세 모달을 열고, 수정과 삭제 결과가 Dataverse와 목록에 반영되는지 확인합니다.

## 의존성 설치와 플러그인 등록

`$set-pp`가 다음 명령을 사용합니다. 기존 설치를 재사용하고 누락된 항목을 준비합니다.

```powershell
npm ci
npm install -g @openai/codex@0.169.0
codex plugin marketplace add .
codex plugin add canvas-apps@workshop-minimal-power-platform
codex plugin add dataverse@workshop-minimal-power-platform
codex plugin list --marketplace workshop-minimal-power-platform --available --json
```

프로젝트 루트에서 등록합니다. Codex CLI 설치 명령은 CLI가 없을 때 사용합니다. `npm ci`가 Toolkit을 빌드하며, 필요하면 `npm run toolkit:build` 또는 `npm run test:toolkit`을 각각 실행할 수 있습니다.

## 게시본 검증

Codex에 “게시된 앱이 정상 동작하는지 확인해 주세요”라고 요청합니다. Codex가 실제 앱 실행 URL을 확인하고 `tests/canvas/`의 Toolkit 테스트를 찾아 실행합니다. 적합한 테스트가 없다면 게시본에서 컨트롤을 확인해 작성한 뒤 실행합니다. `npm run test:toolkit`은 Toolkit 설치 상태를 확인할 때 쓰는 로컬 예제 검사입니다.

## 브라우저와 목업 열기

VS Code와 CLI에서는 Playwright MCP를 사용합니다. `$set-pp`가 기존 서버를 확인하고 필요한 경우 `npm run mcp:playwright`로 시작합니다. 재시작이 필요하면 VS Code를 다시 열고 같은 Skill을 이어갑니다. Playwright의 전용 브라우저 프로필에서는 Microsoft 로그인이 별도로 필요할 수 있습니다.

브라우저가 로컬 HTML 경로를 지원하지 않을 때는 설치된 Python으로 `mockup/`만 localhost에 열 수 있습니다. 프로젝트에 `.venv`가 있으면 그 Python을 사용합니다.

```powershell
& .\.venv\Scripts\python.exe -m http.server 8765 --bind 127.0.0.1 --directory mockup
```

브라우저에서 `http://127.0.0.1:8765/board.html`을 열고, 미리보기가 끝나면 서버를 종료합니다.
