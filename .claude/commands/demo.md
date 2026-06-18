# UI Demo 페이지 생성 skill

이 skill은 현재 프로젝트의 디자인 시스템과 완벽하게 어울리는 **목업(mock) demo 페이지**를 `/demo/{feature}/` 경로에 생성합니다.

---

## 실행 전 필수 확인

다음 파일들을 **반드시 먼저 읽고** 현재 색상 토큰과 컴포넌트 패턴을 파악하세요:
- `app/globals.css` — CSS 변수 정의 (라이트/다크 테마)
- `tailwind.config.ts` — 커스텀 색상 토큰
- 기존 demo 컴포넌트 (예: `app/channel/components/tab-content/black-list/demo/`) — 패턴 참고

---

## 생성할 파일 구조

```
app/
├── demo/
│   └── {feature}/
│       ├── page.tsx              # 허브(목록) 페이지
│       ├── {variant}/
│       │   └── page.tsx          # 각 시안 페이지
│       └── _components/
│           ├── {Feature}DemoShell.tsx   # 공통 레이아웃 래퍼
│           ├── {Feature}DemoHub.tsx     # 시안 목록 허브
│           ├── {Feature}[Variant]Demo.tsx  # 시안별 컴포넌트 (2~4개)
│           └── {feature}DemoData.ts     # 목업 데이터
```

**경로 규칙**: `/demo/{feature}` (예: `/demo/fan-grade`, `/demo/chat-ui`, `/demo/settlement`)

---

## 디자인 시스템 — 반드시 준수

### 색상 토큰 (Tailwind 클래스로만 사용)

| 용도 | 라이트/다크 공통 토큰 |
|------|----------------------|
| 페이지 배경 | `bg-background` |
| 카드/섹션 배경 | `bg-bg-secondary` |
| 테두리 | `border-border-primary` |
| 테두리(호버) | `border-border-hover` |
| 본문 텍스트 | `text-text-primary` |
| 보조 텍스트 | `text-text-secondary` |
| 강조색 (파랑) | `text-accent`, `bg-accent`, `bg-accent/10`, `border-accent/30` |
| 강조 호버 | `hover:bg-accent-hover` |
| 성공 | `text-success`, `bg-success/10` |
| 경고 | `text-warning`, `bg-warning/10` |
| 오류 | `text-error`, `bg-error/10` |

### 컴포넌트 패턴

**카드:**
```tsx
<div className="rounded-lg border border-border-primary bg-background p-4 transition-colors hover:border-border-hover hover:bg-bg-secondary">
```

**배지/태그:**
```tsx
<span className="rounded-full border border-border-primary bg-bg-secondary px-2.5 py-1 text-xs text-text-secondary">
```

**기본 버튼:**
```tsx
<button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border-primary bg-background px-4 text-sm font-medium text-text-primary transition-colors hover:border-border-hover hover:bg-bg-secondary">
```

**강조 버튼:**
```tsx
<button className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50">
```

**입력 필드:**
```tsx
<input className="h-11 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-accent" />
```

**섹션 제목 레이블:**
```tsx
<p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
```

**테이블:**
```tsx
<table className="w-full">
  <thead className="border-b border-border-primary bg-bg-secondary">
    <tr className="text-left text-xs font-semibold text-text-secondary">
  <tbody className="divide-y divide-border-primary">
    <tr className="text-sm hover:bg-bg-secondary">
```

---

## DemoShell 구조 (공통 레이아웃)

DemoShell은 모든 demo 페이지의 공통 래퍼입니다. 다음 요소를 포함해야 합니다:

1. **헤더**: 레이블(accent 색상) + 제목 + 설명 + "목록으로" 링크
2. **탭 내비게이션**: 각 시안으로 이동하는 그리드 탭 (현재 페이지 활성화 표시)
3. **children**: 실제 시안 내용

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// react-icons/fi에서 아이콘 import

interface {Feature}DemoShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function {Feature}DemoShell({ title, description, children }: {Feature}DemoShellProps) {
  const pathname = usePathname();
  // 탭 아이템 정의 (href, label, description, icon)
  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      {/* 헤더 */}
      <div className="mb-6 border-b border-border-primary pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              {Feature} UI Demo
            </p>
            <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">{description}</p>
          </div>
          <Link href="/demo/{feature}" className="inline-flex h-10 items-center justify-center rounded-lg border border-border-primary px-4 text-sm font-medium text-text-primary transition-colors hover:border-border-hover hover:bg-bg-secondary">
            데모 목록
          </Link>
        </div>
      </div>
      {/* 탭 내비게이션 */}
      <nav className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-{N}">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
              className={`flex min-h-[72px] items-center gap-3 rounded-lg border p-3 transition-colors ${
                active
                  ? "border-accent bg-accent/10 text-text-primary"
                  : "border-border-primary bg-background text-text-secondary hover:border-border-hover hover:bg-bg-secondary hover:text-text-primary"
              }`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active ? "bg-accent text-white" : "bg-bg-secondary text-text-primary"}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="block text-xs">{item.description}</span>
              </span>
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
```

---

## DemoHub 구조 (시안 목록 허브)

허브 페이지는 **각 시안으로 이동하는 카드 그리드**입니다.

```tsx
"use client";
// Demo 링크 카드 그리드 + FiArrowRight hover 효과
// 각 카드: 아이콘 + 제목 + 설명 + 태그들 + "보기" 링크
// 레이아웃: lg:grid-cols-{N}
// 카드 최소 높이: min-h-[260px]
```

---

## 시안 유형 — 기능에 맞게 선택

아래 유형 중 **기능 성격에 맞는 2~4가지**를 선택하여 구현합니다:

| 유형 | 설명 | 적합한 상황 |
|------|------|-------------|
| **테이블형** | 검색·필터·정렬·체크박스·일괄 작업 | 대량 데이터 관리 |
| **카드형** | 상태별 보드 또는 그리드 카드 | 모바일, 빠른 파악 |
| **상세 패널형** | 좌측 목록 + 우측 상세 분할 | 검토·메모·상세 확인 |
| **폼형** | 입력 폼, 다단계 wizard | 등록·설정·신청 |
| **대시보드형** | 통계 카드 + 차트 영역 + 요약 테이블 | 현황 파악·분석 |
| **타임라인형** | 시간순 이벤트 목록 | 이력·로그 확인 |
| **모달형** | 트리거 버튼 + 오버레이 모달 | 확인 다이얼로그·상세 팝업 |

---

## 목업 데이터 (`{feature}DemoData.ts`) 규칙

- 실제 API를 **절대 호출하지 않음** — 정적 배열로 구성
- 한국어 닉네임/내용 포함, 실제감 있는 데이터 (10~15개 항목)
- 타입 정의와 유틸 함수(포맷터, 레이블 매퍼 등)를 같은 파일에 포함
- `as const` 활용으로 타입 안전성 확보

```ts
"use client";

export type {Feature}Status = "active" | "pending" | "expired";  // 기능에 맞게 조정

export interface {Feature}DemoItem {
  id: number;
  // ... 기능에 맞는 필드 정의
}

export const demoItems: {Feature}DemoItem[] = [
  // 10~15개의 현실감 있는 한국어 데이터
];

// 유틸 함수들
export function getStatusLabel(status: {Feature}Status): string { ... }
export function getStatusClass(status: {Feature}Status): string { ... }
export function formatDate(dateStr: string): string { ... }
```

---

## 페이지 파일 규칙

각 라우트 `page.tsx`는 단순히 컴포넌트를 import하여 렌더링합니다:

```tsx
// app/demo/{feature}/page.tsx
import { {Feature}DemoHub } from "./_components/{Feature}DemoHub";
export default function {Feature}DemoPage() {
  return <{Feature}DemoHub />;
}

// app/demo/{feature}/{variant}/page.tsx
import { {Feature}{Variant}Demo } from "../_components/{Feature}{Variant}Demo";
export default function {Feature}{Variant}DemoPage() {
  return <{Feature}{Variant}Demo />;
}
```

---

## 인터랙션 필수 요소

demo 페이지는 **실제 동작하는 목업**이어야 합니다:

- [ ] 검색/필터가 있다면 `useState`로 실시간 필터링 동작
- [ ] 버튼 클릭 시 상태 변경 (추가/삭제/토글)
- [ ] 로딩 상태나 빈 상태(empty state) UI 포함
- [ ] 선택·일괄 작업이 있다면 선택 개수 표시 + 액션 바
- [ ] 반응형: 모바일(단일 컬럼) → 태블릿 → 데스크탑 레이아웃 자연스럽게 전환
- [ ] hover/focus/active 상태 모두 구현 (`transition-colors` 필수)
- [ ] 다크모드 자동 대응 (CSS 변수 토큰만 사용하면 자동)

---

## 완료 후 체크리스트

- [ ] `npm run lint` 통과
- [ ] TypeScript 에러 없음 (`"use client"` 적용, 타입 명시)
- [ ] 모든 경로 (`/demo/{feature}`, `/demo/{feature}/{variant}`) 접근 가능
- [ ] 다크모드에서 색상 깨짐 없음 (CSS 변수 토큰 외 하드코딩 색상 없음)
- [ ] 콘솔 에러 없음
- [ ] 빈 상태(empty state) 표시 확인
- [ ] 모바일 레이아웃 확인

---

## 실행 방법

사용자가 `/demo {기능명}` 또는 `{기능명} demo 만들어줘` 형태로 요청하면:

1. 기능명에서 feature slug 결정 (예: `팬 등급` → `fan-grade`)
2. 해당 기능의 성격 파악 후 적합한 시안 유형 2~4개 선택
3. 위 파일 구조대로 파일 생성
4. 생성 후 접근 가능한 URL 목록 안내
