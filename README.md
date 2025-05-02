## 블로그 만들기 - 이진아

1. 프로젝트 개요
   Next.js, Supabase, TailwindCSS를 이용하여 사용자들이 글을 작성하고, 수정하고, 삭제할 수 있는 블로그 애플리케이션을 개발했습니다. 비로그인 사용자도 전체 글을 열람할 수 있으며, 로그인한 사용자는 댓글 작성과 본인 글 수정/삭제가 가능합니다. 관리자 계정은 전체 글을 수정하거나 삭제할 수 있습니다.

2. 기술 스택

* Next.js
* TypeScript
* TailwindCSS
* Supabase (Auth, DB)
* Vercel (배포)
* react-hot-toast (알림 UI)

3. 주요 프로젝트 구조

* `/pages`: 라우팅 처리 (index, write, post/\[id], edit/\[id], login, signup 등)
* `/components`: 공통 레이아웃, UI 컴포넌트
* `/hooks`: 사용자 인증 및 관리자 여부 확인용 커스텀 훅
* `/lib`: Supabase 클라이언트 초기화 및 공용 유틸 함수
* `/styles`: TailwindCSS 기반 전역 스타일

4. 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 환경변수
.env.local 파일에 Supabase 관련 환경 변수 입력
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

5. 기능 요약
   \| 기능 | URL | 메서드 | 설명 |
   \|------|-----|--------|------|
   \| 글 목록 조회 | `/` | GET | 전체 글 목록 보기 (비로그인 포함) |
   \| 글 작성 | `/write` | POST | 로그인한 사용자만 작성 가능 |
   \| 글 상세 조회 | `/post/[id]` | GET | 개별 글 확인 + 댓글 확인 |
   \| 글 수정 | `/edit/[id]` | PUT | 작성자 또는 관리자만 가능 |
   \| 글 삭제 | `/post/[id]` 또는 목록 | DELETE | 작성자 또는 관리자만 가능 |
   \| 댓글 작성 | `/post/[id]` | POST | 로그인 사용자만 작성 가능 |

6. 예시 화면 및 피드백 처리

* 모든 성공/실패 작업은 `react-hot-toast`를 통해 사용자에게 즉시 알림
* 비로그인 사용자가 제한된 기능 사용 시 로그인 페이지로 이동 유도
* 댓글, 답글, 게시글 삭제 등은 관리자/작성자 권한에 따라 조건부 노출

7. 관리자 기능

* Supabase `admin` 테이블에 UUID가 등록된 사용자만 관리자 권한 보유
* 관리자 계정은 다른 사용자의 글도 수정/삭제 가능

8. 테스트 환경

* macOS Ventura / Windows 11
* Node.js v18 이상, npm 9+
* 브라우저: Chrome, Safari

9. 아키텍처 흐름 요약

* 사용자 인증 및 권한: Supabase Auth 사용 (세션 기반)
* 데이터 저장: Supabase DB (posts, comments, admin)
* 상태관리: useState, useEffect 기반 간단 상태 추적
* UI 알림: react-hot-toast 사용 (로딩, 성공, 실패 피드백)

10. 배포 환경

* Vercel을 통한 정적 배포 완료
* CI/CD는 Vercel의 GitHub 연동으로 자동화됨

---
