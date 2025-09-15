'use client';
import { useState, useEffect } from 'react';
import { 
  Policy, 
  PolicyFormData, 
  PolicyPageType, 
  CreatePolicyDto,
  VersionIncrementType
} from '@/app/_types/admin';
import { 
  createPolicy, 
  getActivePolicy 
} from '@/app/_apis/admin/policy';
import HtmlEditor from '@/app/_components/admin/HtmlEditor';
import { 
  showSuccessNotification, 
  showErrorNotification 
} from '@/app/_components/utils/overlay/notificationHelpers';

type ActiveTab = 'terms' | 'privacy';

export default function PolicyManagement() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('terms');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 각 탭별 실제 정책 데이터 (백엔드에서 가져온 데이터)
  const [policies, setPolicies] = useState<Record<string, Policy | null>>({
    terms: null,
    privacy: null
  });

  // 각 탭별 편집 중인 데이터
  const [editData, setEditData] = useState<Record<string, PolicyFormData>>({
    terms: {
      page: PolicyPageType.TERMS,
      title: '서비스 이용약관',
      content: '',
      versionIncrementType: VersionIncrementType.MINOR,
      is_active: true
    },
    privacy: {
      page: PolicyPageType.PRIVACY,
      title: '개인정보처리방침',
      content: '',
      versionIncrementType: VersionIncrementType.MINOR,
      is_active: true
    }
  });

  const tabs = [
    { id: 'terms' as const, label: '이용약관' },
    { id: 'privacy' as const, label: '개인정보처리방침' }
  ];

  // 현재 활성 탭의 편집 데이터 가져오기
  const getCurrentData = (): PolicyFormData => {
    return editData[activeTab];
  };

  // 현재 활성 탭의 편집 데이터 업데이트
  const updateCurrentData = (updates: Partial<PolicyFormData>) => {
    setEditData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        ...updates
      }
    }));
  };

  // 백엔드에서 정책 데이터 로드
  const loadPolicies = async () => {
    try {
      setLoading(true);
      
      // 이용약관과 개인정보처리방침 데이터를 각각 가져옴
      const [termsResponse, privacyResponse] = await Promise.all([
        getActivePolicy(PolicyPageType.TERMS).catch(() => ({ success: false, data: null })),
        getActivePolicy(PolicyPageType.PRIVACY).catch(() => ({ success: false, data: null }))
      ]);

      const newPolicies: Record<string, Policy | null> = {
        terms: termsResponse.success ? termsResponse.data || null : null,
        privacy: privacyResponse.success ? privacyResponse.data || null : null
      };

      setPolicies(newPolicies);

      // 편집 데이터 초기화 (백엔드 데이터로)
      const newEditData: Record<string, PolicyFormData> = {
        terms: newPolicies.terms ? {
          page: newPolicies.terms.page,
          title: newPolicies.terms.title,
          content: newPolicies.terms.content,
          versionIncrementType: VersionIncrementType.MINOR,
          is_active: newPolicies.terms.is_active
        } : {
          page: PolicyPageType.TERMS,
          title: '서비스 이용약관',
          content: '<h1>서비스 이용약관</h1><p>새로운 이용약관을 작성해주세요.</p>',
          versionIncrementType: VersionIncrementType.MINOR,
          is_active: true
        },
        privacy: newPolicies.privacy ? {
          page: newPolicies.privacy.page,
          title: newPolicies.privacy.title,
          content: newPolicies.privacy.content,
          versionIncrementType: VersionIncrementType.MINOR,
          is_active: newPolicies.privacy.is_active
        } : {
          page: PolicyPageType.PRIVACY,
          title: '개인정보처리방침',
          content: '<h1>개인정보처리방침</h1><p>새로운 개인정보처리방침을 작성해주세요.</p>',
          versionIncrementType: VersionIncrementType.MINOR,
          is_active: true
        }
      };

      setEditData(newEditData);
    } catch (error) {
      console.error('Failed to load policies:', error);
      showErrorNotification('정책을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  // 탭 변경 핸들러
  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
  };

  // 저장 핸들러
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const currentData = getCurrentData();
      
      // 항상 새 정책 생성 (버전별 기록)
      const createDto: CreatePolicyDto = {
        page: currentData.page,
        title: currentData.title,
        content: currentData.content,
        versionIncrementType: currentData.versionIncrementType,
        is_active: currentData.is_active
      };
      
      const response = await createPolicy(createDto);
      
      if (response.success) {
        // 로컬 상태 업데이트
        setPolicies(prev => ({
          ...prev,
          [activeTab]: response.data || null
        }));
        showSuccessNotification(`${currentData.title}이(가) 저장되었습니다.`, {
          onConfirm: () => window.location.reload()
        });
      } else {
        showErrorNotification(response.message || '저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to save policy:', error);
      showErrorNotification('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">정책 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  const currentData = getCurrentData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">정책 관리</h1>
        <p className="text-muted-foreground">이용약관과 개인정보처리방침을 관리합니다</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-accent-100 text-accent-100'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 정책 편집 영역 */}
      <div className="bg-card border border-border rounded-lg">
        
        <div className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                정책 제목
              </label>
              <input
                type="text"
                value={currentData.title}
                onChange={(e) => updateCurrentData({ title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                placeholder="정책 제목을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                버전 증가 타입
              </label>
              <select
                value={currentData.versionIncrementType}
                onChange={(e) => updateCurrentData({ versionIncrementType: e.target.value as VersionIncrementType })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value={VersionIncrementType.MAJOR}>Major (1.0 증가)</option>
                <option value={VersionIncrementType.MINOR}>Minor (0.1 증가)</option>
              </select>
            </div>
          </div>

          {/* HTML 에디터 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              정책 내용 (HTML)
            </label>
            <HtmlEditor
              value={currentData.content}
              onChange={(content) => updateCurrentData({ content })}
              placeholder="<h1>정책 제목</h1><p>정책 내용을 HTML로 작성하세요...</p>"
              className="min-h-96"
            />
          </div>

          {/* 활성화 설정 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={currentData.is_active}
              onChange={(e) => updateCurrentData({ is_active: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-foreground">
              활성화 (사용자에게 표시)
            </label>
          </div>

          {/* 저장 버튼 */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button
              onClick={handleSave}
              disabled={saving || !currentData.title.trim() || !currentData.content.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded-lg transition-colors"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
            
            <div className="text-sm text-muted-foreground">
              {policies[activeTab] ? (
                <>
                  현재 버전: {policies[activeTab]!.version}
                  <br />
                  마지막 저장: {new Date(policies[activeTab]!.updated_at).toLocaleString('ko-KR')}
                  <br />
                  상태: {policies[activeTab]!.is_active ? '활성' : '비활성'}
                </>
              ) : (
                '새 정책 (저장되지 않음)'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}