# Power Platform Project Instructions

## 목적과 범위

- 프로젝트 Skill은 **[set-pp](.agents/skills/set-pp/SKILL.md), [connect-pp](.agents/skills/connect-pp/SKILL.md) 두 개**다. 구현은 [공급 Canvas Skill](vendor/power-platform-skills-codex/plugins/canvas-apps/skills/canvas-app/SKILL.md)과 공급 Dataverse Skill을 사용한다. 별도 인터뷰·계획·실행 Skill 없이 짧은 자연어 요청으로 진행한다.
- 프로젝트에 포함된 원본 또는 이 프로젝트 카탈로그로 설치한 공급 플러그인만 사용한다. 제외된 개인 전역 Skill·사내 계획/실행 Skill·다른 프로젝트의 운영 지침을 대체 경로로 읽거나 설치하지 않는다. 이 저장소에서는 전역 AGENTS.md가 권하는 Power Platform 개인 Skill, 참고 문서, 개선 기록도 프로젝트 작업에 사용하지 않는다. 같은 이름이 여러 곳에 있으면 프로젝트 사본을 사용한다. 프로젝트 카탈로그로 설치한 공급 플러그인의 캐시는 사용할 수 있다. 위임하는 경우에도 같은 범위를 전달한다. 공급 Skill 원본과 시스템/조직 보안 정책은 유지한다.

## 준비와 구현

- 현재 폴더/Git 상태와 STATUS를 확인한다. 현재 프로젝트의 환경·앱·연결을 기준으로 작업한다. 환경/Solution/앱 ID는 준비 Skill의 [자동 조회 기준](.agents/skills/set-pp/references/environment-discovery.md)으로 확인하고 실제 선택만 묻는다.
- `$set-pp`은 프로젝트 의존성·개인 .env·Git·환경/Solution을 준비한다. `$connect-pp`은 선택한 앱·Studio·Coauthoring·데이터 원본 연결을 안내/확인한다. Solution 안에 앱을 만들거나 기존 앱을 편집하라는 요청에서 Studio 세션이 없다면 connect-pp를 따른다. 브라우저 MCP로 대상 화면을 열고, 빈 앱 생성·데이터 원본 추가·로그인/MFA는 필요한 경우 열린 탭에서 안내한다.
- 기본 앱은 [화면 목업](mockup/board.html)과 [DB 명세](mockup/board-db.md)의 한 테이블·목록·등록·상세 모달·수정·삭제 범위다. 관리자·댓글·첨부·이미지·Teams·대규모 오류/성능 시험을 자동으로 범위에 추가하지 않는다.
- 앱 요청에 필요한 짧은 요구 확인과 공급 Canvas 절차의 필수 승인/구현은 수행하되 장문의 인터뷰나 별도 계획 문서 계층을 새로 만들지 않는다. 계획만 요청했다면 분석/계획만 하고 앱 수정을 시작하지 않는다.
- 기본은 현재 담당이 진행하며 서브에이전트를 자동 추가하지 않는다. 같은 앱의 Studio 쓰기/compile/게시는 한 담당만 수행하고 타 담당의 연결을 빼앗지 않는다. STATUS는 실제 접속자 잠금이 아니다.

## 소스·브라우저·검증

- `canvas-work/app/`에는 `.pa.yaml`만 두고 공급 절차의 설계/계획 Markdown은 `docs/designs/`에 둔다. sync는 Studio→로컬, compile은 로컬→Studio다. 현재 로컬/원격 변경을 보존하고 적용 방향을 확인한다. Git 분리는 원격 앱 분리가 아니다.
- VS Code·CLI는 프로젝트 Playwright MCP, 데스크톱은 현재 제공되는 Browser를 사용한다. 설정과 목업 localhost 절차는 시작 안내를 따른다. 도구 호스트/보안 오류를 재설치·내부 패키지 수정·다른 도구로 반복 우회하지 않는다.
- 구현 중에는 구문·참조·컴파일/수식 오류와 기본 확인을 수행한다. 구현 묶음 뒤에 테스트 글 하나의 등록·상세·수정·삭제 결과를 Dataverse와 목록에서 확인한다. 명백한 저장 실패는 해결하되 매 수정마다 전체 회귀/긴 경계 시험을 반복하지 않는다. 소스/앱 버전을 구분하고 미검증을 성공으로 보고하지 않는다.
- **게시본 검증 요청**에서는 확인된 실행 URL과 대상 앱을 기준으로 `tests/canvas/`의 Power Platform Playwright Toolkit 테스트를 실행한다. 적합한 테스트가 없거나 컨트롤이 바뀌었으면 Playwright MCP로 실제 런타임을 관측해 요청한 동작의 테스트를 작성하거나 수정하고 바로 실행한다. 테스트 작성에 대한 별도 요청을 기다리지 않는다. Studio 미리보기와 `npm run test:toolkit`의 로컬 예제 검사는 게시본 실행과 구분한다. 인증이나 승인된 데이터 쓰기 범위가 부족하면 해당 검증만 보류하고 이유를 남긴다.
- 검증한 작업 단위마다 관련 소스와 짧은 진행 기록만 명시적으로 stage해 로컬 커밋하고 실제 해시를 보고한다. 기존 사용자 변경·stage를 보존하고 .env/인증/설치·브라우저 캐시는 제외한다. 작성자가 없으면 이름·이메일만 한 번 받아 로컬 설정한다. 자동 push·무단 reset/clean/amend는 하지 않는다.
- 게시·배포·데이터 쓰기는 확인된 요청 범위를 따르고 기존 승인을 재사용한다. 연결 장애가 지속되면 확인한 원인과 필요한 조치를 기록한다.

## 기록

- STATUS는 현재 상태·담당·다음 행동만 짧게 유지한다. 한국어는 UTF-8 저장 후 확인한다.
- 설치·연결·로컬 검사·실제 화면·데이터 왕복 결과를 구분한다. 공급 참조·라이선스는 보존하고 배포에는 실제 .env·Git·개발 앱/데이터·인증 프로필을 포함하지 않는다.
