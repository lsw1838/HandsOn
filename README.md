# Power Platform 프로젝트

Codex와 Canvas Authoring MCP를 사용해 Dataverse 기반 Canvas 앱을 만드는 프로젝트 골격입니다.

1. VS Code에서 프로젝트 폴더를 열고 Codex에 로그인합니다.
2. Codex 채팅에서 `$set-pp`를 호출해 의존성, Git, `.env`, MCP와 Solution을 준비합니다.
3. `$connect-pp`를 호출해 Canvas Studio 세션을 연결합니다.
4. 만들 앱을 자연어로 요청합니다. [게시판 목업](mockup/board.html)을 참고해 시작할 수 있습니다.

설치 요건과 연결 방법은 [시작 안내](docs/getting-started.md)를 참고하세요.

| 경로 | 역할 |
|---|---|
| `.agents/skills/` | 환경 준비와 Studio 연결 Skill |
| `mockup/` | 앱 구현에 참고할 화면 목업 |
| `canvas-work/app/` | Canvas 앱의 `.pa.yaml` 소스 |
| `solution/`, `data/` | Solution 소스와 초기 데이터 |
| `docs/`, `tests/` | 설계·검증 문서와 테스트 |
| `vendor/` | 공급 플러그인·Toolkit·라이선스 |
