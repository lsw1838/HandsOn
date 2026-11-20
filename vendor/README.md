# Vendored Power Platform assets

- power-platform-skills-codex/: 사용자 제공 Codex 포트. Canvas/Dataverse/Power Automate의 Skill과 참조 자료를 포함합니다.
- power-platform-skills-codex.source.json: 공급 커밋, 최초 복사 확인, 프로젝트 사본의 MCP JSON 호환 변경 기록입니다.
- power-platform-playwright-toolkit/: Microsoft Toolkit 소스, LICENSE, upstream.json과 원본/로컬 manifest를 보존합니다. npm ci 때 빌드합니다.

원본 Git 이력, node_modules, Python 가상환경/캐시, 실제 .env는 공급 자산에서 제외했습니다.
라이선스는 각 배포본/패키지의 LICENSE를 따릅니다. 공급 문서와 라이선스는 레거시 사용자 안내로 취급해 삭제하지 않습니다.
실제 사용·설정 절차는 ../docs/getting-started.md를 따릅니다. 자산 복사와 실제 플러그인 로딩·Microsoft 연결 성공은 구분합니다.
