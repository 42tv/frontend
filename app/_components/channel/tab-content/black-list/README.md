# Blacklist Management UI Components

블랙리스트 관리를 위한 종합적인 UI 컴포넌트 모음입니다.

## 구성 요소

### 1. BlacklistManager (메인 컴포넌트)
전체 블랙리스트 관리 기능을 통합한 메인 컴포넌트입니다.

```tsx
import { BlacklistManager } from '@/app/_components/channel/tab-content/black-list';

function MyPage() {
  return <BlacklistManager />;
}
```

### 2. BlacklistStats
블랙리스트 통계 정보를 표시하는 컴포넌트입니다.

- 전체 차단 회원 수
- 검색 결과 수
- 선택된 회원 수

### 3. BlacklistSearchForm
사용자 검색 및 새로운 사용자 차단을 위한 폼 컴포넌트입니다.

- 새 사용자 차단 기능
- 닉네임/ID 기반 검색
- 검색어 초기화

### 4. BlacklistActions
선택된 사용자들에 대한 액션과 정렬 옵션을 제공합니다.

- 선택된 사용자 일괄 해제
- 닉네임/차단일 기준 정렬
- 정렬 순서 변경 (오름차순/내림차순)

### 5. BlacklistTable
블랙리스트 사용자 목록을 테이블 형태로 표시합니다.

- 체크박스를 통한 다중 선택
- 프로필 이미지 표시
- 사용자 정보 (닉네임, ID)
- 차단일 표시
- 반응형 디자인

### 6. BlacklistAdvancedActions
고급 관리 기능을 제공합니다.

- 데이터 내보내기 (CSV/JSON)
- 30일 이상 된 기록 자동 정리
- 상세 통계 정보

## 주요 기능

### 🔍 검색 및 필터링
- 실시간 검색 (닉네임, 사용자 ID)
- 정렬 옵션 (닉네임, 차단일)
- 검색어 초기화

### 👥 사용자 관리
- 새로운 사용자 차단
- 다중 선택을 통한 일괄 해제
- 개별 사용자 선택/해제

### 📊 통계 및 분석
- 실시간 통계 정보
- 기간별 차단 현황
- 시각적 데이터 표시

### 📤 데이터 관리
- CSV/JSON 형태로 데이터 내보내기
- 오래된 기록 자동 정리
- 백업 및 복원 지원

### 🎨 UI/UX
- 다크 테마 지원
- 반응형 디자인
- 로딩 상태 표시
- 에러 처리

## 사용 예시

### 기본 사용법
```tsx
import { BlacklistManager } from '@/app/_components/channel/tab-content/black-list';

export default function BlacklistPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">블랙리스트 관리</h1>
      <BlacklistManager />
    </div>
  );
}
```

### 개별 컴포넌트 사용
```tsx
import { 
  BlacklistStats, 
  BlacklistTable, 
  BlacklistSearchForm 
} from '@/app/_components/channel/tab-content/black-list';

export default function CustomBlacklistPage() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  return (
    <div>
      <BlacklistStats 
        totalCount={users.length}
        filteredCount={users.length}
        selectedCount={selectedUsers.length}
      />
      <BlacklistSearchForm
        searchTerm=""
        onSearchChange={(term) => {}}
        onAddUser={async (userId) => {}}
        onClearSearch={() => {}}
        isLoading={false}
      />
      <BlacklistTable
        users={users}
        selectedUsers={selectedUsers}
        onSelectAll={(checked) => {}}
        onSelectUser={(userId, checked) => {}}
        isLoading={false}
      />
    </div>
  );
}
```

## API 요구사항

이 컴포넌트는 다음 API 함수들을 사용합니다:

- `getBlacklist()`: 블랙리스트 목록 조회
- `addToBlacklist(userId: string)`: 사용자 차단
- `removeMultipleFromBlacklist(userIds: string[])`: 다중 사용자 차단 해제

## 타입 정의

```tsx
interface BlacklistUser {
  user_idx: number;
  user_id: string;
  nickname: string;
  profile_img: string;
  blocked_at: string;
}
```

## 스타일링

모든 컴포넌트는 Tailwind CSS를 사용하여 스타일링되었으며, 다크 테마를 지원합니다.

## 데모

`BlacklistDemo` 컴포넌트를 사용하여 전체 기능을 미리 볼 수 있습니다:

```tsx
import { BlacklistDemo } from '@/app/_components/channel/tab-content/black-list';

export default function DemoPage() {
  return <BlacklistDemo />;
}
```
