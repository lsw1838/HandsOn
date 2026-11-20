# 프로젝트 상태

- 담당: 현재 Codex 세션. Git 저장소 초기화, .NET 10.0.403, Node 의존성·Toolkit 로컬 검사, PAC 2.15.1, Python SDK 1.1.0, 프로젝트 Canvas·Dataverse 플러그인 등록을 확인했습니다.
- 개발 대상: DEX_CRM_DEV (`d7d08350-4adb-e952-a3fb-322466ea1e90`). PAC·Dataverse CLI 인증과 Python SDK 실제 읽기를 확인했습니다. 비관리형 Solution `PowerPlatformHandsOnMvp`와 Publisher `PowerPlatformHandsOn` (`ppho`)을 재사용합니다.
- Playwright MCP 서버와 탭 목록 읽기를 확인했습니다. Dataverse MCP는 프로젝트 설정에 등록했으며 현재 Codex 세션에서의 도구 읽기는 재시작 후 확인해야 합니다. Canvas 앱·Studio 세션은 아직 선택되지 않았습니다.
- Git 원격 `origin`은 `https://github.com/lsw1838/HandsOn.git`으로 연결했습니다. 원격 저장소는 비어 있으며, 첫 커밋은 Git 작성자 정보 확인 대기 중입니다.
- 다음 행동: Git 작성자 이름·이메일을 받아 첫 로컬 커밋과 원격 전송을 완료합니다. Codex 재시작 후 MCP 연결을 검증하고 `$connect-pp`로 Canvas 앱과 Studio를 연결합니다.
