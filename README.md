## 블로그 만들기 - 이진아

## 1. 프로젝트 개요
Next.js, Supabase, TailwindCSS를 이용하여
사용자들이 글을 작성하고 수정 및 삭제할 수 있는 블로그 애플리케이션을 개발했습니다.  
비로그인 사용자는 전체 글을 자유롭게 열람할 수 있으며,
로그인한 사용자는 댓글 작성과 본인 글에 대한 수정/삭제가 가능합니다.
관리자 계정은 모든 글을 수정하거나 삭제할 수 있습니다.

---

## 2. 기술 스택

- **Next.js**
- **TypeScript**
- **TailwindCSS**
- **Supabase** (Auth, DB)
- **Vercel** (배포)
- **react-hot-toast** (알림 UI)

---

## 3. 주요 프로젝트 구조

```
src/
├── components/ # 공통 레이아웃 및 UI 컴포넌트
├── hooks/ # 사용자 인증 및 관리자 여부 확인용 커스텀 훅
├── lib/ # Supabase 클라이언트 초기화 및 유틸 함수
├── pages/ # 라우팅 처리 (index, write, post/[id], edit/[id], login, signup 등)
├── styles/ # TailwindCSS 기반 스타일
```

---

## 4. 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 환경 변수 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 5. 기능 요약

| 기능      | URL            | 설명                   |
| ------- | -------------- | -------------------- |
| 글 목록 조회 | `/`            | 전체 글 목록 보기 (비로그인 포함) |
| 글 작성    | `/write`       | 로그인한 사용자만 작성 가능      |
| 글 상세 조회 | `/post/[id]`   | 개별 글 및 댓글 확인 가능      |
| 글 수정    | `/edit/[id]`   | 작성자 또는 관리자만 수정 가능    |
| 글 삭제    | `/post/[id]`   | 작성자 또는 관리자만 삭제 가능    |
| 댓글 작성   | `/post/[id]`   | 로그인한 사용자만 댓글 작성 가능   |
| 로그아웃 기능 | `/logout`      | 로그인한 사용자만 로그아웃 가능    |

---

## 6. 사용자 피드백 및 UX 처리

- 모든 작업 결과는 `react-hot-toast`를 사용해 실시간 알림 제공
- 로그인하지 않은 사용자가 글 작성 시, 로그인 페이지로 리디렉션
- 관리자 또는 작성자만 댓글/글 수정 및 삭제 버튼 노출

---

## 7. 관리자 기능

- Supabase의 `admin` 테이블에 UUID가 등록된 사용자만 관리자 권한 보유
- 관리자 계정은 **다른 사용자의 글도 수정 및 삭제 가능**

---

## 8. 테스트 환경

- OS: macOS Ventura / Windows 11
- Node.js: v18 이상
- npm: v9 이상
- 브라우저: Chrome, Safari

---

## 9. 아키텍처 흐름 요약

- **인증 및 권한**: Supabase Auth (세션 기반)
- **DB 구성**: posts / comments / admin 테이블
- **상태관리**: React useState / useEffect 사용
- **알림 UX**: `react-hot-toast` 사용 (로딩, 성공, 실패 알림 처리)

---

## 10. 배포 환경

- **Vercel**을 통한 정적 배포 완료
- GitHub와 Vercel 연동으로 CI/CD 자동화

---

## 11. 추가 기능 (선택 사항 완료)
- **답글 기능**: 게시글에 답글을 작성할 수 있습니다.
- **대댓글 기능**: 답글에 다시 답글(대댓글)을 달 수 있습니다.
- **글 검색 기능**: 게시글을 키워드로 검색할 수 있습니다.
- **소셜 로그인 (Google)**: 구글 계정을 통한 로그인 기능을 지원합니다.

---

## 12. 제출 링크

- 🔗 **GitHub Repository**: https://github.com/dev-gina/blog-react  
- 🔗 **Vercel 배포 URL**: https://blog-react-fbf2.vercel.app  
- 📹 **시연 영상**: 이메일 제출 완료

---


